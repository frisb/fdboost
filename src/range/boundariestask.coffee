module.exports = (FDBoost) ->
  fdb = FDBoost.fdb
  
  sendBoundaryKeys = (tr, master, keyRange) =>
    progress = if typeof(master.options.progress) isnt 'undefined' then '>p' else ''
    
    boundaryKeys = []
    
    boundaryKeysCallback = (err, iterator) ->
      func = (arr, next) ->
        boundaryKeys = boundaryKeys.concat(arr)
        next()
        
      complete = (err) ->
        boundaries = new Array(boundaryKeys.length)
        #
        for upperBoundary, i in boundaryKeys
          # if 1st boundary then begin key is the start of the range 
          lowerBoundary = if i is 0 then keyRange.begin else boundaryKeys[i - 1]
          
          begin = lowerBoundary.toString()
          end = upperBoundary.toString()
          
          # mark the last boundary
          finMarker = if i is boundaryKeys.length - 1 then 1 else 0
          
          boundaries[i] = "#{finMarker}>#{begin}>#{end}#{progress}"
        
        master.sendToWorker(boundary) for boundary in boundaries
        
        # Tell workers end of send
        master.workers[i].send('') for i in [0...master.workers.length]
        
      iterator.forEachBatch(func, complete)
    
    console.log('keyrange', keyRange)
    
    fdb.locality.getBoundaryKeys(tr || fdb.open(), keyRange.begin, keyRange.end, boundaryKeysCallback) 

  getBoundaryKeyRange = (tr, options, callback) =>
    if (options.end)
      callback(null, { begin: options.begin, end: options.end } )
    else 
      FDBoost.getLastKey tr, options.begin, (err, lastKey) ->
        if (err)
          callback(err)
        else if (lastKey)
          callback(null, { begin: options.begin, end: lastKey })
   
  complete = (err) ->
    console.log('error', err) if err
    
  distribute = (tr, master, callback) ->
    getBoundaryKeyRange tr, master.options, (err, keyRange) ->
      if (err)
        callback(err)
      else 
        sendBoundaryKeys(tr, master, keyRange)
  
  transactionalDistribute = fdb.transactional(distribute)
      
  class BoundariesTask extends require('parallelize')
    start: ->
      transactionalDistribute(@options.tr || FDBoost.db, @, complete)
      
    processWorkerMessage: (data) ->
      parts = data.split('>')
      
      console.log('parts', parts)
      
      # 1st boundary then range must
      boundary = 
        begin: parts[1]
        end: if parts[0] is 1 then fdb.KeySelector.firstGreaterThan(parts[2]) else fdb.KeySelector.firstGreaterOrEqual(parts[2])
        
      @processBoundary(boundary)
      
    #workerCompleted: (subtaskComplete) ->
      #completedValue += subtaskComplete.val
      
      #console.log(subtaskComplete)
      #
      #@emit('completed', completedValue) if (@allWorkersFinished)
    
    processBoundary: (boundary) ->
      throw new Error('not implemented')