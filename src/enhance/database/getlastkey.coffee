###*
 * Get the Transaction~getLastKey method
 * @method
 * @param {object} fdb fdb module.
 * @param {object} debug Debug instance.
 * @return {function} getLastKey
###      
module.exports = (fdb, debug) ->
  ###*
   * The callback format for the Transaction~getLastKey method
   * @callback Transaction~getLastKeyCallback
   * @param {Error} error An error instance representing the error during the execution.
   * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
  ###

  ###*
   * Get the last key of the range based on a keyPrefix
   * @method
   * @param {object} tr Transaction.
   * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
   * @param {Transaction~getLastKeyCallback} callback Callback.
   * @return {undefined}
  ###      
  keyToString = (key) ->
    if (key.asFoundationDBKey)
      new Buffer(key.asFoundationDBKey()).toString()
    else
      key
  
  getLastKey = (tr, keyPrefix, callback) ->
    debug (writer) ->
      writer.buffer('keyPrefix', keyToString(keyPrefix))
      writer.log('getLastKey')
      
    iterator = tr.getRangeStartsWith(keyPrefix, { limit: 1, reverse: true })
    iterator.toArray (err, arr) ->
      if (err)
        callback(err)
      else 
        key = arr[0].key if arr.length is 1
        callback(null, key)
        
      return
      
    return
    
  (keyPrefix, callback) ->
    throw new Error('keyPrefix cannot be undefined') unless keyPrefix

    fdb.future.create (futureCb) =>
      getLastKey(@, keyPrefix, futureCb)
    , callback