(function() {
  var ClusteredTaskWorker, EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = ClusteredTaskWorker = (function(_super) {
    __extends(ClusteredTaskWorker, _super);

    function ClusteredTaskWorker() {
      var complete, func, getRate, progress, startTime, totalFinished, totalStarted, waitingForMore;
      waitingForMore = true;
      startTime = new Date();
      totalStarted = 0;
      totalFinished = 0;
      progress = {
        started: 0,
        finished: 0,
        rate: 0
      };
      getRate = function() {
        var durationSec;
        durationSec = (new Date() - startTime) / 1000;
        return ~~(progress.rate / durationSec);
      };
      complete = function(err, val) {
        progress.rate++;
        progress.finished++;
        totalFinished++;
        return process.send({
          complete: val,
          working: waitingForMore || totalFinished < totalStarted
        });
      };
      func = function(data) {
        var options, parts;
        if (data === '') {
          return waitingForMore = false;
        } else {
          progress.started++;
          totalStarted++;
          parts = data.split(':');
          options = {
            begin: parts[0],
            end: parts[1]
          };
          return this.on('boundaryReceived', parts[0], parts[1]);
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
    }

    return ClusteredTaskWorker;

  })(EventEmitter);

}).call(this);
