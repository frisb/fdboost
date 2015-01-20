(function() {
  var AbstractAdapter, Boolean, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Boolean = (function(_super) {
    __extends(Boolean, _super);

    function Boolean() {
      return Boolean.__super__.constructor.apply(this, arguments);
    }

    return Boolean;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var BooleanAdapter;
    return BooleanAdapter = (function(_super) {
      __extends(BooleanAdapter, _super);

      function BooleanAdapter() {
        return BooleanAdapter.__super__.constructor.apply(this, arguments);
      }

      BooleanAdapter.prototype.getType = function() {
        return Boolean;
      };

      BooleanAdapter.prototype.loadData = function(value) {
        this.initData(1);
        this.writeUInt8(value ? 1 : 0);
      };

      BooleanAdapter.prototype.getValue = function(buffer) {
        return buffer.readUInt8(this.pos) === 1;
      };

      return BooleanAdapter;

    })(AbstractAdapter);
  };

}).call(this);
