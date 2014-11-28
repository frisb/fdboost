module.exports = (FDBoost) ->
  class RangeNamespace 
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