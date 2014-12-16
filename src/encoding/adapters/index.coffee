surreal = require('surreal')
AbstractAdapter = require('./abstract')
EPOCH_DATE = new Date(1900, 0, 1)

###*
 * Get an Adapter factory object to provide an adaptor for typeCode
 * @method
 * @param {EncodingNamespace} encoding EncodingNamespace instance.
 * @return {object} Adapter factory
###     
module.exports = (encoding) ->
  types: require('./typecodes')
  
  Undefined: class UndefinedAdapter extends AbstractAdapter   
    getValue: -> undefined
  
  String: class StringAdapter extends AbstractAdapter   
    loadData: (value) ->
      @initData(value.length)
      @writeString(value)
      return
    
    getValue: (buffer) -> buffer.toString('utf8', @pos)
  
  Integer: class IntegerAdapter extends AbstractAdapter   
    loadData: (value) ->
      @initData(4)
      @writeInt32BE(value)
      return
      
    getValue: (buffer) -> buffer.readInt32BE(@pos)
      
  Double: class DoubleAdapter extends AbstractAdapter   
    loadData: (value) ->
      @initData(8)
      @writeDoubleBE(value)
      return
      
    getValue: (buffer) -> buffer.readDoubleBE(@pos)
  
  Boolean: class BooleanAdapter extends AbstractAdapter   
    loadData: (value) ->
      @initData(1)
      @writeUInt8(if value then 1 else 0)
      return
      
    getValue: (buffer) -> buffer.readUInt8(@pos) is 1
      
  Null: class NullAdapter extends AbstractAdapter   
    getValue: -> null
  
  Date: class DateAdapter extends AbstractAdapter   
    loadData: (value) ->
      @initData(8)
      
      days = ~~((value.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24))
      seconds = value.getHours() * 60 * 60
      seconds += value.getMinutes() * 60
      seconds += value.getSeconds()
      milliseconds = (seconds * 1000) + value.getMilliseconds()
      
      @writeInt32LE(days)
      @writeUInt32LE(milliseconds)   
      return 
      
    getValue: (buffer) ->
      days = buffer.readInt32LE(@pos)
      milliseconds = buffer.readUInt32LE(@pos + 4)
    
      date = new Date(1900, 0, 1)
      date.setDate(date.getDate() + days)
      date.setMilliseconds(date.getMilliseconds() + milliseconds)
      
      date
  
  Array: class ArrayAdapter extends AbstractAdapter   
    loadData: (value) ->
      d = encoding.FDBoost.fdb.tuple.pack(encoding.encode(item) for item in value)
      @initData(d.length)
      @copyFrom(d)
      return
      
    getValue: (buffer) ->
      d = new Buffer(buffer.length - @pos)
      buffer.copy(d, 0, @pos)
      (encoding.decode(item) for item in encoding.FDBoost.fdb.tuple.unpack(d))
  
  Object: class ObjectAdapter extends AbstractAdapter   
    loadData: (value) ->
      json = surreal.serialize(value)
      @initData(json.length)
      @writeString(json)
      return
      
    getValue: (buffer) -> 
      console.log(@pos)
      surreal.deserialize(buffer.toString('utf8', @pos))
  
  ###*
   * Get an Adapter for typeCode
   * @method
   * @param {integer} typeCode Type code.
   * @return {AbstractAdapter} AbstractAdapter extension
  ###            
  get: (typeCode) ->
    switch (typeCode)
      when @types.undefined then @Undefined
      when @types.string then @String
      when @types.integer then @Integer
      when @types.double then @Double
      when @types.boolean then @Boolean
      when @types.null then @Null
      when @types.date then @Date
      when @types.array then @Array
      when @types.object then @Object
      else
        throw new Error("Unknown typeCode \"#{typeCode}\".")