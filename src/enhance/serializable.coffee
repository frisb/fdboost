module.exports = (fdboost) ->
	fdb = fdboost.fdb

	fdb.serializable = (serialize, deserialize) ->
		set = (tr, arr, callback) ->
			len = arr.length
			ret = new Array(len)

			s = (i, kv) ->
				process.nextTick ->
					kv = [kv.key, kv.value] unless kv instanceof Array

					try
						serialize kv[0], kv[1], (k, v) ->
							tr.set(k, v)
							ret[i] = [k, v]
							callback(null, ret) if i is len - 1
					catch e
						callback()

			for kv, i in arr
				try
					s(i, kv)
				catch e
					callback(e)

		transactionalGet = fdb.transactional(get)
		transactionalSet = fdb.transactional(set)

		class Serializer
		  get: (tr, arr, callback) ->
				if (tr instanceof Array)
					arr = tr
					tr = fdb.open()

				throw new Error('KeyValue array cannot be undefined or empty') unless arr && arr.length > 0

		    fdb.future.create (futureCb) =>
		      transactionalGet(tr, arr, futureCb)
		    , callback

			set: (tr, arr, callback) ->
				if (tr instanceof Array)
					arr = tr
					tr = fdb.open()

				throw new Error('KeyValue array cannot be undefined or empty') unless arr && arr.length > 0

		    fdb.future.create (futureCb) =>
		      transactionalSet(tr, arr, futureCb)
		    , callback

		new Serializer()
					
					
						
						
		