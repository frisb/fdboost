(function() {
  var ClusteredTask, EventEmitter, cluster,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  cluster = require('cluster');

  EventEmitter = require('events').EventEmitter;

  module.exports = ClusteredTask = (function(_super) {
    __extends(ClusteredTask, _super);

    function ClusteredTask(fdb, tr, options, callback) {
      this.fdb = fdb;
      this.master = {};
      this.worker = {};
      if (cluster.isMaster) {
        console.log('master');
      } else {
        console.log('worker');
        this.runAsWorker();
      }
    }

    return ClusteredTask;

  })(EventEmitter);

}).call(this);
