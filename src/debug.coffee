surreal = require('surreal')
Writeln = require('writeln')

writelns = {}

jsonShrink = (s) ->
  s = surreal.serialize(s, 2) if typeof s isnt 'string'
  
  if (s[0] is '{' && s[s.length - 1] is '}')
    # json
    
    s = s
    .substr(1, s.length - 2)
    #.replace(/"/g, '')
    #.replace(/:/g, ': ')
    #.replace(/,/g, '\n')                
    #.replace(/\{/g, '{ ')
    #.replace(/\}/g, ' }')
  
  s

class Debug
  constructor: (@category, @isActive) ->
    @buf = null
    
  buffer: (description, data, transformer, scope) ->
    if (@isActive && typeof(data) isnt 'undefined')
      @buf = Object.create(null) if @buf is null
      
      try
        data = transformer.call(scope, data) if transformer && typeof scope isnt 'undefined'
      catch e
        @log()
        @buffer('message', e.message)
        @buffer('description', description)
        @buffer('data', data)
        @buffer('transformer', transformer)
        @buffer('scope', scope)
        @log('debug error')
        console.log(e.message)
      @buf[description] = data
      return
      
  log: (text) ->
    writeln = writelns[@category]
    
    if (!writeln)
      writeln = new Writeln(@category)
      writelns[@category] = writeln
    
    if (@buf isnt null)
      metadata = jsonShrink(@buf)
      @buf = null
    
    writeln.debug(text, metadata)
    
module.exports = (category) ->
  new Debug(category, process.env.NODE_ENV isnt 'production')
    