(function() {
  var AbstractAdapter, Array, Boolean, DateTime, Double, EPOCH_DATE, Function, Integer, Null, Object, String, TypedBuffer, Undefined, surreal,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  surreal = require('surreal');

  AbstractAdapter = require('./abstract');

  EPOCH_DATE = new Date(1900, 0, 1);

  TypedBuffer = (function(_super) {
    __extends(TypedBuffer, _super);

    function TypedBuffer() {
      return TypedBuffer.__super__.constructor.apply(this, arguments);
    }

    TypedBuffer.prototype.toBuffer = function() {
      var buffer;
      buffer = new Buffer(this.length - 1);
      this.copy(buffer, 0, 1);
      return buffer;
    };

    return TypedBuffer;

  })(Buffer);

  Undefined = (function(_super) {
    __extends(Undefined, _super);

    function Undefined() {
      return Undefined.__super__.constructor.apply(this, arguments);
    }

    return Undefined;

  })(TypedBuffer);

  String = (function(_super) {
    __extends(String, _super);

    function String() {
      return String.__super__.constructor.apply(this, arguments);
    }

    return String;

  })(TypedBuffer);

  Integer = (function(_super) {
    __extends(Integer, _super);

    function Integer() {
      return Integer.__super__.constructor.apply(this, arguments);
    }

    return Integer;

  })(TypedBuffer);

  Double = (function(_super) {
    __extends(Double, _super);

    function Double() {
      return Double.__super__.constructor.apply(this, arguments);
    }

    return Double;

  })(TypedBuffer);

  Boolean = (function(_super) {
    __extends(Boolean, _super);

    function Boolean() {
      return Boolean.__super__.constructor.apply(this, arguments);
    }

    return Boolean;

  })(TypedBuffer);

  Null = (function(_super) {
    __extends(Null, _super);

    function Null() {
      return Null.__super__.constructor.apply(this, arguments);
    }

    return Null;

  })(TypedBuffer);

  DateTime = (function(_super) {
    __extends(DateTime, _super);

    function DateTime() {
      return DateTime.__super__.constructor.apply(this, arguments);
    }

    return DateTime;

  })(TypedBuffer);

  Array = (function(_super) {
    __extends(Array, _super);

    function Array() {
      return Array.__super__.constructor.apply(this, arguments);
    }

    return Array;

  })(TypedBuffer);

  Object = (function(_super) {
    __extends(Object, _super);

    function Object() {
      return Object.__super__.constructor.apply(this, arguments);
    }

    return Object;

  })(TypedBuffer);

  Function = (function(_super) {
    __extends(Function, _super);

    function Function() {
      return Function.__super__.constructor.apply(this, arguments);
    }

    return Function;

  })(TypedBuffer);


  /**
   * Get an Adapter factory object to provide an adaptor for typeCode
   * @method
   * @param {EncodingNamespace} encoding EncodingNamespace instance.
   * @return {object} Adapter factory
   */

  module.exports = function(encoding) {
    var ArrayAdapter, BooleanAdapter, DateTimeAdapter, DoubleAdapter, FunctionAdapter, IntegerAdapter, NullAdapter, ObjectAdapter, StringAdapter, UndefinedAdapter;
    return {
      types: require('./typecodes'),
      Undefined: UndefinedAdapter = (function(_super) {
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

      })(AbstractAdapter),
      String: StringAdapter = (function(_super) {
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

      })(AbstractAdapter),
      Integer: IntegerAdapter = (function(_super) {
        __extends(IntegerAdapter, _super);

        function IntegerAdapter() {
          return IntegerAdapter.__super__.constructor.apply(this, arguments);
        }

        IntegerAdapter.prototype.getType = function() {
          return Integer;
        };

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

      })(AbstractAdapter),
      Boolean: BooleanAdapter = (function(_super) {
        __extends(BooleanAdapter, _super);

        function BooleanAdapter() {
          return BooleanAdapter.__super__.constructor.apply(this, arguments);
        }

        BooleanAdapter.prototype.getType = function() {
          return String;
        };

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

        NullAdapter.prototype.getType = function() {
          return Null;
        };

        NullAdapter.prototype.getValue = function() {
          return null;
        };

        return NullAdapter;

      })(AbstractAdapter),
      DateTime: DateTimeAdapter = (function(_super) {
        __extends(DateTimeAdapter, _super);

        function DateTimeAdapter() {
          return DateTimeAdapter.__super__.constructor.apply(this, arguments);
        }

        DateTimeAdapter.prototype.getType = function() {
          return DateTime;
        };

        DateTimeAdapter.prototype.loadData = function(value) {
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

        DateTimeAdapter.prototype.getValue = function(buffer) {
          var date, days, milliseconds;
          days = buffer.readInt32LE(this.pos);
          milliseconds = buffer.readUInt32LE(this.pos + 4);
          date = new Date(1900, 0, 1);
          date.setDate(date.getDate() + days);
          date.setMilliseconds(date.getMilliseconds() + milliseconds);
          return date;
        };

        return DateTimeAdapter;

      })(AbstractAdapter),
      Array: ArrayAdapter = (function(_super) {
        __extends(ArrayAdapter, _super);

        function ArrayAdapter() {
          return ArrayAdapter.__super__.constructor.apply(this, arguments);
        }

        ArrayAdapter.prototype.getType = function() {
          return Array;
        };

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

      })(AbstractAdapter),
      Function: FunctionAdapter = (function(_super) {
        __extends(FunctionAdapter, _super);

        function FunctionAdapter() {
          return FunctionAdapter.__super__.constructor.apply(this, arguments);
        }

        FunctionAdapter.prototype.getType = function() {
          return Function;
        };

        return FunctionAdapter;

      })(ObjectAdapter),

      /**
       * Get an Adapter for typeCode
       * @method
       * @param {integer} typeCode Type code.
       * @return {AbstractAdapter} AbstractAdapter extension
       */
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
          case this.types.datetime:
            return this.DateTime;
          case this.types.array:
            return this.Array;
          case this.types.object:
            return this.Object;
          case this.types["function"]:
            return this.Function;
          default:
            throw new Error("Unknown typeCode \"" + typeCode + "\".");
        }
      }
    };
  };

}).call(this);
