module.exports = class TypedBuffer extends Buffer
  toBuffer: ->
    buffer = new Buffer(@length - 1)
    @copy(buffer, 0, 1)
    buffer