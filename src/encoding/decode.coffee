surreal = require('surreal')

module.exports = (v) ->
  fdb = @FDBoost.fdb
  typeCodes = @FDBoost.encoding.typeCodes
  
  decode = (val) ->
    return null if !val
    return val if val is '\xff'
  
    typeCode = val.slice(0, 1).toString('hex')
    value = val.slice(1) if typeCode isnt typeCodes.undefined && typeCode isnt typeCodes.null
  
    switch typeCode
      when '00' then return # undefined
      when '01' then value.toString('utf8') # string
      when '02' then value.readInt32BE(0) # integer
      when '03' then value.readDoubleBE(0) # double
      when '04' then value.readUInt8(0) is 1 # boolean
      when '05' then null # null
      when '06' then new Date(value.readInt32LE(0)) # date
      when '07' then (decode(item) for item in fdb.tuple.unpack(value)) # array
      when '08' then surreal.deserialize(value.toString('utf8')) # object
  
      else
        throw new Error("the type (#{typeCode}) of the passed val  is unknown")
        
  decode(v)