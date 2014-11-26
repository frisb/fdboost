completedValue = 0

module.exports = class CounterTask extends require('parallelize')
  start: ->
    fdb = @options.fdb || require('fdb').apiVersion(200)
    db = fdb.open()
    
    beginInclusive = @options.begin
    endExclusive = @options.end
    progress = if typeof(@options.progress) isnt 'undefined' then ':p' else ''
    
    boundaryKeys = []
    
    boundaryKeysCallback = (err, iterator) =>
      func = (arr, next) ->
        boundaryKeys = boundaryKeys.concat(arr)
        next()
        
      complete = (err, val) =>
        boundaries = new Array(boundaryKeys.length - 1)
        
        for upperLimit, i in boundaryKeys
          if (i > 0)
            begin = boundaryKeys[i - 1].toString('binary')
            end = upperLimit.toString('binary')
            boundaries[i - 1] = "#{begin}:#{end}#{progress}"
        
        @sendToWorker(boundary) for boundary in boundaries
        
        # Tell workers end of send
        @workers[i].send('') for i in [0...@workers.length]
        
      iterator.forEachBatch(func, complete)
    
    fdb.locality.getBoundaryKeys(db, beginInclusive, endExclusive, boundaryKeysCallback) 
  
  countKeys: require('./countkeys')
    
  onWorkerMessageReceived: (data) ->
    @fdb = require('fdb').apiVersion(200)
    @db = @fdb.open()
    
    parts = data.split(':')
    options = 
      begin: parts[0]
      end: parts[1]
    
    #console.log(options)
    
    @countKeys options, (err, val) =>
      @onWorkerSubtaskComplete(err, val)
      
  onMasterSubtaskComplete: (subtaskComplete) ->
    completedValue += subtaskComplete.val
    
    @emit('completed', completedValue) if (@allWorkersFinished)