(function() {
  var AbstractAdapter, TypedBuffer, Undefined,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Undefined = (function(_super) {
    __extends(Undefined, _super);

    function Undefined() {
      return Undefined.__super__.constructor.apply(this, arguments);
    }

    return Undefined;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var UndefinedAdapter;
    return UndefinedAdapter = (function(_super) {
      __extends(UndefinedAdapter, _super);

      function UndefinedAdapter() {
        return UndefinedAdapter.__super__.constructor.apply(this, arguments);
      }

      UndefinedAdapter.prototype.getType = function() {
        return Undefined;
      };

      UndefinedAdapter.prototype.getValue = function() {
        return void 0;
      };

      return UndefinedAdapter;

    })(AbstractAdapter);
  };

}).call(this);
