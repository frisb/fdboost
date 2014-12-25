
/**
 * Get a new RangeNamespace instance 
 * @method
 * @param {FDBBoost} FDBBoost FDBBoost instance.
 * @return {RangeNamespace} a RangeNamespace instance
 */

(function() {
  module.exports = function(FDBoost) {
    var RangeNamespace;
    RangeNamespace = (function() {

      /**
       * Creates a new RangeNamespace instance
       * @class
       * @property {BoundariesTask} BoundariesTask BoundariesTask class.
       * @property {Query} Query Query class.
       * @return {RangeNamespace} a RangeNamespace instance.
       */
      function RangeNamespace() {
        this.BoundariesTask = require('./boundariestask')(FDBoost);
        this.Reader = require('./reader')(FDBoost);
      }

      RangeNamespace.prototype.countKeys = require('./countkeys')(FDBoost);


      /**
       * Get the last key of the range based on a keyPrefix
       * @method
       * @param {object} tr Optional Transaction.
       * @param {(Buffer|fdb.KeySelector)} keyPrefix KeySelector or Buffer value.
       * @param {FDBoost~range~getLastKeyCallback} callback Optional Callback.
       * @return {undefined}
       */

      RangeNamespace.prototype.getLastKey = require('./getlastkey')(FDBoost);

      return RangeNamespace;

    })();
    return new RangeNamespace();
  };

}).call(this);
