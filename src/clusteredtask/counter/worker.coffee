ClusteredTask = require('../worker')

module.exports = class ClusteredCounterWorker extends ClusteredTaskWorker
  onWorkerBoundariesReceived: (begin, end) ->
    options: 
      begin: begin
      end: end
      
    @fdbutil.countKeys(options, complete)