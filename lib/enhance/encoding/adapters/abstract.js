(function() {
  var AbstractAdapter, EncodedString,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EncodedString = (function(_super) {
    __extends(EncodedString, _super);

    function EncodedString() {
      return EncodedString.__super__.constructor.apply(this, arguments);
    }

    return EncodedString;

  })(Buffer);

  module.exports = AbstractAdapter = (function() {

    /**
     * Extend an AbstractAdapter instance for encoding and decoding typed values.
     * @abstract
     * @param {(Buffer|undefined|string|integer|double|boolean|null|date|array|object)} valueOrBuffer Value to encode or buffer instance to decode.
     * @param {integer} [pos=0] Buffer position to start writing data.
     * @property {Buffer} data Encoded buffer.
     * @property {(undefined|string|integer|double|boolean|null|date|array|object)} value Decoded value.
     * @return {object} Extended AbstractAdapter instance.
     */
    function AbstractAdapter(valueOrBuffer, pos) {
      this.pos = pos != null ? pos : 0;
      this.data = null;
      if (Buffer.isBuffer(valueOrBuffer)) {
        this.value = this.getValue(valueOrBuffer);
      } else {
        this.loadData(valueOrBuffer);
      }
    }


    /**
     * Get Buffer type.
     * @abstract
     * @return {class}
     */

    AbstractAdapter.prototype.getType = function() {
      throw new Error('not implemented');
    };


    /**
     * Initializes a new buffer.
     * @method
     * @param {integer} size Size of new buffer.
     * @return {undefined}
     */

    AbstractAdapter.prototype.initData = function(size) {
      var TypedBuffer;
      TypedBuffer = this.getType();
      this.data = new TypedBuffer(this.pos + size);
    };


    /**
     * Verifies that a data buffer exists.
     * @method
     * @return {undefined}
     */

    AbstractAdapter.prototype.verifyData = function() {
      if (this.data === null) {
        throw new Error('Data property not initialized');
      }
    };


    /**
     * Loads data into initialized buffer instance.
     * @virtual
     * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode to buffer.
     * @return {undefined}
     */

    AbstractAdapter.prototype.loadData = function(value) {
      this.initData(this.pos);
    };


    /**
     * Writes string to data buffer.
     * @method
     * @param {string} value String value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeString = function(value) {
      this.verifyData();
      this.data.write(value, this.pos, value.length, 'utf8');
      this.pos += value.length;
    };


    /**
     * Writes double to data buffer.
     * @method
     * @param {double} value Double value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeDoubleBE = function(value) {
      this.verifyData();
      this.data.writeDoubleBE(value, this.pos);
      this.pos += 8;
    };


    /**
     * Writes 32bit Big Endian signed integer to data buffer.
     * @method
     * @param {integer} value Integer value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeInt32BE = function(value) {
      this.verifyData();
      this.data.writeInt32BE(value, this.pos);
      this.pos += 4;
    };


    /**
     * Writes 32bit Little Endian signed integer to data buffer.
     * @method
     * @param {integer} value Integer value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeInt32LE = function(value) {
      this.verifyData();
      this.data.writeInt32LE(value, this.pos);
      this.pos += 4;
    };


    /**
     * Writes 8bit unsigned integer to data buffer.
     * @method
     * @param {integer} value Integer value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeUInt8 = function(value) {
      this.verifyData();
      this.data.writeUInt8(value, this.pos);
      this.pos += 1;
    };


    /**
     * Writes 32bit unsigned Little Endian integer to data buffer.
     * @method
     * @param {integer} value Integer value to write.
     * @return {undefined}
     */

    AbstractAdapter.prototype.writeUInt32LE = function(value) {
      this.verifyData();
      this.data.writeUInt32LE(value, this.pos);
      this.pos += 4;
    };


    /**
     * Copies data from source buffer to data buffer.
     * @method
     * @param {Buffer} source Source buffer to copy data from.
     * @return {undefined}
     */

    AbstractAdapter.prototype.copyFrom = function(source) {
      this.verifyData();
      source.copy(this.data, this.pos);
      this.pos += source.length;
    };

    return AbstractAdapter;

  })();

}).call(this);
