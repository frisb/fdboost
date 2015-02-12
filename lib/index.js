(function() {
  var Booster, booster, enhance, instance, latestVersion;

  enhance = require('./enhance');

  latestVersion = 300;

  instance = null;

  Booster = (function() {
    function Booster() {}

    Booster.prototype.fdb = null;

    Booster.prototype.Debug = require('./debug');

    Booster.prototype.boost = function(fdb) {
      enhance(fdb);
      return fdb;
    };

    Object.defineProperty(Booster.prototype, 'factory', {
      get: function() {
        var factory;
        factory = function(version) {
          console.log(version);
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
            return _this.boost(_this.fdb);
          };
        })(this);
        factory.use = function(fdb) {
          if (!fdb) {
            throw new Error('Must provide fdbModule instance');
          }
          return this.boost(fdb);
        };
        return factory;
      }
    });

    return Booster;

  })();

  if (instance === null) {
    booster = new Booster();
  }

  module.exports = booster.factory;

}).call(this);
