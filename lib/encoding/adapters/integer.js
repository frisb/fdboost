
/*
Copyright (c) 2012 FoundationDB, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

(function() {
  var AbstractAdapter, Integer, TypedBuffer, decodeNumber, maxInt, minInt, setupSizeLimits, sizeLimits,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractAdapter = require('./abstract');

  TypedBuffer = require('../typedbuffer');

  Integer = (function(_super) {
    __extends(Integer, _super);

    function Integer() {
      return Integer.__super__.constructor.apply(this, arguments);
    }

    return Integer;

  })(TypedBuffer);

  sizeLimits = new GLOBAL.Array(8);

  setupSizeLimits = function() {
    var i, _i, _ref;
    sizeLimits[0] = 1;
    for (i = _i = 1, _ref = sizeLimits.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      sizeLimits[i] = sizeLimits[i - 1] * 256;
      sizeLimits[i - 1] -= 1;
    }
    return sizeLimits[7] -= 1;
  };

  setupSizeLimits();

  maxInt = Math.pow(2, 53) - 1;

  minInt = -Math.pow(2, 53);

  decodeNumber = function(buf, offset, bytes) {
    var b, i, mult, negative, num, odd, _i, _ref;
    negative = bytes < 0;
    bytes = Math.abs(bytes);
    num = 0;
    mult = 1;
    for (i = _i = _ref = bytes - 1; _i >= 0; i = _i += -1) {
      b = buf[offset + i];
      if (negative) {
        b = -(~b & 0xff);
      }
      if (i === bytes - 1) {
        odd = b & 0x01;
      }
      num += b * mult;
      mult *= 0x100;
    }
    if (num > maxInt || num < minInt || (num === minInt && odd)) {
      throw new Error('Cannot decode signed integers larger than 54 bits');
    }
    return num;
  };

  module.exports = function(encoding) {
    var IntegerAdapter;
    return IntegerAdapter = (function(_super) {
      __extends(IntegerAdapter, _super);

      function IntegerAdapter() {
        return IntegerAdapter.__super__.constructor.apply(this, arguments);
      }

      IntegerAdapter.prototype.getType = function() {
        return Integer;
      };

      IntegerAdapter.prototype.loadData = function(value) {
        var b, byteIdx, length, negative, posItem, prefix, _i, _j, _ref, _ref1;
        negative = value < 0;
        posItem = Math.abs(value);
        length = 0;
        for (length = _i = length, _ref = sizeLimits.length; length <= _ref ? _i < _ref : _i > _ref; length = length <= _ref ? ++_i : --_i) {
          if (posItem <= sizeLimits[length]) {
            break;
          }
        }
        if (value > maxInt || value < minInt) {
          throw new Error('Cannot encode signed integer larger than 54 bits');
        }
        prefix = negative ? 20 - length : 20 + length;
        this.initData(length + 1);
        this.data[this.pos] = prefix;
        for (byteIdx = _j = _ref1 = length - 1; _j >= 0; byteIdx = _j += -1) {
          b = posItem & 0xff;
          this.data[byteIdx + 1 + this.pos] = negative ? ~b : b;
          posItem = (posItem - b) / 0x100;
        }
      };

      IntegerAdapter.prototype.getValue = function(buffer) {
        var code, value;
        code = buffer[this.pos];
        if (Math.abs(code - 20) <= 7) {
          value = code === 20 ? 0 : decodeNumber(buffer, this.pos + 1, code - 20);
        } else if (Math.abs(code - 20) <= 8) {
          throw new Error('Cannot decode signed integers larger than 54 bits');
        }
        return value;
      };

      return IntegerAdapter;

    })(AbstractAdapter);
  };

}).call(this);
