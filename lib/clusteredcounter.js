(function() {
  var ClusteredCounter, ClusteredTask,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ClusteredTask = require('./clusteredtask');

  ClusteredCounter = (function(_super) {
    __extends(ClusteredCounter, _super);

    function ClusteredCounter() {
      return ClusteredCounter.__super__.constructor.apply(this, arguments);
    }

    ClusteredCounter.prototype.onWorkerBoundariesReceived = function(begin, end) {
      ({
        options: {
          begin: begin,
          end: end
        }
      });
      return this.fdbutil.countKeys(options, complete);
    };

    return ClusteredCounter;

  })(ClusteredTask);

}).call(this);
