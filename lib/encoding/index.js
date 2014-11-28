(function() {
  var EncodingNamespace;

  EncodingNamespace = (function() {
    function EncodingNamespace(FDBoost) {
      this.FDBoost = FDBoost;
      this.typeCodes = {
        'undefined': new Buffer('00', 'hex'),
        'string': new Buffer('01', 'hex'),
        'integer': new Buffer('02', 'hex'),
        'double': new Buffer('03', 'hex'),
        'boolean': new Buffer('04', 'hex'),
        'null': new Buffer('05', 'hex'),
        'date': new Buffer('06', 'hex'),
        'array': new Buffer('07', 'hex'),
        'object': new Buffer('08', 'hex')
      };
    }

    EncodingNamespace.prototype.encode = require('./encode');

    EncodingNamespace.prototype.decode = require('./decode');

    return EncodingNamespace;

  })();

  module.exports = function(FDBoost) {
    return new EncodingNamespace(FDBoost);
  };

}).call(this);
