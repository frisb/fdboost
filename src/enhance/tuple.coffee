module.exports = (fdboost) ->
	fdb = fdboost.fdb

	enhancements = 
		packEncoded: (arr, prefix) ->
			encodedArr = (fdb.encoding.encode(item, prefix) for item in arr)
			@pack(encodedArr)

		unpackEncoded: (key, prefix) ->
			encodedArr = @unpack(key)
			(fdb.encoding.decode(item, prefix) for item in encodedArr)

	for fnName, fn of enhancements
		fdb.tuple[fnName] = fn
		fdb.Subspace::[fnName] = fn
		fdb.DirectoryLayer::[fnName] = fn