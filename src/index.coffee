enhance = require('./enhance')

latestVersion = 300
instance = null

class Booster
  fdb: null
  Debug: require('./debug')

  boost: (fdb) ->
    enhance(fdb)
    fdb

  Object.defineProperty @::, 'factory',
    get: ->
      factory = (version) ->
        console.log(version)

        factory.apiVersion(version)

      factory.apiVersion = (version = latestVersion) =>
        @fdb = require('fdb').apiVersion(version) if @fdb is null
        @boost(@fdb)

      factory.use = (fdb) ->
        throw new Error('Must provide fdbModule instance') unless fdb
        @boost(fdb)

      factory

booster = new Booster() if instance is null

module.exports = booster.factory