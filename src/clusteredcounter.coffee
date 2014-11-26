ClusteredTask = require('./clusteredtask')

class ClusteredCounter extends ClusteredTask
  onWorkerBoundariesReceived: (begin, end) ->
    options: 
      begin: begin
      end: end
      
    @fdbutil.countKeys(options, complete)