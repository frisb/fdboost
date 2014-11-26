(function() {
  var Formalize;

  Formalize = require('formalize')('foundationdb');

  Formalize('star', function(provider) {
    var CounterTask, Star, complete, counter, options, subspace;
    Star = provider.ActiveRecord('stars');
    subspace = provider.dir.records;
    options = {
      fdb: provider.fdb,
      subspace: subspace,
      begin: subspace.pack([]),
      end: subspace.pack(['\xff']),
      processes: 5
    };
    complete = function(err, count) {
      return console.log(err, count);
    };
    CounterTask = require('./counter');
    counter = new CounterTask('./counter', options);
    counter.run(complete);
    return counter.on('completed', function(val) {
      return console.log('emit', val);
    });
  });

}).call(this);
