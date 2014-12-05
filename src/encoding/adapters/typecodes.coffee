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
  'get': (value) ->
    switch typeof value
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