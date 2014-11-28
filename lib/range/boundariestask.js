(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = function(FDBoost) {
    var BoundariesTask, complete, distribute, fdb, getBoundaryKeyRange, sendBoundaryKeys, transactionalDistribute;
    fdb = FDBoost.fdb;
    sendBoundaryKeys = (function(_this) {
      return function(tr, master, keyRange) {
        var boundaryKeys, boundaryKeysCallback, progress;
        progress = typeof master.options.progress !== 'undefined' ? '>p' : '';
        boundaryKeys = [];
        boundaryKeysCallback = function(err, iterator) {
          var complete, func;
          func = function(arr, next) {
            boundaryKeys = boundaryKeys.concat(arr);
            return next();
          };
          complete = function(err) {
            var begin, boundaries, boundary, end, finMarker, i, lowerBoundary, upperBoundary, _i, _j, _k, _len, _len1, _ref, _results;
            boundaries = new Array(boundaryKeys.length);
            for (i = _i = 0, _len = boundaryKeys.length; _i < _len; i = ++_i) {
              upperBoundary = boundaryKeys[i];
              lowerBoundary = i === 0 ? keyRange.begin : boundaryKeys[i - 1];
              begin = lowerBoundary.toString();
              end = upperBoundary.toString();
              finMarker = i === boundaryKeys.length - 1 ? 1 : 0;
              boundaries[i] = "" + finMarker + ">" + begin + ">" + end + progress;
            }
            for (_j = 0, _len1 = boundaries.length; _j < _len1; _j++) {
              boundary = boundaries[_j];
              master.sendToWorker(boundary);
            }
            _results = [];
            for (i = _k = 0, _ref = master.workers.length; 0 <= _ref ? _k < _ref : _k > _ref; i = 0 <= _ref ? ++_k : --_k) {
              _results.push(master.workers[i].send(''));
            }
            return _results;
          };
          return iterator.forEachBatch(func, complete);
        };
        console.log('keyrange', keyRange);
        return fdb.locality.getBoundaryKeys(tr || fdb.open(), keyRange.begin, keyRange.end, boundaryKeysCallback);
      };
    })(this);
    getBoundaryKeyRange = (function(_this) {
      return function(tr, options, callback) {
        if (options.end) {
          return callback(null, {
            begin: options.begin,
            end: options.end
          });
        } else {
          return FDBoost.getLastKey(tr, options.begin, function(err, lastKey) {
            if (err) {
              return callback(err);
            } else if (lastKey) {
              return callback(null, {
                begin: options.begin,
                end: lastKey
              });
            }
          });
        }
      };
    })(this);
    complete = function(err) {
      if (err) {
        return console.log('error', err);
      }
    };
    distribute = function(tr, master, callback) {
      return getBoundaryKeyRange(tr, master.options, function(err, keyRange) {
        if (err) {
          return callback(err);
        } else {
          return sendBoundaryKeys(tr, master, keyRange);
        }
      });
    };
    transactionalDistribute = fdb.transactional(distribute);
    return BoundariesTask = (function(_super) {
      __extends(BoundariesTask, _super);

      function BoundariesTask() {
        return BoundariesTask.__super__.constructor.apply(this, arguments);
      }

      BoundariesTask.prototype.start = function() {
        return transactionalDistribute(this.options.tr || FDBoost.db, this, complete);
      };

      BoundariesTask.prototype.processWorkerMessage = function(data) {
        var boundary, parts;
        parts = data.split('>');
        console.log('parts', parts);
        boundary = {
          begin: parts[1],
          end: parts[0] === 1 ? fdb.KeySelector.firstGreaterThan(parts[2]) : fdb.KeySelector.firstGreaterOrEqual(parts[2])
        };
        return this.processBoundary(boundary);
      };

      BoundariesTask.prototype.processBoundary = function(boundary) {
        throw new Error('not implemented');
      };

      return BoundariesTask;

    })(require('parallelize'));
  };

}).call(this);
