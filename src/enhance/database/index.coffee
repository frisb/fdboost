module.exports = (fdboost) ->
	fdb = fdboost.fdb

	enhancements = 
    getLastKey: require('./getlastkey')(fdboost)
    countKeys: require('./countKeys')(fdboost)

  enhanceDatabase = (Database) ->
    e = (fnName, fn) ->
      len = fn.length

      Database::[fnName] = ->
        args = new Array(len)
        args[i] = arguments['' + i] for i in [0...len - 1]
        cb = arguments['' + (len - 1)]

        @doTransaction (tr, innerCb) ->
          args[len - 1] = innerCb
          tr[fnName].apply(tr, args)
          return
        , cb

    e(fnName, fn) for fnName, fn of enhancements

    createTransaction = Database::createTransaction
    Database::createTransaction = ->
      tr = createTransaction.call(@)
      enhanceTransaction(tr.constructor) unless tr.boosted
      tr

    Database::boosted = true
    return

  enhanceTransaction = (Transaction) ->
    Transaction::[fnName] = fn for fnName, fn of enhancements
    Transaction::boosted = true
    return

  open = fdb.open
  fdb.open = (clusterFile, dbName) ->
    db = open.call(fdb, clusterFile, dbName)
    enhanceDatabase(db.constructor) unless db.boosted
    db