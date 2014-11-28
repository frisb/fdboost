(function() {
  var ClusteredCounterWorker, ClusteredTask,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ClusteredTask = require('../worker');

  module.exports = ClusteredCounterWorker = (function(_super) {
    __extends(ClusteredCounterWorker, _super);

    function ClusteredCounterWorker() {
      return ClusteredCounterWorker.__super__.constructor.apply(this, arguments);
    }

    ClusteredCounterWorker.prototype.onWorkerBoundariesReceived = function(begin, end) {
      ({
        options: {
          begin: begin,
          end: end
        }
      });
      return this.fdbutil.countKeys(options, complete);
    };

    return ClusteredCounterWorker;

  })(ClusteredTaskWorker);

}).call(this);