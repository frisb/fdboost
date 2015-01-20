(function() {
  var AbstractAdapter, Null, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Null = (function(_super) {
    __extends(Null, _super);

    function Null() {
      return Null.__super__.constructor.apply(this, arguments);
    }

    return Null;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var NullAdapter;
    return NullAdapter = (function(_super) {
      __extends(NullAdapter, _super);

      function NullAdapter() {
        return NullAdapter.__super__.constructor.apply(this, arguments);
      }

      NullAdapter.prototype.getType = function() {
        return Null;
      };

      NullAdapter.prototype.getValue = function() {
        return null;
      };

      return NullAdapter;

    })(AbstractAdapter);
  };

}).call(this);
