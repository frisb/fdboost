ObjectAdapter = require('./object')
TypedBuffer = require('../typedbuffer')

class Function extends TypedBuffer

module.exports = (encoding) ->
	class FunctionAdapter extends ObjectAdapter(encoding)     
	  getType: -> 
	    Function