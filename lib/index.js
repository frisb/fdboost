(function() {
  var FDBoost;

  FDBoost = (function() {
    function FDBoost(fdb) {
      this.__fdb = null;
      this.__db = null;
      this.init(fdb);
      this.encoding = require('./encoding')(this);
      this.range = require('./range')(this);
    }

    FDBoost.prototype.init = function(fdb) {
      if (fdb) {
        return this.__fdb = fdb;
      }
    };

    FDBoost.prototype.Debug = require('./debug');

    Object.defineProperties(FDBoost.prototype, {
      fdb: {
        get: function() {
          if (!this.__fdb) {
            this.__fdb = require('fdb').apiVersion(200);
          }
          return this.__fdb;
        }
      },
      db: {
        get: function() {
          if (!this.__db) {
            this.__db = this.fdb.open();
          }
          return this.__db;
        }
      }
    });

    return FDBoost;

  })();

  module.exports = function(fdb) {
    return new FDBoost(fdb);
  };

}).call(this);
