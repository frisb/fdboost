
/**
 * Get a new EncodingNamespace instance 
 * @method
 * @param {FDBBoost} FDBBoost FDBBoost instance.
 * @return {EncodingNamespace} an EncodingNamespace instance
 */

(function() {
  module.exports = function(FDBoost) {
    var EncodingNamespace;
    EncodingNamespace = (function() {

      /**
       * Creates a new EncodingNamespace instance
       * @class
       * @param {FDBoost} FDBoost FDBoost instance.
       * @property {object} typeCodes Type codes dictionary.
       * @return {EncodingNamespace} an EncodingNamespace instance.
       */
      function EncodingNamespace(FDBoost) {
        this.FDBoost = FDBoost;
        this.adapters = require('./adapters')(this);
      }


      /**
       * Encode value to buffer
       * @method
       * @param {string} [prefix] String identifier.
       * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
       * @return {Buffer} Buffer
       */

      EncodingNamespace.prototype.encode = function(value, prefix) {
        var TypedAdapter, adapter, startPos, typeCode;
        if (value === '\xff') {
          return value;
        }
        startPos = 1;
        typeCode = this.adapters.types.get(value);
        TypedAdapter = this.adapters.get(typeCode);
        if (prefix) {
          startPos += prefix.length;
          adapter = new TypedAdapter(value, startPos);
          adapter.data.write(prefix, 0, startPos, 'ascii');
        } else {
          adapter = new TypedAdapter(value, startPos);
        }
        adapter.data.writeUInt8(typeCode, startPos - 1);
        return adapter.data;
      };


      /**
       * Decode value from buffer
       * @method
       * @param {Buffer} buffer Buffer to decode.
       * @param {string} [prefix] String identifier.
       * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
       */

      EncodingNamespace.prototype.decode = function(buffer, prefix) {
        var TypedAdapter, adapter, startPos, typeCode;
        if (!buffer) {
          return null;
        }
        startPos = 0;
        if (prefix) {
          if (buffer.toString('ascii', 0, prefix.length) === prefix) {
            startPos = prefix.length;
          } else {
            throw new Error("Invalid prefix \"" + prefix + "\".");
          }
        }
        typeCode = buffer.readUInt8(startPos);
        TypedAdapter = this.adapters.get(typeCode);
        adapter = new TypedAdapter(buffer, startPos + 1);
        return adapter.value;
      };

      return EncodingNamespace;

    })();
    return new EncodingNamespace(FDBoost);
  };

}).call(this);
