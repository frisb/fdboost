surreal = require('surreal')

AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Object extends TypedBuffer

module.exports = (encoding) ->
	class ObjectAdapter extends AbstractAdapter       
	  getType: -> 
	    Object
	 
	  loadData: (value) ->
	    json = surreal.serialize(value)
	    @initData(json.length)
	    @writeString(json)
	    return
	    
	  getValue: (buffer) -> 
	    surreal.deserialize(buffer.toString('utf8', @pos))