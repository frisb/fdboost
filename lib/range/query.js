(function() {
  var EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;


  /**
   * Get a Query class to perform a range read operation over the database 
   * @method
   * @param {object} FDBBoost FDBBoost instance.
   * @return {Query} Query
   */

  module.exports = function(FDBoost) {
    var Query, debug, fdb, getIterator, getLastKey, iterate, transactionalIterate;
    fdb = FDBoost.fdb;
    debug = FDBoost.Debug('FDBoost.range.Query');

    /**
     * The callback format for the getLastKey method
     * @callback getLastKeyCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
     */

    /**
     * Get the last key of the range if no end key is provided to the RangeQuery 
     * @method
     * @param {object} tr Transaction.
     * @param {object} query RangeQuery instance.
     * @param {getLastKeyCallback} callback Callback.
     * @return {undefined}
     */
    getLastKey = function(tr, query, callback) {
      if (query.end) {
        debug.buffer('end', 'utf8', Buffer.prototype.toString, query.end.key);
        callback(null, query.end);
      } else {
        FDBoost.range.getLastKey(tr, query.begin, callback);
      }
    };

    /**
     * The callback format for the getIterator method
     * @callback getIteratorCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {LazyIterator} iterator The LazyIterator instance if the getIterator method was successful.
     */

    /**
     * Get a LazyIterator instance for the current range read operation 
     * @method
     * @param {object} tr Transaction.
     * @param {object} query RangeQuery instance.
     * @param {getIteratorCallback} callback Callback.
     * @return {undefined}
     */
    getIterator = function(tr, query, callback) {
      var begin, iterator, options, ts;
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

    /**
     * The callback format for the iterate method
     * @callback iterateCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {Result} result A Result value on completion of the iteration.
     */

    /**
     * Iterate over the range results 
     * @method
     * @param {object} tr Transaction.
     * @param {object} query RangeQuery instance.
     * @param {string} iteratorType batch|each|array.
     * @param {iterateCallback} callback Callback.
     * @fires RangeQuery#data
     * @return {undefined}
     */
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
    return Query = (function(_super) {
      __extends(Query, _super);


      /**
       * Creates a new RangeQuery instance
       * @class
       * @param {object} options Settings.
       * @param {(Buffer|fdb.KeySelector)} [options.begin] First key in the query range.
       * @param {(Buffer|fdb.KeySelector)}} [options.end=undefined] Last key in the query range.
       * @param {number} [options.limit=undefined] Only the first limit keys (and their values) in the range will be returned.
       * @param {boolean} [options.reverse=undefined] Specified if the keys in the range will be returned in reverse order
       * @param {(iterator|want_all|small|medium|large|serial|exact)} [options.streamingMode=undefined] fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
       * @param {boolean} [options.nonTransactional=false] Reset transaction on expiry and start.
       * @param {boolean} [options.snapshot=false] Defines whether range reads should be snapshot reads.
       * @property {array} instances Collection of Document Layer db instances.
       * @property {number} index Current index of the instances collection.
       * @property {(Buffer|fdb.KeySelector)}} begin First key in the query range.
       * @property {(Buffer|fdb.KeySelector)}} end Last key in the query range.
       * @property {Buffer} marker Marker key for transaction expiration continuation point.
       * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
       * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
       * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
       * @property {boolean} nonTransactional Reset transaction on expiry and start.
       * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
       * @return {RangeQuery} a RangeQuery instance.
       */

      function Query(options) {
        Query.__super__.constructor.call(this);
        this.begin = options.begin;
        this.end = options.end;
        this.marker = null;
        this.limit = options.limit;
        this.reverse = options.reverse;
        this.streamingMode = options.streamingMode;
        this.nonTransactional = options.nonTransactional || false;
        this.snapshot = options.snapshot || false;
        debug.buffer('begin', 'utf8', Buffer.prototype.toString, options.begin.key);
        debug.buffer('end', 'utf8', Buffer.prototype.toString, options.end.key);
        debug.buffer('limit', options.limit);
        debug.buffer('reverse', options.reverse);
        debug.buffer('streamingMode', options.streamingMode);
        debug.buffer('nonTransactional', options.nonTransactional);
        debug.buffer('snapshot', options.snapshot);
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
       * @fires RangeQuery#error
       * @fires RangeQuery#continue
       * @fires RangeQuery#end
       * @return {undefined}
       */

      Query.prototype.execute = function(tr, iteratorType) {
        var callback, complete, pastVersionCatchingCallback, toBeContinued, txi;
        if (typeof tr === 'function') {
          callback = tr;
          tr = null;
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
            transactionalIterate(tr || FDBoost.db, _this, iteratorType, pastVersionCatchingCallback);
          };
        })(this);
        txi();
      };

      return Query;

    })(EventEmitter);
  };

}).call(this);
