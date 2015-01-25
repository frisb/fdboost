module.exports = class EncodingNamespace 
  ###*
   * Creates a new EncodingNamespace instance
   * @class
   * @param {FDBoost} fdboost FDBoost instance.
   * @property {object} typeCodes Type codes dictionary.
   * @return {EncodingNamespace} an EncodingNamespace instance.
  ###
  constructor: (@fdboost) ->
    @adapters = require('./adapters')(@)

  ###*
   * Encode value to buffer
   * @method
   * @param {string} [prefix] String identifier.
   * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
   * @return {Buffer} Buffer
  ###
  encode: (value, prefix) ->
    return value if value is '\xff'
    
    startPos = 1 # accounting for type code
    typeCode = @adapters.types.get(value)
    TypedAdapter = @adapters.get(typeCode)
    
    if (prefix)
      startPos += prefix.length
      adapter = new TypedAdapter(value, startPos)
      adapter.data.write(prefix, 0, startPos, 'ascii')
    else
      adapter = new TypedAdapter(value, startPos)
      
    adapter.data.writeUInt8(typeCode, startPos - 1)
    adapter.data
  
  ###*
   * Decode value from buffer
   * @method
   * @param {Buffer} buffer Buffer to decode.
   * @param {string} [prefix] String identifier.
   * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
  ###
  decode: (buffer, prefix) ->
    return null if !buffer
    
    startPos = 0
    
    if (prefix)
      if (buffer.toString('ascii', 0, prefix.length) is prefix)
        startPos = prefix.length
      else
        throw new Error("Invalid prefix \"#{prefix}\".")
        
    typeCode = buffer.readUInt8(startPos)
    TypedAdapter = @adapters.get(typeCode)
    
    adapter = new TypedAdapter(buffer, startPos + 1)
    adapter.value

module.exports = (fdboost) ->
  fdboost.fdb.encoding = new EncodingNamespace(fdboost)