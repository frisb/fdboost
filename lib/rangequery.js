(function() {
  var EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = function(options) {
    var FDBoost, RangeQuery, debug, fdb, getIterator, getLastKey, iterate, transactionalIterate;
    FDBoost = this;
    fdb = FDBoost.fdb;
    debug = FDBoost.Debug('RangeQuery');
    getLastKey = function(tr, query, callback) {
      if (query.end) {
        debug.buffer('end', 'utf8', Buffer.prototype.toString, query.end.key);
        callback(null, query.end);
      } else {
        debug.buffer('getLastKey for prefix', begin);
        FDBoost.getLastKey(tr, query.begin, callback);
      }
    };
    getIterator = function(tr, query, callback) {
      var begin, iterator, ts;
      options = {
        limit: query.limit,
        reverse: query.reverse,
        streamingMode: query.streamingMode
      };
      ts = query.snapshot ? tr.snapshot : tr;
      if (query.end || query.marker) {
        begin = query.marker ? fdb.KeySelector.firstGreaterThan(query.marker) : query.begin;
        getLastKey(tr, query, function(err, lastKey) {
          var iterator;
          if (err) {
            callback(err);
          } else {
            debug.log('getLastKey');
            iterator = ts.getRange(begin, lastKey, options);
            debug.buffer('method', 'getRange');
            debug.buffer('begin', 'utf8', Buffer.prototype.toString, begin.key);
            debug.buffer('end', 'utf8', Buffer.prototype.toString, lastKey.key);
            debug.buffer('options', options);
            callback(null, iterator);
          }
        });
      } else {
        iterator = ts.getRangeStartsWith(query.begin, options);
        debug.buffer('method', 'getRangeStartsWith');
        debug.buffer('prefix', 'utf8', Buffer.prototype.toString, query.begin);
        debug.buffer('options', options);
        callback(null, iterator);
      }
    };
    iterate = function(tr, query, iteratorType, callback) {
      getIterator(tr, query, function(err, iterator) {
        var func;
        debug.log('getIterator');
        debug.buffer('iteratorType', iteratorType);
        debug.log('iterate');
        switch (iteratorType) {
          case 'array':
            iterator.toArray(function(err, arr) {
              query.emit('data', arr);
              callback(err);
            });
            break;
          case 'batch':
            func = function(arr, next) {
              query.emit('data', arr);
              next();
            };
            iterator.forEachBatch(func, callback);
            break;
          case 'each':
            func = function(kv, next) {
              query.emit('data', kv);
              next();
            };
            iterator.forEach(func, callback);
        }
      });
    };
    transactionalIterate = fdb.transactional(iterate);

    /**
     * Creates a new RangeQuery instance
     * @class
     * @param {object} [options={}] Optional settings.
     * @property {array} instances Collection of Document Layer db instances.
     * @property {number} index Current index of the instances collection.
     * @property {object} begin First key in the query range.
     * @property {object} end Last key in the query range.
     * @property {object} marker Marker key for transaction expiration continuation point.
     * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
     * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
     * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
     * @property {boolean} nonTransactional Reset transaction on expiry and start.
     * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
     * @fires RangeQuery#data
     * @fires RangeQuery#error
     * @fires RangeQuery#continue
     * @fires RangeQuery#end
     * @return {RangeQuery} a RangeQuery instance.
     */
    RangeQuery = (function(_super) {
      __extends(RangeQuery, _super);

      function RangeQuery(options) {
        RangeQuery.__super__.constructor.call(this);
        this.begin = options.begin;
        this.end = options.end;
        this.marker = null;
        this.limit = options.limit;
        this.reverse = options.reverse;
        this.streamingMode = options.streamingMode;
        this.nonTransactional = options.nonTransactional;
        this.snapshot = options.snapshot;
        debug.buffer('options', options);
        this.on('data', (function(_this) {
          return function(data) {
            var kv, _i, _len;
            if (data instanceof Array) {
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                kv = data[_i];
                _this.marker = kv.key;
              }
            } else {
              _this.marker = data.key;
            }
          };
        })(this));
      }


      /**
       * Execute the query using an iterator type 
       * @method
       * @param {object} tr Optional transaction.
       * @param {string} iteratorType batch|each|array.
       * @return {undefined}
       */

      RangeQuery.prototype.execute = function(tr, iteratorType) {
        var callback, complete, pastVersionCatchingCallback, toBeContinued, txi;
        if (typeof tr === 'function') {
          callback = tr;
          tr = FDBoost.db;
        }
        debug.log('execute');
        complete = (function(_this) {
          return function(err, res) {
            if (err) {
              _this.emit('error', err);
            } else {
              _this.emit('end', res);
            }
          };
        })(this);
        toBeContinued = (function(_this) {
          return function() {
            debug.log('continue');
            tr.reset();
            _this.emit('continue');
            txi();
          };
        })(this);
        pastVersionCatchingCallback = (function(_this) {
          return function(err, res) {
            if (err && _this.nonTransactional && err.message === 'past_version') {
              toBeContinued();
            } else {
              complete(err, res);
            }
          };
        })(this);
        txi = (function(_this) {
          return function() {
            transactionalIterate(tr, _this, iteratorType, pastVersionCatchingCallback);
          };
        })(this);
        txi();
      };

      return RangeQuery;

    })(EventEmitter);
    return new RangeQuery(options);
  };

}).call(this);
