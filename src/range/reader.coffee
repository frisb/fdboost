{EventEmitter} = require('events')

resolveKey = (k) ->
  if (k)
    if (k.key)
      return if typeof(k.key) is 'function' then k.key() else k.key
    else if k.rawPrefix
      return k.rawPrefix
    else  
      return k
  return

###*
 * Get a Reader class to perform a range read operation over the database 
 * @method
 * @param {object} FDBBoost FDBBoost instance.
 * @return {Reader} Reader
###      
module.exports = (FDBoost) ->
  fdb = FDBoost.fdb
  debug = FDBoost.Debug('FDBoost.range.Reader')
  
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
   * @param {object} reader RangeReader instance.
   * @param {string} iteratorType batch|each|array.
   * @param {iterateCallback} callback Callback.
   * @fires RangeReader#data
   * @return {undefined}
  ###      
  iterate = (tr, reader, iteratorType, callback) ->
    debug.buffer('iteratorType', iteratorType)
    
    getIteratorCallback = (err, iterator) ->
      if (err)
        callback(err)
      else
        debug.log('iterate')
        
        switch iteratorType
          when 'array' then reader.toArray(iterator, callback)
          when 'batch' then reader.forEachBatch(iterator, callback)
          when 'each' then reader.forEach(iterator, callback)
            
      return
      
    reader.getIterator(tr, getIteratorCallback)
      
    return
          
  transactionalIterate = fdb.transactional(iterate)
  
  class Reader extends EventEmitter
    ###*
     * Creates a new Reader instance
     * @class
     * @param {object} options Settings.
     * @param {(Buffer|fdb.KeySelector)} [options.begin] First key in the reader range.
     * @param {(Buffer|fdb.KeySelector)}} [options.end=undefined] Last key in the reader range.
     * @param {number} [options.limit=undefined] Only the first limit keys (and their values) in the range will be returned.
     * @param {boolean} [options.reverse=undefined] Specified if the keys in the range will be returned in reverse order
     * @param {(iterator|want_all|small|medium|large|serial|exact)} [options.streamingMode=undefined] fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
     * @param {boolean} [options.nonTransactional=false] Reset transaction on expiry and start.
     * @param {boolean} [options.snapshot=false] Defines whether range reads should be snapshot reads.
     * @property {array} instances Collection of Document Layer db instances.
     * @property {number} index Current index of the instances collection.
     * @property {(Buffer|fdb.KeySelector)}} begin First key in the reader range.
     * @property {(Buffer|fdb.KeySelector)}} end Last key in the reader range.
     * @property {Buffer} marker Marker key for transaction expiration continuation point.
     * @property {number} limit Only the first limit keys (and their values) in the range will be returned.
     * @property {boolean} reverse Specified if the keys in the range will be returned in reverse order
     * @property {(iterator|want_all|small|medium|large|serial|exact)} streamingMode fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
     * @property {boolean} nonTransactional Reset transaction on expiry and start.
     * @property {boolean} snapshot Defines whether range reads should be snapshot reads.
     * @return {Reader} a Reader instance.
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
      
      debug.buffer('begin', 'utf8', Buffer.prototype.toString, resolveKey(options.begin))
      debug.buffer('end', 'utf8', Buffer.prototype.toString, resolveKey(options.end))
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
     * The callback format for the getLastKey method
     * @callback getLastKeyCallback
     * @param {Error} error An error instance representing the error during the execution.
     * @param {Buffer} lastKey The Buffer value if the getLastKey method was successful.
    ###
    
    ###*
     * Get the last key of the range if no end key is provided to the RangeReader 
     * @method
     * @param {object} tr Transaction.
     * @param {object} reader RangeReader instance.
     * @param {getLastKeyCallback} callback Callback.
     * @return {undefined}
    ###      
    getLastKey: (tr, callback) ->
      if (@end)
        debug.buffer('end', 'utf8', Buffer.prototype.toString, @end.key)
        callback(null, @end)
      else
        FDBoost.range.getLastKey(tr, @begin, callback)
        
      return
    
    ###*
     * The callback format for the init method
     * @callback initCallback
     * @param {Error} error An error instance representing the error during the execution.
    ###
    
    ###*
     * Initialize the reader before iteration
     * @abstract
     * @param {object} tr Transaction.
     * @param {object} reader RangeReader instance.
     * @param {initCallback} callback Callback.
     * @return {undefined}
    ###      
    init: (tr, callback) ->
      callback(null)
      
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
     * @param {object} reader RangeReader instance.
     * @param {getIteratorCallback} callback Callback.
     * @return {undefined}
    ###      
    getIterator: (tr, callback) ->
      debug.log('getIterator')
      
      options = 
        limit: @limit
        reverse: @reverse
        streamingMode: @streamingMode
      
      ts = if @snapshot then tr.snapshot else tr
        
      if (@end || @marker)
        begin = if @marker then fdb.KeySelector.firstGreaterThan(@marker) else @begin
        
        @getLastKey tr, (err, lastKey) ->
          if (err)
            callback(err)
          else
            debug.log('getLastKey')
            
            iterator = ts.getRange(begin, lastKey, options)
            
            debug.buffer('method', 'getRange')
            debug.buffer('begin', 'utf8', Buffer.prototype.toString, resolveKey(begin))
            debug.buffer('end', 'utf8', Buffer.prototype.toString, resolveKey(lastKey))
            debug.buffer('options', options)
            
            callback(null, iterator)
            
          return
      else
        iterator = ts.getRangeStartsWith(@begin, options)
        
        debug.buffer('method', 'getRangeStartsWith')
        debug.buffer('prefix', 'utf8', Buffer.prototype.toString, resolveKey(@begin))
        debug.buffer('options', options)
        
        callback(null, iterator)
        
      return
    
    ###*
     * Iterate over array results 
     * @virtual
     * @param {LazyIterator} iterator LazyIterator instance.
     * @param {iterateCallback} callback Callback.
     * @fires RangeReader#data
     * @return {undefined}
    ###     
    toArray: (iterator, callback) ->
      iterator.toArray (err, arr) =>
        @emit('data', arr)
        callback(err)
        return
      return
    
    ###*
     * Iterate over batch results 
     * @virtual
     * @param {LazyIterator} iterator LazyIterator instance.
     * @param {iterateCallback} callback Callback.
     * @fires RangeReader#data
     * @return {undefined}
    ###         
    forEachBatch: (iterator, callback) ->
      func = (arr, next) =>
        @emit('data', arr)
        next()
        return
       
      iterator.forEachBatch(func, callback)
      return
    
    ###*
     * Iterate over key-value pair results 
     * @virtual
     * @param {LazyIterator} iterator LazyIterator instance.
     * @param {iterateCallback} callback Callback.
     * @fires RangeReader#data
     * @return {undefined}
    ###     
    forEach: (iterator, callback) ->
      func = (kv, next) =>
        @emit('data', kv)
        next()
        return
       
      iterator.forEach(func, callback)
      return
    
    ###*
     * Execute the reader using an iterator type 
     * @virtual
     * @param {object} [tr=null] transaction.
     * @param {string} iteratorType batch|each|array.
     * @fires RangeReader#error
     * @fires RangeReader#continue
     * @fires RangeReader#end
     * @return {undefined}
    ###      
    execute: (tr, iteratorType) ->
      if (typeof(tr) is 'string')
        iteratorType = tr
        tr = null
      
      debug.log('execute')
        
      complete = (err, result) =>
        if (err)
          @emit('error', err)
        else
          @emit('end', result)
        return
      
      toBeContinued = =>
        debug.log('continue')
        tr.reset()
        @emit('continue')
        txi()
        return
        
      pastVersionCatchingCallback = (err, result) =>
        if (err && @nonTransactional && err.message is 'past_version')
          toBeContinued()
        else
          complete(err, result)
          
        return
        
      txi = =>
        transactionalIterate(tr || FDBoost.db, @, iteratorType, pastVersionCatchingCallback)
        return
        
      txi()
      
      return