AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Boolean extends TypedBuffer

module.exports = (encoding) ->
	class BooleanAdapter extends AbstractAdapter    
		getType: -> 
			Boolean

		loadData: (value) ->
			@initData(1)
			@writeUInt8(if value then 1 else 0)
			return

		getValue: (buffer) -> buffer.readUInt8(@pos) is 1