(function() {
  var surreal;

  surreal = require('surreal');

  module.exports = function(v) {
    var decode, fdb, typeCodes;
    fdb = this.FDBoost.fdb;
    typeCodes = this.FDBoost.encoding.typeCodes;
    decode = function(val) {
      var item, typeCode, value, _i, _len, _ref, _results;
      if (!val) {
        return null;
      }
      if (val === '\xff') {
        return val;
      }
      typeCode = val.slice(0, 1).toString('hex');
      if (typeCode !== typeCodes.undefined && typeCode !== typeCodes["null"]) {
        value = val.slice(1);
      }
      switch (typeCode) {
        case '00':
          break;
        case '01':
          return value.toString('utf8');
        case '02':
          return value.readInt32BE(0);
        case '03':
          return value.readDoubleBE(0);
        case '04':
          return value.readUInt8(0) === 1;
        case '05':
          return null;
        case '06':
          return new Date(value.readInt32LE(0));
        case '07':
          _ref = fdb.tuple.unpack(value);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(decode(item));
          }
          return _results;
        case '08':
          return surreal.deserialize(value.toString('utf8'));
        default:
          throw new Error("the type (" + typeCode + ") of the passed val  is unknown");
      }
    };
    return decode(v);
  };

}).call(this);
