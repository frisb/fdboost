(function() {
  var Debug, EncodingNamespace;

  EncodingNamespace = Debug = require('../debug');

  module.exports = function(fdb) {
    if (!fdb.boosted) {
      require('./encoding')(fdb);
      require('./rangereader')(fdb, Debug('RangeReader', 'cyan'));
      require('./database')(fdb, Debug('Database', 'yellow'));
      require('./tuple')(fdb);
      fdb.boosted = true;
    }
  };

}).call(this);
