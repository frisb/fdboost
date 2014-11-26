factory = (module, options) ->
  TaskExtension = require(module)
  
  task = new TaskExtension(options)
  
  return task