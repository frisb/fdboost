surreal = require('surreal')

buffer = (typeCode, buf) ->
  if buf
    Buffer.concat([typeCode, buf], buf.length + 1) 
  else 
    typeCode
  
module.exports = (v) ->
  fdb = @FDBoost.fdb
  typeCodes = @FDBoost.encoding.typeCodes
    
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
          buf = new Buffer(10)
          console.log(val.getTime())
          buf.writeUInt32LE(val.getTime(), 0)
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
          
  encode(v)