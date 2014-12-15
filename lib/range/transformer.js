(function() {
  var EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = function(FDBoost) {
    var ObjectTransformer, Transformer;
    Transformer = (function(_super) {
      __extends(Transformer, _super);

      function Transformer(query) {
        Transformer.__super__.constructor.call(this);
        query.on('data', (function(_this) {
          return function(data) {
            return process.nextTick(function() {
              var kv, _i, _len;
              if (!(data instanceof Array)) {
                data = [data];
              }
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                kv = data[_i];
                _this.parse(kv);
              }
              return _this.out(callback);
            });
          };
        })(this));
      }

      return Transformer;

    })(EventEmitter);
    return ObjectTransformer = (function(_super) {
      __extends(ObjectTransformer, _super);

      function ObjectTransformer(query, subspace) {
        this.subspace = subspace;
        ObjectTransformer.__super__.constructor.call(this, query);
        this.assembled = [];
        this.currentObject = null;
        this.key = null;
        query.on('end', (function(_this) {
          return function(result) {
            if (_this.assembled.length > 0) {
              _this.emit('data', _this.assembled);
            } else if (_this.currentObject !== null) {
              _this.currentObject.reset(true);
              _this.emit('data', [_this.currentObject]);
            }
            return _this.emit('end');
          };
        })(this));
      }

      ObjectTransformer.prototype.out = function(callback) {
        if (this.assembled.length > 0) {
          callback(null, this.assembled);
          return this.assembled = [];
        }
      };

      ObjectTransformer.prototype.parse = function(kv) {
        this.key = this.subspace.unpack(kv.key);
        this.currentObject = this.indexKey ? this.indexed() : this.nonIndexed(kv.value);
        this.currentObject.keySize += kv.key.length;
        return this.currentObject.valueSize += kv.value.length;
      };

      ObjectTransformer.prototype.nonIndexed = function(value) {
        var dest, i, id, map, obj, partitioned, values, _i, _ref;
        obj = null;
        id = this.key[0];
        partitioned = this.key.length <= 2;
        if (!partitioned) {
          obj = new this.ActiveRecord(id);
          map = new Array(this.key.length - 1);
          values = fdb.tuple.unpack(value);
          for (i = _i = 1, _ref = this.key.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
            dest = this.key[i];
            obj.data(dest, values[i - 1]);
          }
          obj.reset(true);
          this.assembled.push(obj);
        } else {
          dest = this.key[1];
          if (this.currentObject !== null) {
            obj = this.currentObject;
            if (this.currentObject.id !== id) {
              this.currentObject.reset(true);
              this.assembled.push(obj);
              obj = new this.ActiveRecord(id);
            }
          } else {
            obj = new this.ActiveRecord(id);
          }
          if (dest) {
            obj.data(dest, value);
          }
        }
        return obj;
      };

      return ObjectTransformer;

    })(Transformer);
  };

}).call(this);
