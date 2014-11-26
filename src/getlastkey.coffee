getLastKey = (tr, prefix, callback) ->
  iterator = tr.getRangeStartsWith(prefix, { limit: 1, reverse: true })
  iterator.toArray (err, arr) ->
    if (err)
      callback(err)
    else 
      key = arr[0].key if arr.length is 1
      callback(null, key)
      
module.exports = (tr, prefix, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null
    
  transactionGetLastKey = @fdb.transactional(getLastKey)
  transactionGetLastKey(tr || @fdb.open(), prefix, callback)