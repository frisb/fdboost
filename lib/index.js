(function() {
  var FDBoost, enhance, instance, latestVersion;

  enhance = require('./enhance');

  latestVersion = 300;

  instance = null;

  FDBoost = (function() {
    function FDBoost() {}

    FDBoost.prototype.fdb = null;

    FDBoost.prototype.Debug = require('./debug');

    FDBoost.prototype.boost = function() {
      enhance(this.fdb);
      return this.fdb;
    };

    Object.defineProperty(FDBoost.prototype, 'factory', {
      get: function() {
        var factory;
        factory = function(version) {
          return factory.apiVersion(version);
        };
        factory.apiVersion = (function(_this) {
          return function(version) {
            if (version == null) {
              version = latestVersion;
            }
            if (_this.fdb === null) {
              _this.fdb = require('fdb').apiVersion(version);
            }
            return _this.boost();
          };
        })(this);
        factory.use = function(fdb) {
          if (!this.fdb) {
            throw new Error('Must provide fdbModule instance');
          }
          return this.boost();
        };
        return factory;
      }
    });

    return FDBoost;

  })();

  if (instance === null) {
    instance = new FDBoost();
  }

  module.exports = instance.factory;

}).call(this);
