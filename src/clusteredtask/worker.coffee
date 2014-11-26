{EventEmitter} = require('events')

module.exports = class ClusteredTaskWorker extends EventEmitter
  constructor: ->
    waitingForMore = true
    startTime = new Date()
    totalStarted = 0
    totalFinished = 0
    
    progress =
      started: 0
      finished: 0
      rate: 0
    
    getRate = ->
      durationSec = (new Date() - startTime) / 1000
      ~~(progress.rate / durationSec)
    
    complete = (err, val) ->
      progress.rate++
      progress.finished++
      totalFinished++
      
      process.send
        complete: val
        working: waitingForMore || totalFinished < totalStarted
        #rate: getRate()
        
    func = (data) ->
      if (data is '')
        # send is over
        
        waitingForMore = false
      else
        progress.started++
        totalStarted++
        
        parts = data.split(':')
        options = 
          begin: parts[0]
          end: parts[1]
         
        #@onWorkerBoundariesReceived(parts[0], parts[1])
        @on('boundaryReceived', parts[0], parts[1])
    
    process.on('message', func)
    
    setInterval ->
      process.send
        progress: progress
      
      progress.rate = 0
      progress.started = 0
      progress.finished = 0
    , 250