{EventEmitter} = require('events')

###*
 * Get a Query class to perform a range read operation over the database 
 * @method
 * @param {object} FDBBoost FDBBoost instance.
 * @return {Query} Query
###      
module.exports = (FDBoost) ->
  fdb = FDBoost.fdb
  debug = FDBoost.Debug('FDBoost.range.Query')
  
  ###*
   * The callback format for the getLastKey method
   * @callback getLastKeyCallback
   * @param {Error} error An error instance representing the error during the execution.
   * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
  ###
  
  ###*
   * Get the last key of the range if no end key is provided to the RangeQuery 
   * @method
   * @param {object} tr Transaction.
   * @param {object} query RangeQuery instance.
   * @param {getLastKeyCallback} callback Callback.
   * @return {undefined}
  ###      
  getLastKey = (tr, query, callback) ->
    if (query.end)
      debug.buffer('end', 'utf8', Buffer.prototype.toString, query.end.key)
      callback(null, query.end)
    else
      FDBoost.range.getLastKey(tr, query.begin, callback)
      
    return
  
  ###*
   * The callback format for the getIterator method
   * @callback getIteratorCallback
   * @param {Error} error An error instance representing the error during the execution.
   * @param {LazyIterator} iterator The LazyIterator instance if the getIterator method was successful.
  ###
  
  ###*
   * Get a LazyIterator instance for the current range read operation 
   * @method
   * @param {object} tr Transaction.
   * @param {object} query RangeQuery instance.
   * @param {getIteratorCallback} callback Callback.
   * @return {undefined}
  ###      
  getIterator = (tr, query, callback) ->
    options = 
      limit: query.limit
      reverse: query.reverse
      streamingMode: query.streamingMode
    
    ts = if query.snapshot then tr.snapshot else tr
      
    if (query.end || query.marker)
      begin = if query.marker then fdb.KeySelector.firstGreaterThan(query.marker) else query.begin
      
      getLastKey tr, query, (err, lastKey) ->
        if (err)
          callback(err)
        else
          debug.log('getLastKey')
          
          iterator = ts.getRange(begin, lastKey, options)
          
          debug.buffer('method', 'getRange')
          debug.buffer('begin', 'utf8', Buffer.prototype.toString, begin.key)
          debug.buffer('end', 'utf8', Buffer.prototype.toString, lastKey.key)
          debug.buffer('options', options)
          
          callback(null, iterator)
          
        return
    else
      iterator = ts.getRangeStartsWith(query.begin, options)
      
      debug.buffer('method', 'getRangeStartsWith')
      debug.buffer('prefix', 'utf8', Buffer.prototype.toString, query.begin)
      debug.buffer('options', options)
      
      callback(null, iterator)
      
    return
  
  ###*
   * The callback format for the iterate method
   * @callback iterateCallback
   * @param {Error} error An error instance representing the error during the execution.
   * @param {Result} result A Result value on completion of the iteration.
  ###
    
  ###*
   * Iterate over the range results 
   * @method
   * @param {object} tr Transaction.
   * @param {object} query RangeQuery instance.
   * @param {string} iteratorType batch|each|array.
   * @param {iterateCallback} callback Callback.
   * @fires RangeQuery#data
   * @return {undefined}
  ###      
  iterate = (tr, query, iteratorType, callback) ->
    getIterator tr, query, (err, iterator) ->
      debug.log('getIterator')
      
      debug.buffer('iteratorType', iteratorType)
      debug.log('iterate')
      
      switch iteratorType
        
        when 'array'
          iterator.toArray (err, arr) ->
            query.emit('data', arr)
            callback(err)
            return
        
        when 'batch'
          func = (arr, next) ->
            query.emit('data', arr)
            next()
            return
           
          iterator.forEachBatch(func, callback)
          
        when 'each'
          func = (kv, next) ->
            query.emit('data', kv)
            next()
            return
           
          iterator.forEach(func, callback)
          
      return
      
    return
          
  transactionalIterate = fdb.transactional(iterate)
  
  class Query extends EventEmitter
    ###*
     * Creates a new RangeQuery instance
     * @class
     * @param {object} options Settings.
     * @param {(Buffer|fdb.KeySelector)} [options.begin] First key in the query range.
     * @param {(Buffer|fdb.KeySelector)}} [options.end=undefined] Last key in the query range.
     * @param {number} [options.limit=undefined] Only the first limit keys (and their values) in the range will be returned.
     * @param {boolean} [options.reverse=undefined] Specified if the keys in the range will be returned in reverse order
     * @param {(iterator|want_all|small|medium|large|serial|exact)} [options.streamingMode=undefined] fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
     * @param {boolean} [options.nonTransactional=false] Reset transaction on expiry and start.
     * @param {boolean} [options.snapshot=false] Defines whether range reads should be snapshot reads.
     * @property {array} instances Collection of Document Layer db instances.
     * @property {number} index Current index of the instances collection.
     * @property {(Buffer|fdb.KeySelector)}} begin First key in the query range.
     * @property {(Buffer|fdb.KeySelector)}} end Last key in the query range.
     * @property {Buffer} marker Marker key for transaction expiration continuation point.
     * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
     * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
     * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
     * @property {boolean} nonTransactional Reset transaction on expiry and start.
     * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
     * @return {RangeQuery} a RangeQuery instance.
    ###
    constructor: (options) ->
      super()
      @begin = options.begin
      @end = options.end
      @marker = null
      @limit = options.limit
      @reverse = options.reverse
      @streamingMode = options.streamingMode
      @nonTransactional = options.nonTransactional || false
      @snapshot = options.snapshot || false
      
      debug.buffer('begin', 'utf8', Buffer.prototype.toString, options.begin.key)
      debug.buffer('end', 'utf8', Buffer.prototype.toString, options.end.key)
      debug.buffer('limit', options.limit)
      debug.buffer('reverse', options.reverse)
      debug.buffer('streamingMode', options.streamingMode)
      debug.buffer('nonTransactional', options.nonTransactional)
      debug.buffer('snapshot', options.snapshot)
      
      @on 'data', (data) =>
        if (data instanceof Array)
          @marker = kv.key for kv in data
        else 
          @marker = data.key
          
        return
    
    ###*
     * Execute the query using an iterator type 
     * @method
     * @param {object} tr Optional transaction.
     * @param {string} iteratorType batch|each|array.
     * @fires RangeQuery#error
     * @fires RangeQuery#continue
     * @fires RangeQuery#end
     * @return {undefined}
    ###      
    execute: (tr, iteratorType) ->
      if (typeof(tr) is 'function')
        callback = tr
        tr = null
      
      debug.log('execute')
        
      complete = (err, res) =>
        if (err)
          @emit('error', err)
        else
          @emit('end', res)
        return
      
      toBeContinued = =>
        debug.log('continue')
        tr.reset()
        @emit('continue')
        txi()
        return
        
      pastVersionCatchingCallback = (err, res) =>
        if (err && @nonTransactional && err.message is 'past_version')
          toBeContinued()
        else
          complete(err, res)
          
        return
        
      txi = =>
        transactionalIterate(tr || FDBoost.db, @, iteratorType, pastVersionCatchingCallback)
        return
        
      txi()
      
      return