
/**
 * Get the FDBoost~range~getLastKey method
 * @method
 * @param {object} FDBoost FDBoost instance.
 * @return {function} getLastKey
 */

(function() {
  module.exports = function(FDBoost) {
    var debug, getLastKey;
    debug = FDBoost.Debug('FDBoost.range.getLastKey');

    /**
     * The callback format for the FDBoost~range~getLastKey method
     * @callback FDBoost~range~getLastKeyCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
     */

    /**
     * Get the last key of the range based on a keyPrefix
     * @method
     * @param {object} tr Transaction.
     * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
     * @param {FDBoost~range~getLastKeyCallback} callback Callback.
     * @return {undefined}
     */
    getLastKey = function(tr, keyPrefix, callback) {
      var iterator;
      debug.buffer('keyPrefix', keyPrefix);
      debug.log('getLastKey');
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
    return function(tr, keyPrefix, callback) {
      var transactionGetLastKey;
      if (!callback) {
        if (keyPrefix) {
          callback = keyPrefix;
        }
        keyPrefix = tr;
        tr = null;
      }
      transactionGetLastKey = FDBoost.fdb.transactional(getLastKey);
      return transactionGetLastKey(tr || FDBoost.db, keyPrefix, callback);
    };
  };

}).call(this);
