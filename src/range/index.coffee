###*
 * Get a new RangeNamespace instance 
 * @method
 * @param {FDBBoost} FDBBoost FDBBoost instance.
 * @return {RangeNamespace} a RangeNamespace instance
###    
module.exports = (FDBoost) ->
  class RangeNamespace 
    ###*
     * Creates a new RangeNamespace instance
     * @class
     * @property {BoundariesTask} BoundariesTask BoundariesTask class.
     * @property {Query} Query Query class.
     * @return {RangeNamespace} a RangeNamespace instance.
    ###
    constructor: ->
      @BoundariesTask = require('./boundariestask')(FDBoost)
      @Query = require('./query')(FDBoost)
      
    countKeys: require('./countkeys')(FDBoost)
    
    ###*
     * Get the last key of the range based on a keyPrefix
     * @method
     * @param {object} tr Optional Transaction.
     * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
     * @param {FDBoost~range~getLastKeyCallback} callback Optional Callback.
     * @return {undefined}
    ###      
    getLastKey: require('./getlastkey')(FDBoost)
    
  new RangeNamespace()