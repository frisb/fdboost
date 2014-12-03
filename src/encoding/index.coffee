###*
 * Get a new EncodingNamespace instance 
 * @method
 * @param {FDBBoost} FDBBoost FDBBoost instance.
 * @return {EncodingNamespace} an EncodingNamespace instance
###
module.exports = (FDBoost) ->
  class EncodingNamespace 
    ###*
     * Creates a new EncodingNamespace instance
     * @class
     * @param {FDBoost} FDBoost FDBoost instance.
     * @property {object} typeCodes Type codes dictionary.
     * @return {EncodingNamespace} an EncodingNamespace instance.
    ###
    constructor: (@FDBoost) ->
      @typeCodes =
        'undefined': 0
        'string': 1
        'integer': 2
        'double': 3
        'boolean': 4
        'null': 5
        'date': 6
        'array': 7
        'object': 8
    
      @buffers = require('./buffers')(@)
  
    ###*
     * Encode value to buffer
     * @method
     * @param {string} prefix Optional prefix identifier.
     * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
     * @return {Buffer} Buffer
    ###
    encode: require('./encode')
    
    ###*
     * Decode value from buffer
     * @method
     * @param {string} prefix Optional prefix identifier.
     * @param {Buffer} buffer Buffer to decode.
     * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
    ###
    decode: require('./decode')
  
  new EncodingNamespace(FDBoost)