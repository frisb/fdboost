assert = require('assert')
fdb = require('fdb').apiVersion(200)
deepak = require('../lib/index')(fdb)

testType = (name, value) ->
  describe name, ->
    it 'should return ' + name, ->
      packed = deepak.packValue(value)
      unpacked = deepak.unpackValue(packed)
      assert.deepEqual(value, unpacked)

describe 'Pack / Unpack', ->
  describe 'Types', ->
    testType('end of DB', '\xff')
    testType('undefined', undefined)
    testType('string', 'string')
    testType('integer', 100)
    testType('decimal', 100.12345)
    testType('boolean', true)
    testType('null', null)
    testType('date', new Date())
    testType('array', [{  }, 'string', 1, [1.23]])
    testType('object', { x: 'y' })
