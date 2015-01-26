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
    enhance(@fdb)
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