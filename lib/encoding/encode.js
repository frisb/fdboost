
/**
 * Encode value to buffer
 * @method
 * @param {(undefined|string|integer|double|boolean|null|date|array|object)} value Value to encode.
 * @param {string} prefix Optional prefix identifier.
 * @return {Buffer} Buffer
 */

(function() {
  module.exports = function(value, prefix) {
    if (value === '\xff') {
      return value;
    }
    switch (typeof value) {
      case 'undefined':
        return new this.buffers.Undefined(prefix).write();
      case 'string':
        return new this.buffers.String(prefix, value).write();
      case 'number':
        if (value % 1 === 0) {
          return new this.buffers.Integer(prefix, value).write();
        } else {
          return new this.buffers.Double(prefix, value).write();
        }
        break;
      case 'boolean':
        return new this.buffers.Boolean(prefix, value).write();
      default:
        if (value === null) {
          return new this.buffers.Null(prefix).write();
        } else if (value instanceof Date) {
          return new this.buffers.Date(prefix, value).write();
        } else if (value instanceof Array) {
          return new this.buffers.Array(prefix, value).write();
        } else if (value instanceof Object) {
          return new this.buffers.Object(prefix, value).write();
        } else {
          throw new Error("the encode function accepts only string, number, boolean, date, array and object");
        }
    }
  };

}).call(this);
