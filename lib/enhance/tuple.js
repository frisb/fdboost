(function() {
  module.exports = function(fdb) {
    var enhancements, fn, fnName, _results;
    enhancements = {
      packEncoded: function(arr, prefix) {
        var encodedArr, item;
        encodedArr = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            item = arr[_i];
            _results.push(fdb.encoding.encode(item, prefix));
          }
          return _results;
        })();
        return this.pack(encodedArr);
      },
      unpackEncoded: function(key, prefix) {
        var encodedArr, item, _i, _len, _results;
        encodedArr = this.unpack(key);
        _results = [];
        for (_i = 0, _len = encodedArr.length; _i < _len; _i++) {
          item = encodedArr[_i];
          _results.push(fdb.encoding.decode(item, prefix));
        }
        return _results;
      }
    };
    _results = [];
    for (fnName in enhancements) {
      fn = enhancements[fnName];
      fdb.tuple[fnName] = fn;
      fdb.Subspace.prototype[fnName] = fn;
      _results.push(fdb.DirectoryLayer.prototype[fnName] = fn);
    }
    return _results;
  };

}).call(this);
