(function() {
  var AbstractAdapter, EPOCH_DATE, surreal,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  surreal = require('surreal');

  AbstractAdapter = require('./abstract');

  EPOCH_DATE = new Date(1900, 0, 1);

  module.exports = function(encoding) {
    var ArrayAdapter, BooleanAdapter, DateAdapter, DoubleAdapter, IntegerAdapter, NullAdapter, ObjectAdapter, StringAdapter, UndefinedAdapter;
    return {
      types: require('./typecodes'),
      Undefined: UndefinedAdapter = (function(_super) {
        __extends(UndefinedAdapter, _super);

        function UndefinedAdapter() {
          return UndefinedAdapter.__super__.constructor.apply(this, arguments);
        }

        UndefinedAdapter.prototype.getValue = function() {
          return void 0;
        };

        return UndefinedAdapter;

      })(AbstractAdapter),
      String: StringAdapter = (function(_super) {
        __extends(StringAdapter, _super);

        function StringAdapter() {
          return StringAdapter.__super__.constructor.apply(this, arguments);
        }

        StringAdapter.prototype.loadData = function(value) {
          this.initData(value.length);
          this.writeString(value);
        };

        StringAdapter.prototype.getValue = function(buffer) {
          return buffer.toString('utf8', this.pos);
        };

        return StringAdapter;

      })(AbstractAdapter),
      Integer: IntegerAdapter = (function(_super) {
        __extends(IntegerAdapter, _super);

        function IntegerAdapter() {
          return IntegerAdapter.__super__.constructor.apply(this, arguments);
        }

        IntegerAdapter.prototype.loadData = function(value) {
          this.initData(4);
          this.writeInt32BE(value);
        };

        IntegerAdapter.prototype.getValue = function(buffer) {
          return buffer.readInt32BE(this.pos);
        };

        return IntegerAdapter;

      })(AbstractAdapter),
      Double: DoubleAdapter = (function(_super) {
        __extends(DoubleAdapter, _super);

        function DoubleAdapter() {
          return DoubleAdapter.__super__.constructor.apply(this, arguments);
        }

        DoubleAdapter.prototype.loadData = function(value) {
          this.initData(8);
          this.writeDoubleBE(value);
        };

        DoubleAdapter.prototype.getValue = function(buffer) {
          return buffer.readDoubleBE(this.pos);
        };

        return DoubleAdapter;

      })(AbstractAdapter),
      Boolean: BooleanAdapter = (function(_super) {
        __extends(BooleanAdapter, _super);

        function BooleanAdapter() {
          return BooleanAdapter.__super__.constructor.apply(this, arguments);
        }

        BooleanAdapter.prototype.loadData = function(value) {
          this.initData(1);
          this.writeUInt8(value ? 1 : 0);
        };

        BooleanAdapter.prototype.getValue = function(buffer) {
          return buffer.readUInt8(this.pos) === 1;
        };

        return BooleanAdapter;

      })(AbstractAdapter),
      Null: NullAdapter = (function(_super) {
        __extends(NullAdapter, _super);

        function NullAdapter() {
          return NullAdapter.__super__.constructor.apply(this, arguments);
        }

        NullAdapter.prototype.getValue = function() {
          return null;
        };

        return NullAdapter;

      })(AbstractAdapter),
      Date: DateAdapter = (function(_super) {
        __extends(DateAdapter, _super);

        function DateAdapter() {
          return DateAdapter.__super__.constructor.apply(this, arguments);
        }

        DateAdapter.prototype.loadData = function(value) {
          var days, milliseconds, seconds;
          this.initData(8);
          days = ~~((value.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
          seconds = value.getHours() * 60 * 60;
          seconds += value.getMinutes() * 60;
          seconds += value.getSeconds();
          milliseconds = (seconds * 1000) + value.getMilliseconds();
          this.writeInt32LE(days);
          this.writeUInt32LE(milliseconds);
        };

        DateAdapter.prototype.getValue = function(buffer) {
          var date, days, milliseconds;
          days = buffer.readInt32LE(this.pos);
          milliseconds = buffer.readUInt32LE(this.pos + 4);
          date = new Date(1900, 0, 1);
          date.setDate(date.getDate() + days);
          date.setMilliseconds(date.getMilliseconds() + milliseconds);
          return date;
        };

        return DateAdapter;

      })(AbstractAdapter),
      Array: ArrayAdapter = (function(_super) {
        __extends(ArrayAdapter, _super);

        function ArrayAdapter() {
          return ArrayAdapter.__super__.constructor.apply(this, arguments);
        }

        ArrayAdapter.prototype.loadData = function(value) {
          var d, item;
          d = encoding.FDBoost.fdb.tuple.pack((function() {
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
          _ref = encoding.FDBoost.fdb.tuple.unpack(d);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(encoding.decode(item));
          }
          return _results;
        };

        return ArrayAdapter;

      })(AbstractAdapter),
      Object: ObjectAdapter = (function(_super) {
        __extends(ObjectAdapter, _super);

        function ObjectAdapter() {
          return ObjectAdapter.__super__.constructor.apply(this, arguments);
        }

        ObjectAdapter.prototype.loadData = function(value) {
          var json;
          json = surreal.serialize(value);
          this.initData(json.length);
          this.writeString(json);
        };

        ObjectAdapter.prototype.getValue = function(buffer) {
          console.log(this.pos);
          return surreal.deserialize(buffer.toString('utf8', this.pos));
        };

        return ObjectAdapter;

      })(AbstractAdapter),
      get: function(typeCode) {
        switch (typeCode) {
          case this.types.undefined:
            return this.Undefined;
          case this.types.string:
            return this.String;
          case this.types.integer:
            return this.Integer;
          case this.types.double:
            return this.Double;
          case this.types.boolean:
            return this.Boolean;
          case this.types["null"]:
            return this.Null;
          case this.types.date:
            return this.Date;
          case this.types.array:
            return this.Array;
          case this.types.object:
            return this.Object;
          default:
            throw new Error("Unknown typeCode \"" + typeCode + "\".");
        }
      }
    };
  };

}).call(this);
