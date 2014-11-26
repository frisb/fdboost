module.exports = (fdb) ->
  fdb ?= require('fdb').apiVersion(200)
  db = fdb.open()
  
  (workers, options) ->
    beginInclusive = options.begin
    endExclusive = options.end
    progress = if typeof(options.progress) isnt 'undefined' then ':p' else ''
    
    workerIndex = 0
    boundaryKeys = []
    
    sendToWorker = (data) ->
      workers[workerIndex].send(data)
      workerIndex++
      workerIndex = 0 if workerIndex is workers.length
    
    boundaryKeysCallback = (err, iterator) ->
      func = (arr, next) ->
        boundaryKeys = boundaryKeys.concat(arr)
        next()
        
      complete = (err, val) ->
        boundaries = new Array(boundaryKeys.length - 1)
        
        for upperLimit, i in boundaryKeys
          if (i > 0)
            begin = boundaryKeys[i - 1].toString('binary')
            end = upperLimit.toString('binary')
            boundaries[i - 1] = "#{begin}:#{end}#{progress}"
        
        sendToWorker(boundary) for boundary in boundaries
        
        # Tell workers end of send
        workers[i].send('') for i in [0...workers.length]
        
      iterator.forEachBatch(func, complete)
    
    fdb.locality.getBoundaryKeys(db, beginInclusive, endExclusive, boundaryKeysCallback) 