require('coffee-script/register')
assert = require('assert')
fdb = require('../src/index')()

testType = (prefix, typeName, value) ->
  it 'should encode and decode ' + typeName, ->
    encoded = fdb.encoding.encode(value, prefix)
    decoded = fdb.encoding.decode(encoded, prefix)

    # console.log('\tprefix', prefix) if prefix
    # console.log('\tencoded', encoded)
    # console.log('\tdecoded', decoded)
    # console.log()

    assert.deepEqual(value, decoded)

testAll = (prefix) ->
  ->
    testType(prefix, 'null', null)
    testType(prefix, 'undefined')
    testType(prefix, 'string', 'string')
    testType(prefix, 'integer', 100)
    testType(prefix, 'double', 100.12345)
    testType(prefix, 'boolean true', true)
    testType(prefix, 'boolean false', false)
    testType(prefix, 'date', new Date())
    testType(prefix, 'mixed array', [{  }, 'string', [1.23]])
    testType(prefix, 'object', { x: 1, y: 2 })

    it 'should encode and decode function', ->
      fn = (param1, param2, param3) ->
        param1 + param2 * param3

      encoded = fdb.encoding.encode(fn, prefix)
      decoded = fdb.encoding.decode(encoded, prefix)

      # console.log('\tprefix', prefix) if prefix
      # console.log('\tencoded', encoded)
      # console.log('\tdecoded', decoded)
      # console.log()

      assert.deepEqual(fn(1, 2, 3), decoded(1, 2, 3))

describe 'fdb.encoding', testAll()
describe 'fdb.encoding (prefixed)', testAll('my_prefix')
  

    