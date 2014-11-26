(function() {
  module.exports = {
    foundationdb: {
      debug: true,
      force: true,
      partition: false,
      star: {
        stars: {
          partition: false,
          schema: {
            A: 'a',
            B: 'b',
            BZero: 'b0',
            carrier: 'c',
            error: 'e',
            gateway: 'g',
            sequence: 's',
            timestamp: 't',
            unknown: 'u'
          },
          indexes: {},
          counters: {}
        }
      }
    }
  };

}).call(this);
