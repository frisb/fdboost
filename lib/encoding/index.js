
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
          'undefined': new Buffer('00', 'hex'),
          'string': new Buffer('01', 'hex'),
          'integer': new Buffer('02', 'hex'),
          'double': new Buffer('03', 'hex'),
          'boolean': new Buffer('04', 'hex'),
          'null': new Buffer('05', 'hex'),
          'date': new Buffer('06', 'hex'),
          'array': new Buffer('07', 'hex'),
          'object': new Buffer('08', 'hex')
        };
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
