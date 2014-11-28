(function() {
  module.exports = function(FDBoost) {
    var RangeNamespace;
    RangeNamespace = (function() {
      function RangeNamespace() {
        this.BoundariesTask = require('./boundariestask')(FDBoost);
        this.Query = require('./query')(FDBoost);
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
