###*
 * Type codes dictionary.
 * @instance
 * @property {integer} undefined
 * @property {integer} string
 * @property {integer} integer
 * @property {integer} double
 * @property {integer} boolean
 * @property {integer} null
 * @property {integer} date
 * @property {integer} array
 * @property {integer} object
 * @function {Function} get Returns typeCode value for name.
###   
module.exports =
  'undefined': 0
  'string': 1
  'integer': 2
  'double': 3
  'boolean': 4
  'null': 5
  'date': 6
  'array': 7
  'object': 8
  
  ###*
   * Gets type code value for name.
   * @method
   * @param {string} name Type name to get value for.
   * @return {integer} Type code value
  ###    
  'get': (name) ->
    switch typeof name
      when 'undefined' then @undefined
      when 'string' then @string
      when 'number' 
        if (value % 1 is 0) then @integer
        else @double
      when 'boolean' then @boolean
      else 
        if (value is null) then @null
        else if (value instanceof Date) then @date
        else if (value instanceof Array) then @array
        else if (value instanceof Object)  then @object
        else
          throw new Error("the encode function accepts only string, number, boolean, date, array and object")