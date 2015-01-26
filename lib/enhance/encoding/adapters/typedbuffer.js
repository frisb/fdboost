(function() {
  var TypedBuffer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = TypedBuffer = (function(_super) {
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

}).call(this);
