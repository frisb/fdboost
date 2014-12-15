{EventEmitter} = require('events')

module.exports = (FDBoost) ->
  class Transformer extends EventEmitter
    constructor: (query) ->
      super()
      
      query.on 'data', (data) =>
        process.nextTick =>
          data = [data] if data not instanceof Array
          
          @parse(kv) for kv in data
          @out(callback)
        
    
  class ObjectTransformer extends Transformer
    constructor: (query, @subspace) ->
      super(query)
      
      @assembled = []
      @currentObject = null
      @key = null
        
      query.on 'end', (result) =>
        if (@assembled.length > 0)
          @emit('data', @assembled)
        else if (@currentObject isnt null)
          @currentObject.reset(true)
          @emit('data', [@currentObject])
      
        @emit('end')
        
    out: (callback) ->
      if (@assembled.length > 0)
        callback(null, @assembled)
        @assembled = []    
    
     
    parse: (kv) ->
      @key = @subspace.unpack(kv.key)
      @currentObject = if @indexKey then @indexed() else @nonIndexed(kv.value)
      @currentObject.keySize += kv.key.length
      @currentObject.valueSize += kv.value.length
      
    nonIndexed: (value) ->
      obj = null
      id = @key[0]
      partitioned = @key.length <= 2
      
      if (!partitioned)
        obj = new @ActiveRecord(id) 
        map = new Array(@key.length - 1)
        values = fdb.tuple.unpack(value)
        
        for i in [1...@key.length]
          dest = @key[i]
          obj.data(dest, values[i - 1]) 
        
        obj.reset(true)
        @assembled.push(obj)
      else
        dest = @key[1]
        
        if (@currentObject isnt null)
          obj = @currentObject
    
          if (@currentObject.id isnt id)
            @currentObject.reset(true)
            @assembled.push(obj)
    
            # create new ActiveRecord instance
            obj = new @ActiveRecord(id)
        else
          # create new ActiveRecord instance
          obj = new @ActiveRecord(id)
          
        obj.data(dest, value) if (dest)
        
      obj
      