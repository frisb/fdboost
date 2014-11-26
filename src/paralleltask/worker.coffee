module = process.argv[2]
startTime = new Date()
totalStarted = 0
totalFinished = 0
waitingForMore = true

progress =
  started: 0
  finished: 0
  rate: 0

console.log(module)

TaskExtension = require(module)
task = new TaskExtension()

task.onWorkerSubtaskComplete = (err, val) ->
  progress.rate++
  progress.finished++
  totalFinished++
  
  process.send
    subtaskComplete:
      error: err
      val: val
      finished: !waitingForMore && totalFinished >= totalStarted
      #rate: getRate()
      
getRate = ->
  durationSec = (new Date() - startTime) / 1000
  ~~(progress.rate / durationSec)
  
func = (data) ->
  if (data is '')
    # send is over
    
    waitingForMore = false
  else
    progress.started++
    totalStarted++
    
    task.onWorkerMessageReceived(data)

process.on('message', func)

setInterval ->
  process.send
    progress: progress
  
  progress.rate = 0
  progress.started = 0
  progress.finished = 0
, 250