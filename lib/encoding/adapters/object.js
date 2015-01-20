(function() {
  var AbstractAdapter, Object, TypedBuffer, surreal,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  surreal = require('surreal');

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Object = (function(_super) {
    __extends(Object, _super);

    function Object() {
      return Object.__super__.constructor.apply(this, arguments);
    }

    return Object;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var ObjectAdapter;
    return ObjectAdapter = (function(_super) {
      __extends(ObjectAdapter, _super);

      function ObjectAdapter() {
        return ObjectAdapter.__super__.constructor.apply(this, arguments);
      }

      ObjectAdapter.prototype.getType = function() {
        return Object;
      };

      ObjectAdapter.prototype.loadData = function(value) {
        var json;
        json = surreal.serialize(value);
        this.initData(json.length);
        this.writeString(json);
      };

      ObjectAdapter.prototype.getValue = function(buffer) {
        return surreal.deserialize(buffer.toString('utf8', this.pos));
      };

      return ObjectAdapter;

    })(AbstractAdapter);
  };

}).call(this);
