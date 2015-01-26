(function() {
  var Debug;

  Debug = (function() {
    function Debug(category) {
      this.d = require('debug')(category);
    }

    Debug.prototype.execute = function(callback) {
      var writer;
      writer = this.d;
      return callback(this.d);
    };

    return Debug;

  })();

  module.exports = function(category) {
    var instance;
    instance = new Debug(category);
    return function(callback) {
      return instance.execute(callback);
    };
  };

}).call(this);
