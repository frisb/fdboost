AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

EPOCH_DATE = new Date(1900, 0, 1)

class DateTime extends TypedBuffer

module.exports = (encoding) ->
	class DateTimeAdapter extends AbstractAdapter     
	  getType: -> 
	    DateTime
	 
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