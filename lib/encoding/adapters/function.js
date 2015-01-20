(function() {
  var Function, ObjectAdapter, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ObjectAdapter = require('./object');

  TypedBuffer = require('../typedbuffer');

  Function = (function(_super) {
    __extends(Function, _super);

    function Function() {
      return Function.__super__.constructor.apply(this, arguments);
    }

    return Function;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var FunctionAdapter;
    return FunctionAdapter = (function(_super) {
      __extends(FunctionAdapter, _super);

      function FunctionAdapter() {
        return FunctionAdapter.__super__.constructor.apply(this, arguments);
      }

      FunctionAdapter.prototype.getType = function() {
        return Function;
      };

      return FunctionAdapter;

    })(ObjectAdapter(encoding));
  };

}).call(this);
