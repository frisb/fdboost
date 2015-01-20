AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Array extends TypedBuffer

module.exports = (encoding) ->
	class ArrayAdapter extends AbstractAdapter      
	  getType: -> 
	    Array

	  loadData: (value) ->
	    d = encoding.FDBoost.fdb.tuple.pack(encoding.encode(item) for item in value)
	    @initData(d.length)
	    @copyFrom(d)
	    return
	    
	  getValue: (buffer) ->
	    d = new Buffer(buffer.length - @pos)
	    buffer.copy(d, 0, @pos)
	    (encoding.decode(item) for item in encoding.FDBoost.fdb.tuple.unpack(d))