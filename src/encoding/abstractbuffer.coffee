module.exports = (encoding) ->
  class AbstractBuffer
    asEncoder: (prefix, typeCode, valueSize) ->
      @buf = null
      offset = 1 # accounting for type code
      
      valueSize ?= 0
      
      if (prefix)
         # prefix and not array child
        
        offset += prefix.length
        @pos = offset
        @buf = new Buffer(offset + valueSize)
        @write(prefix, valueSize, 'ascii')
      else
        @pos = offset
        @buf = new Buffer(offset + valueSize)
      
      @buf.writeUInt8(typeCode, @pos - 1)
      
      @
    
    asDecoder: (@buf, @pos, @end) ->
      @
    
    copyFrom: (sourceBuffers) ->
      sourceBuffers = [sourceBuffers] if sourceBuffers not instanceof Array
      for src in sourceBuffers
        src.copy(@buf, @pos) 
        @pos += src.length
        
      @buf
        
    write: (string, encoding) ->
      @buf.write(string, @pos, string.length, encoding)
      @pos += string.length
      @buf
      
    writeDoubleBE: (value) ->
      @buf.writeDoubleBE(value, @pos)
      @pos += 8
      @buf
      
    writeInt32BE: (value) ->
      @buf.writeInt32BE(value, @pos)
      @pos += 4
      @buf
      
    writeInt32LE: (value) ->
      @buf.writeInt32LE(value, @pos)
      @pos += 4
      @buf
      
    writeUInt8: (value) ->
      @buf.writeUInt8(value, @pos)
      @pos += 1
      @buf
      
    writeUInt32LE: (value) ->
      @buf.writeUInt32LE(value, @pos)
      @pos += 4
      @buf
      
    @createFrom = (prefix, buffer, pos, end) ->
      pos ?= 0
      
      if (prefix)
        if (buffer.toString('ascii', 0, prefix.length) is prefix)
          pos = prefix.length
        else
          throw new Error("Invalid prefix \"#{prefix}\".")
          
      typeCode = buffer.readUInt8(pos)
        
      pos += 1
        
      switch (typeCode)
        when 0 then new encoding.buffers.Undefined().asDecoder(buffer, pos, end)
        when 1 then new encoding.buffers.String().asDecoder(buffer, pos, end)
        when 2 then new encoding.buffers.Integer().asDecoder(buffer, pos, end)
        when 3 then new encoding.buffers.Double().asDecoder(buffer, pos, end)
        when 4 then new encoding.buffers.Boolean().asDecoder(buffer, pos, end)
        when 5 then new encoding.buffers.Null().asDecoder(buffer, pos, end)
        when 6 then new encoding.buffers.Date().asDecoder(buffer, pos, end)
        when 7 then new encoding.buffers.Array().asDecoder(buffer, pos, end)
        when 8 then new encoding.buffers.Object().asDecoder(buffer, pos, end)
        else
          throw new Error("Unknown typeCode \"#{typeCode}\".")