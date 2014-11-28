(function() {
  var buffer, surreal;

  surreal = require('surreal');

  buffer = function(typeCode, buf) {
    if (buf) {
      return Buffer.concat([typeCode, buf], buf.length + 1);
    } else {
      return typeCode;
    }
  };

  module.exports = function(v) {
    var encode, fdb, typeCodes;
    fdb = this.FDBoost.fdb;
    typeCodes = this.FDBoost.encoding.typeCodes;
    encode = function(val) {
      var buf, i;
      if (val === '\xff') {
        return val;
      }
      switch (typeof val) {
        case 'undefined':
          return buffer(typeCodes.undefined);
        case 'string':
          return buffer(typeCodes.string, new Buffer(val, 'utf8'));
        case 'number':
          if (val % 1 === 0) {
            buf = new Buffer(4);
            buf.writeInt32BE(val, 0);
            return buffer(typeCodes.integer, buf);
          } else {
            buf = new Buffer(8);
            buf.writeDoubleBE(val, 0);
            return buffer(typeCodes.double, buf);
          }
          break;
        case 'boolean':
          buf = new Buffer(1);
          buf.writeUInt8((val ? 1 : 0), 0);
          return buffer(typeCodes.boolean, buf);
        default:
          if (val === null) {
            return buffer(typeCodes["null"]);
          } else if (val instanceof Date) {
            buf = new Buffer(10);
            console.log(val.getTime());
            buf.writeUInt32LE(val.getTime(), 0);
            return buffer(typeCodes.date, buf);
          } else if (val instanceof Array) {
            buf = fdb.tuple.pack((function() {
              var _i, _ref, _results;
              _results = [];
              for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(encode(val[i]));
              }
              return _results;
            })());
            return buffer(typeCodes.array, buf);
          } else if (val instanceof Object) {
            return buffer(typeCodes.object, new Buffer(surreal.serialize(val), 'utf8'));
          } else {
            throw new Error("the encode function accepts only string, number, boolean, date, array and object");
          }
      }
    };
    return encode(v);
  };

}).call(this);
