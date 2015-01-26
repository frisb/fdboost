(function() {
  var AbstractAdapter, DateTime, EPOCH_DATE, TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  EPOCH_DATE = new Date(1900, 0, 1);

  DateTime = (function(_super) {
    __extends(DateTime, _super);

    function DateTime() {
      return DateTime.__super__.constructor.apply(this, arguments);
    }

    return DateTime;

  })(TypedBuffer);

  module.exports = function(encoding) {
    var DateTimeAdapter;
    return DateTimeAdapter = (function(_super) {
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

    })(AbstractAdapter);
  };

}).call(this);
