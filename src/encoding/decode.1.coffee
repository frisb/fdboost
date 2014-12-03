surreal = require('surreal')

###*
 * Check buffer starts with prefix
 * @method
 * @param {Buffer} buf Buffer to check.
 * @param {Buffer} prefixBuf Prefix buffer.
 * @return {boolean} Boolean
###
validatePrefix = (buf, prefixBuf) ->
  len = prefixBuf.length
  
  return false if buf.length <= prefixBuf.length
  
  prefix = buf.slice(0, len)
  
  for i in [0...len]
    return false if prefix[i] isnt prefixBuf[i]
  
  return true

###*
 * Decode date from buffer
 * @method
 * @param {Buffer} buf Buffer to decode.
 * @return {Date} Date
###
parseDate = (buf) ->
  days = buf.readInt32LE(0)
  milliseconds = buf.readUInt32LE(4)

  date = new Date(1900, 0, 1)
  date.setDate(date.getDate() + days)
  date.setMilliseconds(date.getMilliseconds() + milliseconds)
  
  date

###*
 * Decode value from buffer
 * @method
 * @param {Buffer} buffer Buffer to decode.
 * @param {string} prefix Optional prefix identifier.
 * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
###
module.exports = (buffer, prefix) ->
  return null if !buffer
  
  
  
  
  
  
  
  
  
  
  #fdb = @FDBoost.fdb
  typeCodes = @FDBoost.encoding.typeCodes
  typeCodeIndex = 0
  
  
  
  
  if (prefix)
    prefixBuf = new Buffer(prefix, 'ascii') 
  
    if (validatePrefix(buffer, prefixBuf))
      typeCodeIndex = prefixBuf.length
    else
      throw new Error("Invalid prefix \"#{prefix}\".")
  
  
  getBuffer = =>
    typeCode = buffer.readUInt8(typeCodeIndex)
      
    switch (typeCode)
      when 0 then return
      when 1 then new @buffers.Undefined(buffer)
      when 2 then new @buffers.Integer(buffer)
      when 3 then new @buffers.Double(buffer)
      when 4 then new @buffers.Boolean(buffer)
      when 5 then new @buffers.Null(buffer)
      when 6 then new @buffers.Date(buffer)
      when 7 then new @buffers.Array(buffer)
      when 8 then new @buffers.Object(buffer)
      else
        throw new Error("Unknown typeCode \"#{typeCode}\".")
        
  typedBuffer = getBuffer()
  typedBuffer.pos = typeCodeIndex + 1
  typedBuffer.read()
  
  
  
  ###*
   * Decode value from buffer
   * @method
   * @param {Buffer} buf Buffer to decode.
   * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
  ###
  #decode = (buf) ->
    #
    #
    #
    #
    #typeCode = buf.slice(typeCodeIndex, typeCodeIndex + 1).toString('hex')
    #buf = buf.slice(typeCodeIndex + 1) if typeCode isnt '00' && typeCode isnt '05'
  #
    #switch typeCode
      #when '00' then return # undefined
      #when '01' then buf.toString('utf8') # string
      #when '02' then buf.readInt32BE(0) # integer
      #when '03' then buf.readDoubleBE(0) # double
      #when '04' then buf.readUInt8(0) is 1 # boolean
      #when '05' then null # null
      #when '06' then parseDate(buf) # date
      #when '07' 
        #(decode(item) for item in fdb.tuple.unpack(buf)) # array
        #
        #count = buf.readUInt32LE(0)
        #pos = 4
        #
        #arr = new Array(count)
        #
        #for i in [0...count]
          #len = buf.readUInt32LE(pos)
          #startIndex = pos + 4
          #endIndex = startIndex + len
          #arr[i] = decode(buf.slice(startIndex, endIndex))
          #pos = endIndex
          #
        #arr
        #
      #when '08' then surreal.deserialize(buf.toString('utf8')) # object
  #
      #else
        #throw new Error("Unknown typeCode \"#{typeCode}\".")
        #
  #decode(buffer)