async = require('async')
child_process = require('child_process')
path = require('path')

{EventEmitter} = require('events')

module.exports = class Task extends EventEmitter
  constructor: (@module, @options) ->
    
  run: (callback) ->
    @progress =
      started: 0
      finished: 0
      rate: 0
    
    @workerIndex = 0
    
    workerModulePath = path.join(__dirname, 'worker.coffee')
    @workers = (child_process.fork(workerModulePath, [@module]) for i in [0...@options.processes])
    
    configureWorker = (worker, cb) =>
      worker.on 'message', (m) =>
        if (m.subtaskComplete)
          worker.finished = m.subtaskComplete.finished
          
          @allWorkersFinished = true
          for w in @workers
            if (!w.finished)
              @allWorkersFinished = false
              break
            
          @onMasterSubtaskComplete(m.subtaskComplete) 
        else if (m.progress)
          @progress.started += m.progress.started
          @progress.finished += m.progress.finished
          @progress.rate += m.progress.rate
      
      worker.on 'exit', (code, signal) ->
        console.log(code, signal)
          
      cb(null)
      
    async.each @workers, configureWorker, (err) =>
      if (err)
        callback(err)
      else 
        @start()
        
    @on 'completed', (val) ->
      @stop()
      callback(null, val) if callback
      
    @on 'error', (err) ->
      @stop()
      callback(err) if callback
  
  start: ->
    @stop()
    #throw new Error('not implemented')
  
  stop: ->
    worker.kill() for worker in @workers
      
  onWorkerMessageReceived: ->
    throw new Error('not implemented')
  
  onMasterSubtaskComplete: ->
    throw new Error('not implemented')
    
  sendToWorker: (data) ->
    @workers[@workerIndex].send(data)
    @workerIndex++
    @workerIndex = 0 if @workerIndex is @workers.length