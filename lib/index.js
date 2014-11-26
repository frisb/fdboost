(function() {
  var FDBoost;

  FDBoost = (function() {
    function FDBoost(fdb) {
      this.__fdb = null;
      this.__db = null;
      this.init(fdb);
    }

    FDBoost.prototype.init = function(fdb) {
      if (fdb) {
        return this.__fdb = fdb;
      }
    };

    FDBoost.prototype.Debug = require('./debug');

    FDBoost.prototype.getLastKey = require('./getlastkey');

    FDBoost.prototype.RangeQuery = require('./rangequery');

    FDBoost.prototype.__getBoundariesTaskPrototype = require('./boundariestask');

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
      },
      BoundariesTask: {
        get: function() {
          return this.__getBoundariesTaskPrototype();
        }
      }
    });

    return FDBoost;

  })();

  module.exports = function(fdb) {
    return new FDBoost(fdb);
  };

}).call(this);
