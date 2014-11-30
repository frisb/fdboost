(function() {
  var parseDate, surreal, validatePrefix;

  surreal = require('surreal');


  /**
   * Check buffer starts with prefix
   * @method
   * @param {Buffer} buf Buffer to check.
   * @param {Buffer} prefixBuf Prefix buffer.
   * @return {boolean} Boolean
   */

  validatePrefix = function(buf, prefixBuf) {
    var i, len, prefix, _i;
    len = prefixBuf.length;
    if (buf.length <= prefixBuf.length) {
      return false;
    }
    prefix = buf.slice(0, len);
    for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
      if (prefix[i] !== prefixBuf[i]) {
        return false;
      }
    }
    return true;
  };


  /**
   * Decode date from buffer
   * @method
   * @param {Buffer} buf Buffer to decode.
   * @return {Date} Date
   */

  parseDate = function(buf) {
    var date, days, milliseconds;
    days = buf.readInt32LE(0);
    milliseconds = buf.readUInt32LE(4);
    date = new Date(1900, 0, 1);
    date.setDate(date.getDate() + days);
    date.setMilliseconds(date.getMilliseconds() + milliseconds);
    return date;
  };


  /**
   * Decode value from buffer
   * @method
   * @param {string} prefix Optional prefix identifier.
   * @param {Buffer} buffer Buffer to decode.
   * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
   */

  module.exports = function(prefix, buffer) {
    var decode, fdb, prefixBuffer, typeCodeIndex, typeCodes;
    if (!buffer) {
      buffer = prefix;
      prefix = null;
    }
    if (!buffer) {
      return null;
    }
    fdb = this.FDBoost.fdb;
    typeCodes = this.FDBoost.encoding.typeCodes;
    typeCodeIndex = 0;
    if (prefix) {
      prefixBuffer = new Buffer(prefix, 'ascii');
      if (validatePrefix(buffer, prefixBuffer)) {
        typeCodeIndex = prefixBuffer.length;
      } else {
        throw new Error("Invalid prefix \"" + prefix + "\".");
      }
    }

    /**
     * Decode value from buffer
     * @method
     * @param {Buffer} buf Buffer to decode.
     * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
     */
    decode = function(buf) {
      var item, typeCode, _i, _len, _ref, _results;
      typeCode = buf.slice(typeCodeIndex, 4).toString('hex');
      if (typeCode !== '00' && typeCode !== '05') {
        buf = buf.slice(typeCodeIndex + 1);
      }
      switch (typeCode) {
        case '00':
          break;
        case '01':
          return buf.toString('utf8');
        case '02':
          return buf.readInt32BE(0);
        case '03':
          return buf.readDoubleBE(0);
        case '04':
          return buf.readUInt8(0) === 1;
        case '05':
          return null;
        case '06':
          return parseDate(buf);
        case '07':
          _ref = fdb.tuple.unpack(buf);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(decode(item));
          }
          return _results;
        case '08':
          return surreal.deserialize(buf.toString('utf8'));
        default:
          throw new Error("Unknown typeCode \"" + typeCode + "\".");
      }
    };
    return decode(buffer);
  };

}).call(this);
