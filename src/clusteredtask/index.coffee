cluster = require('cluster')
{EventEmitter} = require('events')

module.exports = class ClusteredTask extends EventEmitter
  constructor: (@fdb, tr, options, callback) ->
    @master = {}
    @worker = {}
    
    if (cluster.isMaster)
      console.log('master')
      
      
    else
      console.log('worker')
      @runAsWorker()