module.exports = class AbstractAdapter
  ###*
   * Extend an AbstractAdapter instance for encoding and decoding typed values.
   * @abstract
   * @param {(Buffer|undefined|string|integer|double|boolean|null|date|array|object)} valueOrBuffer Value to encode or buffer instance to decode.
   * @param {integer} [pos=0] Buffer position to start writing data.
   * @property {Buffer} data Encoded buffer.
   * @property {(undefined|string|integer|double|boolean|null|date|array|object)} value Decoded value.
   * @return {object} Extended AbstractAdapter instance.
  ###
  constructor: (valueOrBuffer, @pos = 0) ->
    @data = null
    
    if (Buffer.isBuffer(valueOrBuffer))
      @value = @getValue(valueOrBuffer)
    else
      @loadData(valueOrBuffer)
  
  ###*
   * Initializes a new buffer.
   * @method
   * @param {integer} size Size of new buffer.
   * @return {undefined}
  ###
  initData: (size) ->
    @data = new Buffer(@pos + size)
    return
  
  ###*
   * Verifies that a data buffer exists.
   * @method
   * @return {undefined}
  ###
  verifyData: ->
    throw new Error('Data property not initialized') if @data is null
    return
  
  ###*
   * Loads data into initialized buffer instance.
   * @virtual
   * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode to buffer.
   * @return {undefined}
  ###
  loadData: (value) ->
    @initData(@pos)
    return
  
  ###*
   * Writes string to data buffer.
   * @method
   * @param {string} value String value to write.
   * @return {undefined}
  ###  
  writeString: (value) ->
    @verifyData()
    
    @data.write(value, @pos, value.length, 'utf8')
    @pos += value.length
    return
  
  ###*
   * Writes double to data buffer.
   * @method
   * @param {double} value Double value to write.
   * @return {undefined}
  ###    
  writeDoubleBE: (value) ->
    @verifyData()
    
    @data.writeDoubleBE(value, @pos)
    @pos += 8
    return
  
  ###*
   * Writes 32bit Big Endian signed integer to data buffer.
   * @method
   * @param {integer} value Integer value to write.
   * @return {undefined}
  ###    
  writeInt32BE: (value) ->
    @verifyData()
    
    @data.writeInt32BE(value, @pos)
    @pos += 4
    return
  
  ###*
   * Writes 32bit Little Endian signed integer to data buffer.
   * @method
   * @param {integer} value Integer value to write.
   * @return {undefined}
  ###    
  writeInt32LE: (value) ->
    @verifyData()
    
    @data.writeInt32LE(value, @pos)
    @pos += 4
    return
  
  ###*
   * Writes 8bit unsigned integer to data buffer.
   * @method
   * @param {integer} value Integer value to write.
   * @return {undefined}
  ###    
  writeUInt8: (value) ->
    @verifyData()
    
    @data.writeUInt8(value, @pos)
    @pos += 1
    return
  
  ###*
   * Writes 32bit unsigned Little Endian integer to data buffer.
   * @method
   * @param {integer} value Integer value to write.
   * @return {undefined}
  ###    
  writeUInt32LE: (value) ->
    @verifyData()
    
    @data.writeUInt32LE(value, @pos)
    @pos += 4
    return
  
  ###*
   * Copies data from source buffer to data buffer.
   * @method
   * @param {Buffer} source Source buffer to copy data from.
   * @return {undefined}
  ###    
  copyFrom: (source) ->
    @verifyData()
    
    source.copy(@data, @pos) 
    @pos += source.length
    return