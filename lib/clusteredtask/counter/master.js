(function() {
  var ClusteredCounterMaster, ClusteredTask,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ClusteredTask = require('../master');

  module.exports = ClusteredCounterMaster = (function(_super) {
    __extends(ClusteredCounterMaster, _super);

    function ClusteredCounterMaster() {
      return ClusteredCounterMaster.__super__.constructor.apply(this, arguments);
    }

    return ClusteredCounterMaster;

  })(ClusteredTaskMaster);

}).call(this);
