###*
 * Encode value to buffer
 * @method
 * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
 * @param {string} prefix Optional prefix identifier.
 * @return {Buffer} Buffer
###
module.exports = (value, prefix) ->
  return value if value is '\xff'
  
  switch typeof value
    when 'undefined'
      # undefined
      new @buffers.Undefined(prefix).write()
      
    when 'string'
      # string
      new @buffers.String(prefix, value).write()
      
    when 'number' 
      if (value % 1 is 0)
        # integer
        new @buffers.Integer(prefix, value).write()
        
      else 
        # double
        new @buffers.Double(prefix, value).write()
        
    when 'boolean'
      # boolean
      new @buffers.Boolean(prefix, value).write()
      
    else 
      if (value is null)
        # null
        new @buffers.Null(prefix).write()
        
      else if (value instanceof Date)
        # date
        new @buffers.Date(prefix, value).write()
        
      else if (value instanceof Array)
        # array
        new @buffers.Array(prefix, value).write()
        
      else if (value instanceof Object) 
        # object
        new @buffers.Object(prefix, value).write()
    
      else
        throw new Error("the encode function accepts only string, number, boolean, date, array and object")