AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Undefined extends TypedBuffer

module.exports = (encoding) ->
	class UndefinedAdapter extends AbstractAdapter    
	  getType: -> 
	    Undefined
	  
	  getValue: -> undefined