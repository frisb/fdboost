(function() {
  var AbstractAdapter, String, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  String = (function(_super) {
    __extends(String, _super);

    function String() {
      return String.__super__.constructor.apply(this, arguments);
    }

    return String;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var StringAdapter;
    return StringAdapter = (function(_super) {
      __extends(StringAdapter, _super);

      function StringAdapter() {
        return StringAdapter.__super__.constructor.apply(this, arguments);
      }

      StringAdapter.prototype.getType = function() {
        return String;
      };

      StringAdapter.prototype.loadData = function(value) {
        this.initData(value.length);
        this.writeString(value);
      };

      StringAdapter.prototype.getValue = function(buffer) {
        return buffer.toString('utf8', this.pos);
      };

      return StringAdapter;

    })(AbstractAdapter);
  };

}).call(this);
