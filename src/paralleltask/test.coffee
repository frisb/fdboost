Formalize = require('formalize')('foundationdb')

Formalize 'star', (provider) ->
  Star = provider.ActiveRecord('stars')
  
  subspace = provider.dir.records
    
  options = 
    fdb: provider.fdb
    subspace: subspace
    begin: subspace.pack([])
    end: subspace.pack(['\xff'])
    processes: 5
  
  complete = (err, count) ->
    console.log(err, count)
  
  CounterTask = require('./counter')
  counter = new CounterTask('./counter', options)
  counter.run(complete)
  
  counter.on 'completed', (val) ->
    console.log('emit', val)