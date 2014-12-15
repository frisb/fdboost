(function() {
  module.exports = {
    'undefined': 0,
    'string': 1,
    'integer': 2,
    'double': 3,
    'boolean': 4,
    'null': 5,
    'date': 6,
    'array': 7,
    'object': 8,
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
            return this.date;
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
