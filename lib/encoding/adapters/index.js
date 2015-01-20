
/**
 * Get an Adapter factory object to provide an adaptor for typeCode
 * @method
 * @param {EncodingNamespace} encoding EncodingNamespace instance.
 * @return {object} Adapter factory
 */

(function() {
  module.exports = function(encoding) {
    return {
      types: require('../typecodes'),
      Undefined: require('./undefined')(encoding),
      String: require('./string')(encoding),
      Integer: require('./integer')(encoding),
      Double: require('./double')(encoding),
      Boolean: require('./boolean')(encoding),
      Null: require('./null')(encoding),
      DateTime: require('./datetime')(encoding),
      Array: require('./array')(encoding),
      Object: require('./object')(encoding),
      Function: require('./function')(encoding),

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
