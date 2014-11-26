(function() {
  module.exports = function(fdb) {
    var db;
    if (fdb == null) {
      fdb = require('fdb').apiVersion(200);
    }
    db = fdb.open();
    return function(workers, options) {
      var beginInclusive, boundaryKeys, boundaryKeysCallback, endExclusive, progress, sendToWorker, workerIndex;
      beginInclusive = options.begin;
      endExclusive = options.end;
      progress = typeof options.progress !== 'undefined' ? ':p' : '';
      workerIndex = 0;
      boundaryKeys = [];
      sendToWorker = function(data) {
        workers[workerIndex].send(data);
        workerIndex++;
        if (workerIndex === workers.length) {
          return workerIndex = 0;
        }
      };
      boundaryKeysCallback = function(err, iterator) {
        var complete, func;
        func = function(arr, next) {
          boundaryKeys = boundaryKeys.concat(arr);
          return next();
        };
        complete = function(err, val) {
          var begin, boundaries, boundary, end, i, upperLimit, _i, _j, _k, _len, _len1, _ref, _results;
          boundaries = new Array(boundaryKeys.length - 1);
          for (i = _i = 0, _len = boundaryKeys.length; _i < _len; i = ++_i) {
            upperLimit = boundaryKeys[i];
            if (i > 0) {
              begin = boundaryKeys[i - 1].toString('binary');
              end = upperLimit.toString('binary');
              boundaries[i - 1] = "" + begin + ":" + end + progress;
            }
          }
          for (_j = 0, _len1 = boundaries.length; _j < _len1; _j++) {
            boundary = boundaries[_j];
            sendToWorker(boundary);
          }
          _results = [];
          for (i = _k = 0, _ref = workers.length; 0 <= _ref ? _k < _ref : _k > _ref; i = 0 <= _ref ? ++_k : --_k) {
            _results.push(workers[i].send(''));
          }
          return _results;
        };
        return iterator.forEachBatch(func, complete);
      };
      return fdb.locality.getBoundaryKeys(db, beginInclusive, endExclusive, boundaryKeysCallback);
    };
  };

}).call(this);
