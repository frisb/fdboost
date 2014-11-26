###*
 * Creates a new Global variable instance
 * @class
 * @param {object} fdb FoundationDB api.
 * @property {object} fdb FoundationDB api.
 * @property {object} db Database instance.
 * @return {Global} a Global variable instance.
###
class Global
  init: (@fdb) ->
    @fdb ?= require('fdb').apiVersion(200)
    @db = @fdb.open()
   
instance = new Global() 

module.exports = instance