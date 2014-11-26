class FDBoost
  constructor: (fdb) ->
    @__fdb = null
    @__db = null
    
    @init(fdb)

  init: (fdb) ->
    @__fdb = fdb if fdb
  
  Debug: require('./debug')
    
  #packValue: require('./packvalue')
  #unpackValue: require('./unpackvalue')
  #packArray: require('./packarray')
  #unpackArray: require('./unpackarray')
  #countKeys: require('./countkeys')
  #countClustered: require('./clusteredcounter')
  #
  getLastKey: require('./getlastkey')
  
  RangeQuery: require('./rangequery')
  
  __getBoundariesTaskPrototype: require('./boundariestask')
  
  Object.defineProperties @::, 
    fdb: 
      get: ->
        @__fdb = require('fdb').apiVersion(200) if !@__fdb
        @__fdb
        
    db:
      get: ->
        @__db = @fdb.open() if (!@__db)
        @__db
            
  
    BoundariesTask:
      get: -> @__getBoundariesTaskPrototype()
 
module.exports = (fdb) ->
  new FDBoost(fdb)
  