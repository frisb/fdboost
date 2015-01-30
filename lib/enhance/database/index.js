(function() {
  module.exports = function(fdb, debug) {
    var enhanceDatabase, enhanceTransaction, enhancements, open;
    enhancements = {
      getLastKey: require('./getlastkey')(fdb, debug),
      countKeys: require('./countkeys')(fdb, debug)
    };
    enhanceDatabase = function(Database) {
      var createTransaction, e, fn, fnName;
      e = function(fnName, fn) {
        var len;
        len = fn.length;
        return Database.prototype[fnName] = function() {
          var args, cb, i, _i, _ref;
          args = new Array(len);
          for (i = _i = 0, _ref = len - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            args[i] = arguments['' + i];
          }
          cb = arguments['' + (len - 1)];
          return this.doTransaction(function(tr, innerCb) {
            args[len - 1] = innerCb;
            tr[fnName].apply(tr, args);
          }, cb);
        };
      };
      for (fnName in enhancements) {
        fn = enhancements[fnName];
        e(fnName, fn);
      }
      createTransaction = Database.prototype.createTransaction;
      Database.prototype.createTransaction = function() {
        var tr;
        tr = createTransaction.call(this);
        if (!tr.boosted) {
          enhanceTransaction(tr.constructor);
        }
        return tr;
      };
      Database.prototype.boosted = true;
    };
    enhanceTransaction = function(Transaction) {
      var fn, fnName;
      for (fnName in enhancements) {
        fn = enhancements[fnName];
        Transaction.prototype[fnName] = fn;
      }
      Transaction.prototype.boosted = true;
    };
    open = fdb.open;
    return fdb.open = function(clusterFile, dbName) {
      var db;
      db = open.call(fdb, clusterFile, dbName);
      if (!db.boosted) {
        enhanceDatabase(db.constructor);
      }
      return db;
    };
  };

}).call(this);
