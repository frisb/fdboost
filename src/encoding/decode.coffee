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
 * @param {string} prefix Optional prefix identifier.
 * @param {Buffer} buffer Buffer to decode.
 * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
###
module.exports = (prefix, buffer) ->
  if (!buffer) 
    buffer = prefix
    prefix = null
  
  return null if !buffer
  
  fdb = @FDBoost.fdb
  typeCodes = @FDBoost.encoding.typeCodes
  typeCodeIndex = 0
  
  if (prefix)
    prefixBuffer = new Buffer(prefix, 'ascii') 
  
    if (validatePrefix(buffer, prefixBuffer))
      typeCodeIndex = prefixBuffer.length
    else
      throw new Error("Invalid prefix \"#{prefix}\".")
  
  ###*
   * Decode value from buffer
   * @method
   * @param {Buffer} buf Buffer to decode.
   * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
  ###
  decode = (buf) ->
    typeCode = buf.slice(typeCodeIndex, 4).toString('hex')
    buf = buf.slice(typeCodeIndex + 1) if typeCode isnt '00' && typeCode isnt '05'
  
    switch typeCode
      when '00' then return # undefined
      when '01' then buf.toString('utf8') # string
      when '02' then buf.readInt32BE(0) # integer
      when '03' then buf.readDoubleBE(0) # double
      when '04' then buf.readUInt8(0) is 1 # boolean
      when '05' then null # null
      when '06' then parseDate(buf) # date
      when '07' then (decode(item) for item in fdb.tuple.unpack(buf)) # array
      when '08' then surreal.deserialize(buf.toString('utf8')) # object
  
      else
        throw new Error("Unknown typeCode \"#{typeCode}\".")
        
  decode(buffer)