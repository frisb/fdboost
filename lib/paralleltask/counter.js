(function() {
  var CounterTask, completedValue,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  completedValue = 0;

  module.exports = CounterTask = (function(_super) {
    __extends(CounterTask, _super);

    function CounterTask() {
      return CounterTask.__super__.constructor.apply(this, arguments);
    }

    CounterTask.prototype.start = function() {
      var beginInclusive, boundaryKeys, boundaryKeysCallback, db, endExclusive, fdb, progress;
      fdb = this.options.fdb || require('fdb').apiVersion(200);
      db = fdb.open();
      beginInclusive = this.options.begin;
      endExclusive = this.options.end;
      progress = typeof this.options.progress !== 'undefined' ? ':p' : '';
      boundaryKeys = [];
      boundaryKeysCallback = (function(_this) {
        return function(err, iterator) {
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
              _this.sendToWorker(boundary);
            }
            _results = [];
            for (i = _k = 0, _ref = _this.workers.length; 0 <= _ref ? _k < _ref : _k > _ref; i = 0 <= _ref ? ++_k : --_k) {
              _results.push(_this.workers[i].send(''));
            }
            return _results;
          };
          return iterator.forEachBatch(func, complete);
        };
      })(this);
      return fdb.locality.getBoundaryKeys(db, beginInclusive, endExclusive, boundaryKeysCallback);
    };

    CounterTask.prototype.countKeys = require('./countkeys');

    CounterTask.prototype.onWorkerMessageReceived = function(data) {
      var options, parts;
      this.fdb = require('fdb').apiVersion(200);
      this.db = this.fdb.open();
      parts = data.split(':');
      options = {
        begin: parts[0],
        end: parts[1]
      };
      return this.countKeys(options, (function(_this) {
        return function(err, val) {
          return _this.onWorkerSubtaskComplete(err, val);
        };
      })(this));
    };

    CounterTask.prototype.onMasterSubtaskComplete = function(subtaskComplete) {
      completedValue += subtaskComplete.val;
      if (this.allWorkersFinished) {
        return this.emit('completed', completedValue);
      }
    };

    return CounterTask;

  })(require('parallelize'));

}).call(this);
