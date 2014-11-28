(function() {
  var EPOCH_DATE, nb, surreal;

  surreal = require('surreal');

  EPOCH_DATE = new Date(1900, 0, 1);

  nb = require('numeric-buffer');

  module.exports = function(value, prefix) {
    var buffer, encode, fdb, typeCodes;
    fdb = this.FDBoost.fdb;
    typeCodes = this.FDBoost.encoding.typeCodes;
    if (prefix) {
      prefix = new Buffer(prefix, 'ascii');
    }
    buffer = function(typeCode, buf) {
      var start;
      start = prefix ? Buffer.concat([prefix, typeCode], prefix.length + 1) : typeCode;
      if (buf) {
        return Buffer.concat([start, buf], start.length + buf.length);
      } else {
        return start;
      }
    };
    encode = function(val) {
      var buf, days, i, milliseconds, seconds;
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
            buf = new Buffer(8);
            days = ~~((val.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
            seconds = val.getHours() * 60 * 60;
            seconds += val.getMinutes() * 60;
            seconds += val.getSeconds();
            milliseconds = (seconds * 1000) + val.getMilliseconds();
            buf.writeInt32LE(days, 0);
            buf.writeUInt32LE(milliseconds, 4);
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
    return encode(value);
  };

}).call(this);
