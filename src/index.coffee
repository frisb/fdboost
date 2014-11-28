class FDBoost
  constructor: (fdb) ->
    @__fdb = null
    @__db = null
    
    @init(fdb)
    
    @encoding = require('./encoding')(@)
    @range = require('./range')(@)

  init: (fdb) ->
    @__fdb = fdb if fdb
  
  Debug: require('./debug')
  
  Object.defineProperties @::, 
    fdb: 
      get: ->
        @__fdb = require('fdb').apiVersion(200) if !@__fdb
        @__fdb
        
    db:
      get: ->
        @__db = @fdb.open() if (!@__db)
        @__db
 
module.exports = (fdb) ->
  new FDBoost(fdb)
  