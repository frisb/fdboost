assert = require('assert')
FDBoost = require('../lib/index')()

testType = (prefix, typeName, value) ->
  describe typeName, ->
    it 'should return ' + typeName, ->
      encoded = FDBoost.encoding.encode(value, prefix)
      decoded = FDBoost.encoding.decode(encoded, prefix)

      console.log('\tprefix', prefix) if prefix
      console.log('\tencoded', encoded)
      console.log('\tdecoded', decoded)
      console.log()

      assert.deepEqual(value, decoded)

testAll = (prefix) ->
  ->
    name = 'Encoding'
    name = "Prefixed #{name}" if prefix

    describe name, ->
      testType(prefix, 'null', null)
      testType(prefix, 'undefined')
      testType(prefix, 'string', 'string')
      testType(prefix, 'integer', 100)
      testType(prefix, 'double', 100.12345)
      testType(prefix, 'boolean true', true)
      testType(prefix, 'boolean false', false)
      testType(prefix, 'date', new Date())
      testType(prefix, 'mixed array', [{  }, 'string', 1, [1.23]])
      testType(prefix, 'object', { x: 1, y: 2 })

describe 'Encode and Decode', testAll()
describe 'Encode and Decode with Prefix', testAll('my_prefix')
  

    