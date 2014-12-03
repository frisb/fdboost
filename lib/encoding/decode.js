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
   * @param {Buffer} buffer Buffer to decode.
   * @param {string} prefix Optional prefix identifier.
   * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
   */

  module.exports = function(buffer, prefix) {
    var getBuffer, prefixBuf, typeCodeIndex, typeCodes, typedBuffer;
    if (!buffer) {
      return null;
    }
    typeCodes = this.FDBoost.encoding.typeCodes;
    typeCodeIndex = 0;
    if (prefix) {
      prefixBuf = new Buffer(prefix, 'ascii');
      if (validatePrefix(buffer, prefixBuf)) {
        typeCodeIndex = prefixBuf.length;
      } else {
        throw new Error("Invalid prefix \"" + prefix + "\".");
      }
    }
    getBuffer = (function(_this) {
      return function() {
        var typeCode;
        typeCode = buffer.readUInt8(typeCodeIndex);
        switch (typeCode) {
          case 0:
            break;
          case 1:
            return new _this.buffers.Undefined(buffer);
          case 2:
            return new _this.buffers.Integer(buffer);
          case 3:
            return new _this.buffers.Double(buffer);
          case 4:
            return new _this.buffers.Boolean(buffer);
          case 5:
            return new _this.buffers.Null(buffer);
          case 6:
            return new _this.buffers.Date(buffer);
          case 7:
            return new _this.buffers.Array(buffer);
          case 8:
            return new _this.buffers.Object(buffer);
          default:
            throw new Error("Unknown typeCode \"" + typeCode + "\".");
        }
      };
    })(this);
    typedBuffer = getBuffer();
    typedBuffer.pos = typeCodeIndex + 1;
    return typedBuffer.read();

    /**
     * Decode value from buffer
     * @method
     * @param {Buffer} buf Buffer to decode.
     * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
     */
  };

}).call(this);


/**
 * Decode value from buffer
 * @method
 * @param {Buffer} buffer Buffer to decode.
 * @param {string} prefix Optional prefix identifier.
 * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
 */

(function() {
  module.exports = function(buffer, prefix) {
    var buf;
    if (!buffer) {
      return null;
    }
    buf = this.buffers.Abstract.createFrom(prefix, buffer);
    return buf.read();
  };

}).call(this);
