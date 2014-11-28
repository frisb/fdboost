###*
 * Get the FDBoost~range~getLastKey method
 * @method
 * @param {object} FDBoost FDBoost instance.
 * @return {function} getLastKey
###      
module.exports = (FDBoost) ->
  debug = FDBoost.Debug('FDBoost.range.getLastKey')
  
  ###*
   * The callback format for the FDBoost~range~getLastKey method
   * @callback FDBoost~range~getLastKeyCallback
   * @param {Error} error An error instance representing the error during the execution.
   * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
  ###

  ###*
   * Get the last key of the range based on a keyPrefix
   * @method
   * @param {object} tr Transaction.
   * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
   * @param {FDBoost~range~getLastKeyCallback} callback Callback.
   * @return {undefined}
  ###      
  getLastKey = (tr, keyPrefix, callback) ->
    debug.buffer('keyPrefix', keyPrefix)
    debug.log('getLastKey')
      
    iterator = tr.getRangeStartsWith(keyPrefix, { limit: 1, reverse: true })
    iterator.toArray (err, arr) ->
      if (err)
        callback(err)
      else 
        key = arr[0].key if arr.length is 1
        callback(null, key)
        
      return
      
    return
    
  (tr, keyPrefix, callback) ->
    if (!callback)
      callback = keyPrefix if keyPrefix
      keyPrefix = tr
      tr = null
      
    transactionGetLastKey = FDBoost.fdb.transactional(getLastKey)
    transactionGetLastKey(tr || FDBoost.db, keyPrefix, callback)
  
  
        
