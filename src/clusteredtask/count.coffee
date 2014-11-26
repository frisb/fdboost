async = require('async')
child_process = require('child_process')
path = require('path')

module.exports = (tr, options, callback) ->
  if (!callback)
    if (!options || typeof(options) is 'function')
      if (typeof(options) is 'function')
        callback = options 
      
      options = tr
      tr = null
  
  parallel = require('./parallel')(@fdb)

  progress =
    started: 0
    finished: 0
    rate: 0
   
  completedValue = 0
    
  start = new Date() 
  setInterval ->
    progress.time = ~~((new Date() - start) / 1000) + 'sec'
    
    console.log(progress)
    
    progress.rate = 0
  , 1000
  
  modulePath = path.join(__dirname, 'worker.coffee')
  workers = (child_process.fork(modulePath) for i in [0...options.processes])
  
  configureWorker = (worker, cb) ->
    worker.on 'message', (m) ->
      if (m.complete)
        completedValue += m.complete
        worker.working = m.working
        
        allFinished = true
        for w in workers
          if (w.working)
            allFinished = false
            break
            
        callback(null, completedValue) if (allFinished)
        
      else if (m.progress)
        progress.started += m.progress.started
        progress.finished += m.progress.finished
        progress.rate += m.progress.rate
      
    cb(null)
    
  async.each workers, configureWorker, (err) ->
    if (err)
      callback(err)
    else 
      parallel(workers, options)

