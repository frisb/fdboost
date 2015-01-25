# fdb = require('fdboost').apiVersion(300)

# fdb = require('fdboost')()

# fdb = require('fdb').apiVersion(300)
# require('fdboost').use(fdb)


enhance = require('./enhance')

latestVersion = 300
instance = null

class FDBoost
  fdb: null
  Debug: require('./debug')

  boost: () ->
    enhance(@)
    @fdb

  Object.defineProperty @::, 'factory',
    get: ->
      factory = (version) ->
        factory.apiVersion(version)

      factory.apiVersion = (version = latestVersion) =>
        @fdb = require('fdb').apiVersion(version) if @fdb is null
        @boost()

      factory.use = (fdb) ->
        throw new Error('Must provide fdbModule instance') unless @fdb
        @boost()

      factory

instance = new FDBoost() if instance is null

module.exports = instance.factory


# class FDBoost
#   constructor: (fdb) ->
#     @__fdb = null
#     @__db = null
    
#     @init(fdb)
    
#     @encoding = require('./encoding')(@)
#     @range = require('./range')(@)

#   init: (fdb) ->
#     @__fdb = fdb if fdb
#     return
  
#   Debug: require('./debug')
  
#   Object.defineProperties @::, 
#     fdb: 
#       get: ->
#         @__fdb = require('fdb').apiVersion(300) if !@__fdb
#         @__fdb
        
#     db:
#       get: ->
#         @__db = @fdb.open() if (!@__db)
#         @__db
 
# module.exports = (fdb) ->
#   new FDBoost(fdb)
  