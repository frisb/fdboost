
/**
 * Type codes dictionary.
 * @instance
 * @property {integer} undefined
 * @property {integer} string
 * @property {integer} integer
 * @property {integer} double
 * @property {integer} boolean
 * @property {integer} null
 * @property {integer} date
 * @property {integer} array
 * @property {integer} object
 * @function {Function} get Returns typeCode value for name.
 */

(function() {
  module.exports = {
    'undefined': 0,
    'string': 1,
    'integer': 2,
    'double': 3,
    'boolean': 4,
    'null': 5,
    'datetime': 6,
    'array': 7,
    'object': 8,

    /**
     * Gets type code value for name.
     * @method
     * @param {string} value Value to test type for.
     * @return {integer} Type code value
     */
    'get': function(value) {
      switch (typeof value) {
        case 'undefined':
          return this.undefined;
        case 'string':
          return this.string;
        case 'number':
          if (value % 1 === 0) {
            return this.integer;
          } else {
            return this.double;
          }
          break;
        case 'boolean':
          return this.boolean;
        default:
          if (value === null) {
            return this["null"];
          } else if (value instanceof Date) {
            return this.datetime;
          } else if (value instanceof Array) {
            return this.array;
          } else if (value instanceof Object) {
            return this.object;
          } else {
            throw new Error("the encode function accepts only string, number, boolean, date, array and object");
          }
      }
    }
  };

}).call(this);
