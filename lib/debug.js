(function() {
  var Debug, chalk, debug, debugs, jsonShrink, surreal;

  chalk = require('chalk');

  surreal = require('surreal');

  debug = require('debug');

  debugs = {};

  jsonShrink = function(s) {
    if (typeof s !== 'string') {
      s = surreal.serialize(s, 2);
    }
    if (s[0] === '{' && s[s.length - 1] === '}') {
      s = s.substr(1, s.length - 2);
    }
    return s;
  };

  Debug = (function() {
    function Debug(category, color) {
      this.category = category;
      this.color = color;
      this.buf = null;
    }

    Debug.prototype.buffer = function(description, data) {
      if (this.isActive && description) {
        if (this.buf === null) {
          this.buf = Object.create(null);
        }
        this.buf[description] = data || '';
      }
    };

    Debug.prototype.log = function(text, description, data) {
      var d, metadata;
      if (description) {
        this.buffer(description, data);
      }
      d = debugs[this.category];
      if (!d) {
        d = debug(this.category);
        debugs[this.category] = d;
      }
      if (this.buf !== null) {
        metadata = chalk.dim(jsonShrink(this.buf));
        this.buf = null;
      }
      return d(text, metadata);
    };

    return Debug;

  })();

  module.exports = function(category, color) {
    var instance;
    instance = new Debug(category, color);
    return function(callback) {
      return callback(instance);
    };
  };

}).call(this);
