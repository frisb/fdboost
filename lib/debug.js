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
    function Debug(category, isActive) {
      this.category = category;
      this.isActive = isActive;
      this.buf = null;
    }

    Debug.prototype.buffer = function(description, data, transformer, scope) {
      if (this.isActive) {
        if (this.buf === null) {
          this.buf = Object.create(null);
        }
        if (transformer) {
          data = transformer.call(scope || this, data);
        }
        return this.buf[description] = data;
      }
    };

    Debug.prototype.log = function(text) {
      var metadata, writeln;
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

  module.exports = function(category) {
    return new Debug(category, process.env.NODE_ENV !== 'production');
  };

}).call(this);
