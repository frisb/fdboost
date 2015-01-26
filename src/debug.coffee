chalk = require('chalk')
surreal = require('surreal')
debug = require('debug')

debugs = {}

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
  constructor: (@category, @color) ->
    @buf = null

  buffer: (description, data) ->
    if (@isActive && description)
      @buf = Object.create(null) if @buf is null
      @buf[description] = data || ''

    return
      
  log: (text, description, data) ->
    @buffer(description, data) if description

    d = debugs[@category]
    
    if (!d)
      d = debug(@category)
      debugs[@category] = d
    
    if (@buf isnt null)
      metadata = chalk.dim(jsonShrink(@buf))
      @buf = null
    
    d(text, metadata)
    
module.exports = (category, color) ->
  instance = new Debug(category, color)

  (callback) ->
    callback(instance)