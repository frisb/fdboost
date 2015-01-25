AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Double extends TypedBuffer

module.exports = (encoding) ->
	class DoubleAdapter extends AbstractAdapter      
	  getType: -> 
	    Double

	  loadData: (value) ->
	    @initData(8)
	    @writeDoubleBE(value)
	    return
	    
	  getValue: (buffer) -> buffer.readDoubleBE(@pos)