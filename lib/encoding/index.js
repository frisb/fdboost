
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
        this.typeCodes = {
          'undefined': 0,
          'string': 1,
          'integer': 2,
          'double': 3,
          'boolean': 4,
          'null': 5,
          'date': 6,
          'array': 7,
          'object': 8
        };
        this.buffers = require('./buffers')(this);
      }


      /**
       * Encode value to buffer
       * @method
       * @param {string} prefix Optional prefix identifier.
       * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
       * @return {Buffer} Buffer
       */

      EncodingNamespace.prototype.encode = require('./encode');


      /**
       * Decode value from buffer
       * @method
       * @param {string} prefix Optional prefix identifier.
       * @param {Buffer} buffer Buffer to decode.
       * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
       */

      EncodingNamespace.prototype.decode = require('./decode');

      return EncodingNamespace;

    })();
    return new EncodingNamespace(FDBoost);
  };

}).call(this);
