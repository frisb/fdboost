EncodingNamespace = 

module.exports = (fdboost) ->
	fdb = fdboost.fdb

	if (!fdb.boosted)
		require('./encoding')(fdboost)
		require('./rangereader')(fdboost)
		require('./database')(fdboost)
		require('./tuple')(fdboost)

		fdb.boosted = true
		

	return