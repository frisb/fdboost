(function() {
  var surreal, unpackArray;

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

  unpackArray = function(deepak, val) {
    var arr;
    arr = deepak.tuple.unpack(val);
    return deepak.unpackArray(arr);
  };

  module.exports = function(val) {
    var type;
    if (!val) {
      return null;
    }
    if (val === '\xff') {
      return val;
    }
    type = val.slice(0, 1).readUInt8(0);
    val = val.slice(1);
    switch (type) {
      case 0:
        break;
      case 1:
        return val.toString('ascii');
      case 2:
        return parseInt(val.toString('ascii'));
      case 3:
        return parseFloat(val.toString('ascii'), 10);
      case 4:
        return val.readUInt8(0) === 1;
      case 5:
        return null;
      case 6:
        return new Date(parseInt(val.toString('ascii'), 10));
      case 7:
        return unpackArray(this, val);
      case 8:
        return surreal.deserialize(val.toString('ascii'));
      default:
        throw new Error("the type (" + type + ") of the passed val is unknown");
    }
  };

}).call(this);
