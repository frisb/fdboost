###*
 * Get an Adapter factory object to provide an adaptor for typeCode
 * @method
 * @param {EncodingNamespace} encoding EncodingNamespace instance.
 * @return {object} Adapter factory
###     
module.exports = (encoding) ->
  types: require('../typecodes')
  Undefined: require('./undefined')(encoding)
  String: require('./string')(encoding)
  Integer: require('./integer')(encoding)
  Double: require('./double')(encoding)
  Boolean: require('./boolean')(encoding)
  Null: require('./null')(encoding)
  DateTime: require('./datetime')(encoding)
  Array: require('./array')(encoding)
  Object: require('./object')(encoding)
  Function: require('./function')(encoding)
  
  ###*
   * Get an Adapter for typeCode
   * @method
   * @param {integer} typeCode Type code.
   * @return {AbstractAdapter} AbstractAdapter extension
  ###            
  get: (typeCode) ->
    switch (typeCode)
      when @types.undefined then @Undefined
      when @types.string then @String
      when @types.integer then @Integer
      when @types.double then @Double
      when @types.boolean then @Boolean
      when @types.null then @Null
      when @types.datetime then @DateTime
      when @types.array then @Array
      when @types.object then @Object
      when @types.function then @Function
      else
        throw new Error("Unknown typeCode \"#{typeCode}\".")