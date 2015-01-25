AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class String extends TypedBuffer

module.exports = (encoding) ->
	class StringAdapter extends AbstractAdapter   
	  getType: -> 
	    String

	  loadData: (value) ->
	    @initData(value.length)
	    @writeString(value)
	    return
	  
	  getValue: (buffer) -> buffer.toString('utf8', @pos)