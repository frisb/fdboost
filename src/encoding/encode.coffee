surreal = require('surreal')
EPOCH_DATE = new Date(1900, 0, 1)

###*
   * Encode value to buffer
   * @method
   * @param {string} prefix Optional prefix identifier.
   * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
   * @return {Buffer} Buffer
  ###
module.exports = (prefix, value) ->
  if (!value) 
    value = prefix
    value = null
    
  fdb = @FDBoost.fdb
  typeCodes = @FDBoost.encoding.typeCodes
  prefix = new Buffer(prefix, 'ascii') if prefix
  
  ###*
   * Build buffer with prefix, typeCode and value
   * @method
   * @param {Buffer} typeCode Type code buffer.
   * @param {Buffer} buf Value buffer.
   * @return {Buffer} Buffer
  ###  
  buffer = (typeCode, buf) ->
    start = if prefix then Buffer.concat([prefix, typeCode], prefix.length + 1) else typeCode
    
    if buf
      Buffer.concat([start, buf], start.length + buf.length)
    else 
      start
  
  ###*
   * Encode value to buffer
   * @method
   * @param {(undefined|string|integer|double|boolean|null|date|array|object)} val Value to encode.
   * @return {Buffer} Buffer
  ###
  encode = (val) ->
    return val if val is '\xff'
    
    switch typeof val
      when 'undefined' 
        # undefined
        buffer(typeCodes.undefined)
        
      when 'string'
        # string
        buffer(typeCodes.string, new Buffer(val, 'utf8')) 
      
      when 'number' 
        if (val % 1 is 0)
          # integer
          buf = new Buffer(4)
          buf.writeInt32BE(val, 0)
          buffer(typeCodes.integer, buf)
          
        else 
          # double
          buf = new Buffer(8)
          buf.writeDoubleBE(val, 0)
          buffer(typeCodes.double, buf)
          
      when 'boolean'
        # boolean
        buf = new Buffer(1)
        buf.writeUInt8((if val then 1 else 0), 0)
        buffer(typeCodes.boolean, buf) 
        
      else 
        if (val is null)
          # null
          buffer(typeCodes.null)                                                              
          
        else if (val instanceof Date)
          # date
          buf = new Buffer(8)
          
          days = ~~((val.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24))
          seconds = val.getHours() * 60 * 60
          seconds += val.getMinutes() * 60
          seconds += val.getSeconds()
          milliseconds = (seconds * 1000) + val.getMilliseconds()
          
          buf.writeInt32LE(days, 0)
          buf.writeUInt32LE(milliseconds, 4)
          
          buffer(typeCodes.date, buf)                             
          
        else if (val instanceof Array)
          # array
          buf = fdb.tuple.pack(encode(val[i]) for i in [0...val.length])
          buffer(typeCodes.array, buf) 
          
        else if (val instanceof Object) 
          # object
          buffer(typeCodes.object, new Buffer(surreal.serialize(val), 'utf8'))
      
        else
          throw new Error("the encode function accepts only string, number, boolean, date, array and object")
          
  encode(value)