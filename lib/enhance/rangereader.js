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
   * Get a Reader class to perform a range read operation over the database 
   * @method
   * @param {object} FDBBoost FDBBoost instance.
   * @return {Reader} Reader
   */

  module.exports = function(fdb, debug) {
    var RangeReader, db, iterate, transactionalIterate;
    db = fdb.open();

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
     * @param {object} reader RangeReader instance.
     * @param {string} iteratorType batch|each|array.
     * @param {iterateCallback} callback Callback.
     * @fires RangeReader#data
     * @return {undefined}
     */
    iterate = function(tr, reader, iteratorType, callback) {
      var getIteratorCallback;
      debug(function(writer) {
        return writer.buffer('iteratorType', iteratorType);
      });
      getIteratorCallback = function(err, iterator) {
        if (err) {
          callback(err);
        } else {
          debug(function(writer) {
            return writer.log('iterate');
          });
          switch (iteratorType) {
            case 'array':
              reader.toArray(iterator, callback);
              break;
            case 'batch':
              reader.forEachBatch(iterator, callback);
              break;
            case 'each':
              reader.forEach(iterator, callback);
          }
        }
      };
      reader.getIterator(tr, getIteratorCallback);
    };
    transactionalIterate = fdb.transactional(iterate);
    fdb.RangeReader = RangeReader = (function(_super) {
      __extends(RangeReader, _super);


      /**
       * Creates a new Reader instance
       * @class
       * @param {object} options Settings.
       * @param {(Buffer|fdb.KeySelector)} [options.begin] First key in the reader range.
       * @param {(Buffer|fdb.KeySelector)}} [options.end=undefined] Last key in the reader range.
       * @param {number} [options.limit=undefined] Only the first limit keys (and their values) in the range will be returned.
       * @param {boolean} [options.reverse=undefined] Specified if the keys in the range will be returned in reverse order
       * @param {(iterator|want_all|small|medium|large|serial|exact)} [options.streamingMode=undefined] fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
       * @param {boolean} [options.nonTransactional=false] Reset transaction on expiry and start.
       * @param {boolean} [options.snapshot=false] Defines whether range reads should be snapshot reads.
       * @property {array} instances Collection of Document Layer db instances.
       * @property {number} index Current index of the instances collection.
       * @property {(Buffer|fdb.KeySelector)}} begin First key in the reader range.
       * @property {(Buffer|fdb.KeySelector)}} end Last key in the reader range.
       * @property {Buffer} marker Marker key for transaction expiration continuation point.
       * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
       * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
       * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
       * @property {boolean} nonTransactional Reset transaction on expiry and start.
       * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
       * @return {Reader} a Reader instance.
       */

      function RangeReader(options) {
        RangeReader.__super__.constructor.call(this);
        this.begin = options.begin;
        this.end = options.end;
        this.marker = null;
        this.limit = options.limit;
        this.reverse = options.reverse;
        this.streamingMode = options.streamingMode;
        this.nonTransactional = options.nonTransactional || false;
        this.snapshot = options.snapshot || false;
        debug(function(writer) {
          if (options.begin) {
            writer.buffer('begin', resolveKey(options.begin).toString('utf8'));
          }
          if (options.end) {
            writer.buffer('end', resolveKey(options.end).toString('utf8'));
          }
          writer.buffer('limit', options.limit);
          writer.buffer('reverse', options.reverse);
          writer.buffer('streamingMode', options.streamingMode);
          writer.buffer('nonTransactional', options.nonTransactional);
          return writer.buffer('snapshot', options.snapshot);
        });
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
       * Get the last key of the range if no end key is provided to the RangeReader 
       * @method
       * @param {object} tr Transaction.
       * @param {object} reader RangeReader instance.
       * @param {getLastKeyCallback} callback Callback.
       * @return {undefined}
       */

      RangeReader.prototype.getLastKey = function(tr, callback) {
        if (this.end) {
          debug(function(writer) {
            return writer.buffer('end', this.end.key.toString('utf8'));
          });
          callback(null, this.end);
        } else {
          tr.getLastKey(this.begin, callback);
        }
      };


      /**
       * The callback format for the init method
       * @callback initCallback
       * @param {Error} error An error instance representing the error during the execution.
       */


      /**
       * Initialize the reader before iteration
       * @abstract
       * @param {object} tr Transaction.
       * @param {object} reader RangeReader instance.
       * @param {initCallback} callback Callback.
       * @return {undefined}
       */

      RangeReader.prototype.init = function(tr, callback) {
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
       * @param {object} reader RangeReader instance.
       * @param {getIteratorCallback} callback Callback.
       * @return {undefined}
       */

      RangeReader.prototype.getIterator = function(tr, callback) {
        var begin, iterator, options, ts;
        debug(function(writer) {
          return writer.log('getIterator');
        });
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
              iterator = ts.getRange(begin, lastKey, options);
              debug(function(writer) {
                writer.log('getLastKey');
                writer.buffer('method', 'getRange');
                writer.buffer('begin', resolveKey(begin).toString('utf8'));
                writer.buffer('end', resolveKey(lastKey).toString('utf8'));
                return writer.buffer('options', options);
              });
              callback(null, iterator);
            }
          });
        } else {
          iterator = ts.getRangeStartsWith(this.begin, options);
          debug((function(_this) {
            return function(writer) {
              writer.buffer('method', 'getRangeStartsWith');
              writer.buffer('prefix', resolveKey(_this.begin).toString('utf8'));
              return writer.buffer('options', options);
            };
          })(this));
          callback(null, iterator);
        }
      };


      /**
       * Iterate over array results 
       * @virtual
       * @param {LazyIterator} iterator LazyIterator instance.
       * @param {iterateCallback} callback Callback.
       * @fires RangeReader#data
       * @return {undefined}
       */

      RangeReader.prototype.toArray = function(iterator, callback) {
        iterator.toArray((function(_this) {
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
       * @fires RangeReader#data
       * @return {undefined}
       */

      RangeReader.prototype.forEachBatch = function(iterator, callback) {
        var func;
        func = (function(_this) {
          return function(arr, next) {
            _this.emit('data', arr);
            next();
          };
        })(this);
        iterator.forEachBatch(func, callback);
      };


      /**
       * Iterate over key-value pair results 
       * @virtual
       * @param {LazyIterator} iterator LazyIterator instance.
       * @param {iterateCallback} callback Callback.
       * @fires RangeReader#data
       * @return {undefined}
       */

      RangeReader.prototype.forEach = function(iterator, callback) {
        var func;
        func = (function(_this) {
          return function(kv, next) {
            _this.emit('data', kv);
            next();
          };
        })(this);
        iterator.forEach(func, callback);
      };


      /**
       * Execute the reader using an iterator type 
       * @virtual
       * @param {object} [tr=null] transaction.
       * @param {string} iteratorType batch|each|array.
       * @fires RangeReader#error
       * @fires RangeReader#continue
       * @fires RangeReader#end
       * @return {undefined}
       */

      RangeReader.prototype.execute = function(tr, iteratorType) {
        var complete, pastVersionCatchingCallback, toBeContinued, txi;
        if (typeof tr === 'string') {
          iteratorType = tr;
          tr = db;
        }
        debug(function(writer) {
          return writer.log('execute');
        });
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
            debug(function(writer) {
              return writer.log('continue');
            });
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
            transactionalIterate(tr || db, _this, iteratorType, pastVersionCatchingCallback);
          };
        })(this);
        txi();
      };

      return RangeReader;

    })(EventEmitter);
  };

}).call(this);
