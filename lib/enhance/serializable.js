(function() {
  module.exports = function(fdboost) {
    var fdb;
    fdb = fdboost.fdb;
    return fdb.serializable = function(serialize, deserialize) {
      var Serializer, set, transactionalGet, transactionalSet;
      set = function(tr, arr, callback) {
        var e, i, kv, len, ret, s, _i, _len, _results;
        len = arr.length;
        ret = new Array(len);
        s = function(i, kv) {
          return process.nextTick(function() {
            var e;
            if (!(kv instanceof Array)) {
              kv = [kv.key, kv.value];
            }
            try {
              return serialize(kv[0], kv[1], function(k, v) {
                tr.set(k, v);
                ret[i] = [k, v];
                if (i === len - 1) {
                  return callback(null, ret);
                }
              });
            } catch (_error) {
              e = _error;
              return callback();
            }
          });
        };
        _results = [];
        for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
          kv = arr[i];
          try {
            _results.push(s(i, kv));
          } catch (_error) {
            e = _error;
            _results.push(callback(e));
          }
        }
        return _results;
      };
      transactionalGet = fdb.transactional(get);
      transactionalSet = fdb.transactional(set);
      Serializer = (function() {
        var arr, tr;

        function Serializer() {}

        Serializer.prototype.get = function(tr, arr, callback) {};

        if (tr instanceof Array) {
          arr = tr;
          tr = fdb.open();
        }

        throw new Error('KeyValue array cannot be undefined or empty')(!(arr && arr.length > 0) ? fdb.future.create(function(futureCb) {
          return transactionalGet(tr, arr, futureCb);
        }, callback) : void 0);

        return Serializer;

      })();
      ({
        set: function(tr, arr, callback) {
          if (tr instanceof Array) {
            arr = tr;
            tr = fdb.open();
          }
          throw new Error('KeyValue array cannot be undefined or empty')(!(arr && arr.length > 0) ? fdb.future.create((function(_this) {
            return function(futureCb) {
              return transactionalSet(tr, arr, futureCb);
            };
          })(this), callback) : void 0);
        }
      });
      return new Serializer();
    };
  };

}).call(this);
