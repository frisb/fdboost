(function() {
  var packBuffer, packNumber, packObject, packString, surreal;

  surreal = require('surreal');


  /* Modelled on https://github.com/leaflevellabs/node-foundationdblayers/blob/master/lib/utils.js
  
  Copyright (c) 2013 Alex Gadea, All rights reserved.
  
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
  THE SOFTWARE
   */

  packBuffer = function(typeCode, buf) {
    var len, packedVal;
    len = 1;
    if (buf) {
      len += buf.length;
    }
    packedVal = new Buffer(len);
    packedVal.writeUInt8(typeCode, 0);
    if (buf) {
      buf.copy(packedVal, 1);
    }
    return packedVal;
  };

  packString = function(val) {
    return new Buffer(val, 'ascii');
  };

  packNumber = function(deepak, val) {
    if (val % 1 === 0) {
      return packBuffer(2, new Buffer('' + val, 'ascii'));
    } else {
      return packBuffer(3, new Buffer('' + val, 'ascii'));
    }
  };

  packObject = function(deepak, val) {
    var buf;
    if (val === null) {
      return packBuffer(5);
    } else if (val instanceof Date) {
      return packBuffer(6, new Buffer('' + val.getTime(), 'ascii'));
    } else if (val instanceof Array) {
      buf = deepak.tuple.pack(deepak.packArray(val));
      return packBuffer(7, buf);
    } else if (val instanceof Object) {
      return packBuffer(8, packString(surreal.serialize(val)));
    } else {
      throw new Error("the packValue function only accepts string, number, boolean, date, array and object");
    }
  };

  module.exports = function(val) {
    var buf;
    if (val === '\xff') {
      return val;
    }
    switch (typeof val) {
      case 'undefined':
        return packBuffer(0);
      case 'string':
        return packBuffer(1, packString(val));
      case 'number':
        return packNumber(this, val);
      case 'boolean':
        buf = new Buffer(1);
        buf.writeUInt8((val ? 1 : 0), 0);
        return packBuffer(4, buf);
      default:
        return packObject(this, val);
    }
  };

}).call(this);
