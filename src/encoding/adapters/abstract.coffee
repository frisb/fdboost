module.exports = class AbstractAdapter
  constructor: (valueOrBuffer, @pos = 0) ->
    @data = null
    
    if (Buffer.isBuffer(valueOrBuffer))
      @value = @getValue(valueOrBuffer)
    else
      @loadData(valueOrBuffer)
  
  initData: (size) ->
    @data = new Buffer(@pos + size)
  
  verifyData: ->
    throw new Error('Data property not initialized') if @data is null
    return
  
  loadData: ->
    @initData(@pos)
    
  writeString: (value) ->
    @verifyData()
    
    @data.write(value, @pos, value.length, 'utf8')
    @pos += value.length
    return
    
  writeDoubleBE: (value) ->
    @verifyData()
    
    @data.writeDoubleBE(value, @pos)
    @pos += 8
    return
    
  writeInt32BE: (value) ->
    @verifyData()
    
    @data.writeInt32BE(value, @pos)
    @pos += 4
    return
    
  writeInt32LE: (value) ->
    @verifyData()
    
    @data.writeInt32LE(value, @pos)
    @pos += 4
    return
    
  writeUInt8: (value) ->
    @verifyData()
    
    @data.writeUInt8(value, @pos)
    @pos += 1
    return
    
  writeUInt32LE: (value) ->
    @verifyData()
    
    @data.writeUInt32LE(value, @pos)
    @pos += 4
    return
    
  copyFrom: (source) ->
    @verifyData()
    
    source.copy(@data, @pos) 
    @pos += source.length
    return