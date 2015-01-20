(function() {
  var AbstractAdapter, Double, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Double = (function(_super) {
    __extends(Double, _super);

    function Double() {
      return Double.__super__.constructor.apply(this, arguments);
    }

    return Double;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var DoubleAdapter;
    return DoubleAdapter = (function(_super) {
      __extends(DoubleAdapter, _super);

      function DoubleAdapter() {
        return DoubleAdapter.__super__.constructor.apply(this, arguments);
      }

      DoubleAdapter.prototype.getType = function() {
        return Double;
      };

      DoubleAdapter.prototype.loadData = function(value) {
        this.initData(8);
        this.writeDoubleBE(value);
      };

      DoubleAdapter.prototype.getValue = function(buffer) {
        return buffer.readDoubleBE(this.pos);
      };

      return DoubleAdapter;

    })(AbstractAdapter);
  };

}).call(this);
