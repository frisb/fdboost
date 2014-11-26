(function() {
  var getLastKey;

  getLastKey = function(tr, prefix, callback) {
    var iterator;
    iterator = tr.getRangeStartsWith(prefix, {
      limit: 1,
      reverse: true
    });
    return iterator.toArray(function(err, arr) {
      var key;
      if (err) {
        return callback(err);
      } else {
        if (arr.length === 1) {
          key = arr[0].key;
        }
        return callback(null, key);
      }
    });
  };

  module.exports = function(tr, prefix, callback) {
    var transactionGetLastKey;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    transactionGetLastKey = this.fdb.transactional(getLastKey);
    return transactionGetLastKey(tr || this.fdb.open(), prefix, callback);
  };

}).call(this);
