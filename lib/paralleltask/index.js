(function() {
  var factory;

  factory = function(module, options) {
    var TaskExtension, task;
    TaskExtension = require(module);
    task = new TaskExtension(options);
    return task;
  };

}).call(this);
