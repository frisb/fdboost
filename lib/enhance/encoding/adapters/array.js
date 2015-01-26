(function() {
  var AbstractAdapter, Array, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Array = (function(_super) {
    __extends(Array, _super);

    function Array() {
      return Array.__super__.constructor.apply(this, arguments);
    }

    return Array;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var ArrayAdapter;
    return ArrayAdapter = (function(_super) {
      __extends(ArrayAdapter, _super);

      function ArrayAdapter() {
        return ArrayAdapter.__super__.constructor.apply(this, arguments);
      }

      ArrayAdapter.prototype.getType = function() {
        return Array;
      };

      ArrayAdapter.prototype.loadData = function(value) {
        var d, item;
        d = encoding.fdb.tuple.pack((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            _results.push(encoding.encode(item));
          }
          return _results;
        })());
        this.initData(d.length);
        this.copyFrom(d);
      };

      ArrayAdapter.prototype.getValue = function(buffer) {
        var d, item, _i, _len, _ref, _results;
        d = new Buffer(buffer.length - this.pos);
        buffer.copy(d, 0, this.pos);
        _ref = encoding.fdb.tuple.unpack(d);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(encoding.decode(item));
        }
        return _results;
      };

      return ArrayAdapter;

    })(AbstractAdapter);
  };

}).call(this);
