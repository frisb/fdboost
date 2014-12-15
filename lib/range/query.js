(function() {
  var EventEmitter, resolveKey,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  resolveKey = function(k) {
    if (k) {
      if (k.key) {
        if (typeof k.key === 'function') {
          return k.key();
        } else {
          return k.key;
        }
      } else if (k.rawPrefix) {
        return k.rawPrefix;
      } else {
        return k;
      }
    }
  };


  /**
   * Get a Query class to perform a range read operation over the database 
   * @method
   * @param {object} FDBBoost FDBBoost instance.
   * @return {Query} Query
   */

  module.exports = function(FDBoost) {
    var Query, debug, fdb, iterate, transactionalIterate;
    fdb = FDBoost.fdb;
    debug = FDBoost.Debug('FDBoost.range.Query');

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
      var getIteratorCallback;
      debug.buffer('iteratorType', iteratorType);
      getIteratorCallback = function(err, iterator) {
        if (err) {
          callback(err);
        } else {
          debug.log('iterate');
          switch (iteratorType) {
            case 'array':
              query.toArray(iterator, callback);
              break;
            case 'batch':
              query.forEachBatch(iterator, callback);
              break;
            case 'each':
              query.forEach(iterator, callback);
          }
        }
      };
      query.getIterator(tr, getIteratorCallback);
    };
    transactionalIterate = fdb.transactional(iterate);
    return Query = (function(_super) {
      __extends(Query, _super);


      /**
       * Creates a new Query instance
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
       * @return {Query} a Query instance.
       */

      function Query(options) {
        console.log('options', options);
        Query.__super__.constructor.call(this);
        this.begin = options.begin;
        this.end = options.end;
        this.marker = null;
        this.limit = options.limit;
        this.reverse = options.reverse;
        this.streamingMode = options.streamingMode;
        this.nonTransactional = options.nonTransactional || false;
        this.snapshot = options.snapshot || false;
        debug.buffer('begin', 'utf8', Buffer.prototype.toString, resolveKey(options.begin));
        debug.buffer('end', 'utf8', Buffer.prototype.toString, resolveKey(options.end));
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

      Query.prototype.getLastKey = function(tr, callback) {
        if (this.end) {
          debug.buffer('end', 'utf8', Buffer.prototype.toString, this.end.key);
          callback(null, this.end);
        } else {
          FDBoost.range.getLastKey(tr, this.begin, callback);
        }
      };


      /**
       * The callback format for the init method
       * @callback initCallback
       * @param {Error} error An error instance representing the error during the execution.
       */


      /**
       * Initialize the query before iteration
       * @abstract
       * @param {object} tr Transaction.
       * @param {object} query RangeQuery instance.
       * @param {initCallback} callback Callback.
       * @return {undefined}
       */

      Query.prototype.init = function(tr, callback) {
        return callback(null);
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

      Query.prototype.getIterator = function(tr, callback) {
        var begin, iterator, options, ts;
        debug.log('getIterator');
        options = {
          limit: this.limit,
          reverse: this.reverse,
          streamingMode: this.streamingMode
        };
        ts = this.snapshot ? tr.snapshot : tr;
        if (this.end || this.marker) {
          begin = this.marker ? fdb.KeySelector.firstGreaterThan(this.marker) : this.begin;
          this.getLastKey(tr, function(err, lastKey) {
            var iterator;
            if (err) {
              callback(err);
            } else {
              debug.log('getLastKey');
              iterator = ts.getRange(begin, lastKey, options);
              debug.buffer('method', 'getRange');
              debug.buffer('begin', 'utf8', Buffer.prototype.toString, resolveKey(begin));
              debug.buffer('end', 'utf8', Buffer.prototype.toString, resolveKey(lastKey));
              debug.buffer('options', options);
              callback(null, iterator);
            }
          });
        } else {
          iterator = ts.getRangeStartsWith(this.begin, options);
          debug.buffer('method', 'getRangeStartsWith');
          debug.buffer('prefix', 'utf8', Buffer.prototype.toString, resolveKey(this.begin));
          debug.buffer('options', options);
          callback(null, iterator);
        }
      };


      /**
       * Iterate over array results 
       * @virtual
       * @param {LazyIterator} iterator LazyIterator instance.
       * @param {iterateCallback} callback Callback.
       * @fires RangeQuery#data
       * @return {undefined}
       */

      Query.prototype.toArray = function(iterator, callback) {
        return iterator.toArray((function(_this) {
          return function(err, arr) {
            _this.emit('data', arr);
            callback(err);
          };
        })(this));
      };


      /**
       * Iterate over batch results 
       * @virtual
       * @param {LazyIterator} iterator LazyIterator instance.
       * @param {iterateCallback} callback Callback.
       * @fires RangeQuery#data
       * @return {undefined}
       */

      Query.prototype.forEachBatch = function(iterator, callback) {
        var func;
        func = (function(_this) {
          return function(arr, next) {
            _this.emit('data', arr);
            next();
          };
        })(this);
        return iterator.forEachBatch(func, callback);
      };


      /**
       * Iterate over key-value pair results 
       * @virtual
       * @param {LazyIterator} iterator LazyIterator instance.
       * @param {iterateCallback} callback Callback.
       * @fires RangeQuery#data
       * @return {undefined}
       */

      Query.prototype.forEach = function(iterator, callback) {
        var func;
        func = (function(_this) {
          return function(kv, next) {
            _this.emit('data', kv);
            next();
          };
        })(this);
        return iterator.forEach(func, callback);
      };


      /**
       * Execute the query using an iterator type 
       * @virtual
       * @param {object} tr Optional transaction.
       * @param {string} iteratorType batch|each|array.
       * @fires RangeQuery#error
       * @fires RangeQuery#continue
       * @fires RangeQuery#end
       * @return {undefined}
       */

      Query.prototype.execute = function(tr, iteratorType) {
        var complete, pastVersionCatchingCallback, toBeContinued, txi;
        if (typeof tr === 'string') {
          iteratorType = tr;
          tr = null;
        }
        debug.log('execute');
        complete = (function(_this) {
          return function(err, result) {
            if (err) {
              _this.emit('error', err);
            } else {
              _this.emit('end', result);
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
          return function(err, result) {
            if (err && _this.nonTransactional && err.message === 'past_version') {
              toBeContinued();
            } else {
              complete(err, result);
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
