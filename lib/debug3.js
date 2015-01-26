(function() {
  var Debug, Writeln, jsonShrink, surreal, writelns;

  surreal = require('surreal');

  Writeln = require('writeln');

  writelns = {};

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
    function Debug(category, color, isActive) {
      this.category = category;
      this.color = color;
      this.isActive = isActive;
      this.buf = null;
    }

    Debug.prototype.execute = function(callback) {
      var writeln;
      writeln = writelns[this.category];
      if (!writeln) {
        writeln = new Writeln(this.category, this.color);
        writelns[this.category] = writeln;
      }
      return callback(this);
    };

    Debug.prototype.buffer = function(description, data) {
      if (this.isActive && description) {
        if (this.buf === null) {
          this.buf = Object.create(null);
        }
        this.buf[description] = data || '';
      }
    };

    Debug.prototype.log = function(text, description, data) {
      var metadata, writeln;
      if (description) {
        this.buffer(description, data);
      }
      writeln = writelns[this.category];
      if (!writeln) {
        writeln = new Writeln(this.category);
        writelns[this.category] = writeln;
      }
      if (this.buf !== null) {
        metadata = jsonShrink(this.buf);
        this.buf = null;
      }
      return writeln.debug(text, metadata);
    };

    return Debug;

  })();

  module.exports = function(category, color) {
    var instance;
    instance = new Debug(category, color, process.env.NODE_ENV !== 'production');
    return function(callback) {
      return instance.execute(callback);
    };
  };

}).call(this);
