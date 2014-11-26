{EventEmitter} = require('events')

module.exports = (options) ->
  FDBoost = @
  fdb = FDBoost.fdb
  debug = FDBoost.Debug('RangeQuery')
  
  getLastKey = (tr, query, callback) ->
    if (query.end)
      debug.buffer('end', 'utf8', Buffer.prototype.toString, query.end.key)
      callback(null, query.end)
    else
      debug.buffer('getLastKey for prefix', begin)
      FDBoost.getLastKey(tr, query.begin, callback)
      
    return
  
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
  
  ###*
   * Creates a new RangeQuery instance
   * @class
   * @param {object} [options={}] Optional settings.
   * @property {array} instances Collection of Document Layer db instances.
   * @property {number} index Current index of the instances collection.
   * @property {object} begin First key in the query range.
   * @property {object} end Last key in the query range.
   * @property {object} marker Marker key for transaction expiration continuation point.
   * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
   * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
   * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
   * @property {boolean} nonTransactional Reset transaction on expiry and start.
   * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
   * @fires RangeQuery#data
   * @fires RangeQuery#error
   * @fires RangeQuery#continue
   * @fires RangeQuery#end
   * @return {RangeQuery} a RangeQuery instance.
  ###
  class RangeQuery extends EventEmitter
    constructor: (options) ->
      super()
      @begin = options.begin
      @end = options.end
      @marker = null
      @limit = options.limit
      @reverse = options.reverse
      @streamingMode = options.streamingMode
      @nonTransactional = options.nonTransactional
      @snapshot = options.snapshot
      
      debug.buffer('options', options)
      
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
     * @return {undefined}
    ###      
    execute: (tr, iteratorType) ->
      if (typeof(tr) is 'function')
        callback = tr
        tr = FDBoost.db
      
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
        transactionalIterate(tr, @, iteratorType, pastVersionCatchingCallback)
        return
        
      txi()
      
      return
      
  new RangeQuery(options)