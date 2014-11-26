
/**
 * Creates a new Global variable instance
 * @class
 * @param {object} fdb FoundationDB api.
 * @property {object} fdb FoundationDB api.
 * @property {object} db Database instance.
 * @return {Global} a Global variable instance.
 */

(function() {
  var Global, instance;

  Global = (function() {
    function Global() {}

    Global.prototype.init = function(fdb) {
      this.fdb = fdb;
      if (this.fdb == null) {
        this.fdb = require('fdb').apiVersion(200);
      }
      return this.db = this.fdb.open();
    };

    return Global;

  })();

  instance = new Global();

  module.exports = instance;

}).call(this);
