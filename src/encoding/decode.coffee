###*
 * Decode value from buffer
 * @method
 * @param {Buffer} buffer Buffer to decode.
 * @param {string} prefix Optional prefix identifier.
 * @return {(undefined|string|integer|double|boolean|null|date|array|object)} Value
###
module.exports = (buffer, prefix) ->
  return null if !buffer
  
  buf = @buffers.Abstract.createFrom(prefix, buffer)
  buf.read()