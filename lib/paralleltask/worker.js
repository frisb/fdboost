(function() {
  var TaskExtension, func, getRate, module, progress, startTime, task, totalFinished, totalStarted, waitingForMore;

  module = process.argv[2];

  startTime = new Date();

  totalStarted = 0;

  totalFinished = 0;

  waitingForMore = true;

  progress = {
    started: 0,
    finished: 0,
    rate: 0
  };

  console.log(module);

  TaskExtension = require(module);

  task = new TaskExtension();

  task.onWorkerSubtaskComplete = function(err, val) {
    progress.rate++;
    progress.finished++;
    totalFinished++;
    return process.send({
      subtaskComplete: {
        error: err,
        val: val,
        finished: !waitingForMore && totalFinished >= totalStarted
      }
    });
  };

  getRate = function() {
    var durationSec;
    durationSec = (new Date() - startTime) / 1000;
    return ~~(progress.rate / durationSec);
  };

  func = function(data) {
    if (data === '') {
      return waitingForMore = false;
    } else {
      progress.started++;
      totalStarted++;
      return task.onWorkerMessageReceived(data);
    }
  };

  process.on('message', func);

  setInterval(function() {
    process.send({
      progress: progress
    });
    progress.rate = 0;
    progress.started = 0;
    return progress.finished = 0;
  }, 250);

}).call(this);
