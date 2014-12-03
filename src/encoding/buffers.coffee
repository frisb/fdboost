surreal = require('surreal')
EPOCH_DATE = new Date(1900, 0, 1)

module.exports = (encoding) ->
  AbstractBuffer = require('./abstractbuffer')(encoding)
  
  'Abstract': AbstractBuffer
  
  'Undefined': class UndefinedBuffer extends AbstractBuffer
    constructor: (@prefix) ->
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.undefined).buf
      
    read: ->
      return
  
  'String': class StringBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.string, @value.length)
      super(@value, 'utf8')
      
    read: ->
      @buf.toString('utf8', @pos, @end)
  
  'Integer': class IntegerBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->    
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.integer, 4)
      @writeInt32BE(@value)
      
    read: ->
      @buf.readInt32BE(@pos)
      
  'Double': class DoubleBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->    
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.double, 8)
      @writeDoubleBE(@value)
      
    read: ->
      @buf.readDoubleBE(@pos)
  
  'Boolean': class BooleanBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->    
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.boolean, 1)
      @writeUInt8((if @value then 1 else 0))
      
    read: ->
      @buf.readUInt8(@pos) is 1
      
  'Null': class NullBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->    
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.null).buf
      
    read: ->
      null
  
  'Date': class DateBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->    
      
    write: ->
      @asEncoder(@prefix, encoding.typeCodes.date, 8)
      
      days = ~~((@value.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24))
      seconds = @value.getHours() * 60 * 60
      seconds += @value.getMinutes() * 60
      seconds += @value.getSeconds()
      milliseconds = (seconds * 1000) + @value.getMilliseconds()
      
      @writeInt32LE(days)
      @writeUInt32LE(milliseconds)    
      
    read: ->
      days = @buf.readInt32LE(@pos)
      milliseconds = @buf.readUInt32LE(@pos + 4)
    
      date = new Date(1900, 0, 1)
      date.setDate(date.getDate() + days)
      date.setMilliseconds(date.getMilliseconds() + milliseconds)
      
      date
  
  'Array': class ArrayBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->  
      
    write: ->
      countBuf = new Buffer(4)
      countBuf.writeUInt32LE(@value.length, 0)
      
      arr = new Array(1 + (@value.length * 2))
      arr[0] = countBuf
      
      len = countBuf.length
      
      for child, i in @value
        j = 1 + (i * 2)
        childBuf = encoding.encode(child)
        
        lengthBuf = new Buffer(4)
        lengthBuf.writeUInt32LE(childBuf.length, 0)
        
        arr[j] = lengthBuf
        arr[j + 1] = childBuf
        
        len += lengthBuf.length + childBuf.length
      
      @asEncoder(@prefix, encoding.typeCodes.array, len)
      @copyFrom(arr)
      
    read: ->
      childCount = @buf.readUInt32LE(@pos)
      @pos += 4
      
      arr = new Array(childCount)
      
      for i in [0...childCount]
        childLength = @buf.readUInt32LE(@pos)
        @pos += 4
        
        arr[i] = AbstractBuffer.createFrom(undefined, @buf, @pos, @pos + childLength).read()
        @pos += childLength
      
      arr
  
  'Object': class ObjectBuffer extends AbstractBuffer
    constructor: (@prefix, @value) ->
      
    write: ->
      json = surreal.serialize(@value)
      
      @asEncoder(@prefix, encoding.typeCodes.object, json.length)
      super(json, 'utf8')
      
    read: ->
      surreal.deserialize(@buf.toString('utf8', @pos, @end))