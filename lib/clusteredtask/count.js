(function() {
  var async, child_process, path;

  async = require('async');

  child_process = require('child_process');

  path = require('path');

  module.exports = function(tr, options, callback) {
    var completedValue, configureWorker, i, modulePath, parallel, progress, start, workers;
    if (!callback) {
      if (!options || typeof options === 'function') {
        if (typeof options === 'function') {
          callback = options;
        }
        options = tr;
        tr = null;
      }
    }
    parallel = require('./parallel')(this.fdb);
    progress = {
      started: 0,
      finished: 0,
      rate: 0
    };
    completedValue = 0;
    start = new Date();
    setInterval(function() {
      progress.time = ~~((new Date() - start) / 1000) + 'sec';
      console.log(progress);
      return progress.rate = 0;
    }, 1000);
    modulePath = path.join(__dirname, 'worker.coffee');
    workers = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = options.processes; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(child_process.fork(modulePath));
      }
      return _results;
    })();
    configureWorker = function(worker, cb) {
      worker.on('message', function(m) {
        var allFinished, w, _i, _len;
        if (m.complete) {
          completedValue += m.complete;
          worker.working = m.working;
          allFinished = true;
          for (_i = 0, _len = workers.length; _i < _len; _i++) {
            w = workers[_i];
            if (w.working) {
              allFinished = false;
              break;
            }
          }
          if (allFinished) {
            return callback(null, completedValue);
          }
        } else if (m.progress) {
          progress.started += m.progress.started;
          progress.finished += m.progress.finished;
          return progress.rate += m.progress.rate;
        }
      });
      return cb(null);
    };
    return async.each(workers, configureWorker, function(err) {
      if (err) {
        return callback(err);
      } else {
        return parallel(workers, options);
      }
    });
  };

}).call(this);
