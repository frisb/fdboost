
/**
 * Get the Transaction~getLastKey method
 * @method
 * @param {object} fdb fdb module.
 * @param {object} debug Debug instance.
 * @return {function} getLastKey
 */

(function() {
  module.exports = function(fdb, debug) {

    /**
     * The callback format for the Transaction~getLastKey method
     * @callback Transaction~getLastKeyCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
     */

    /**
     * Get the last key of the range based on a keyPrefix
     * @method
     * @param {object} tr Transaction.
     * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
     * @param {Transaction~getLastKeyCallback} callback Callback.
     * @return {undefined}
     */
    var getLastKey, keyToString;
    keyToString = function(key) {
      if (key.asFoundationDBKey) {
        return new Buffer(key.asFoundationDBKey()).toString();
      } else {
        return key;
      }
    };
    getLastKey = function(tr, keyPrefix, callback) {
      var iterator;
      debug(function(writer) {
        writer.buffer('keyPrefix', keyToString(keyPrefix));
        return writer.log('getLastKey');
      });
      iterator = tr.getRangeStartsWith(keyPrefix, {
        limit: 1,
        reverse: true
      });
      iterator.toArray(function(err, arr) {
        var key;
        if (err) {
          callback(err);
        } else {
          if (arr.length === 1) {
            key = arr[0].key;
          }
          callback(null, key);
        }
      });
    };
    return function(keyPrefix, callback) {
      if (!keyPrefix) {
        throw new Error('keyPrefix cannot be undefined');
      }
      return fdb.future.create((function(_this) {
        return function(futureCb) {
          return getLastKey(_this, keyPrefix, futureCb);
        };
      })(this), callback);
    };
  };

}).call(this);
