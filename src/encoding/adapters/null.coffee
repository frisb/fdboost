AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Null extends TypedBuffer

module.exports = (encoding) ->
	class NullAdapter extends AbstractAdapter      
	  getType: -> 
	    Null

	  getValue: -> null