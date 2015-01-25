###
Copyright (c) 2012 FoundationDB, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
###

AbstractAdapter = require('./abstract')
TypedBuffer = require('../typedbuffer')

class Integer extends TypedBuffer

sizeLimits = new GLOBAL.Array(8)

setupSizeLimits = ->
  sizeLimits[0] = 1

  for i in [1...sizeLimits.length]
    sizeLimits[i] = sizeLimits[i-1] * 256
    sizeLimits[i - 1] -= 1

  sizeLimits[7] -= 1

setupSizeLimits()

maxInt = Math.pow(2, 53) - 1
minInt = -Math.pow(2, 53)

decodeNumber = (buf, offset, bytes) ->
	negative = bytes < 0
	bytes = Math.abs(bytes)

	num = 0
	mult = 1

	for i in [bytes-1..0] by -1
		b = buf[offset+i];
		b = -(~b & 0xff) if negative

		odd = b & 0x01 if i is bytes-1

		num += b * mult
		mult *= 0x100

	throw new Error('Cannot decode signed integers larger than 54 bits') if num > maxInt || num < minInt || (num is minInt && odd)

	num

module.exports = (encoding) ->
	class IntegerAdapter extends AbstractAdapter     
		getType: -> 
			Integer
	 
		loadData: (value) ->
			negative = value < 0
			posItem = Math.abs(value)

			length = 0

			for length in [length...sizeLimits.length]
				if posItem <= sizeLimits[length]
					break

			throw new Error('Cannot encode signed integer larger than 54 bits') if value > maxInt || value < minInt

			prefix = if negative then 20-length else 20+length

			@initData(length+1)
			@data[@pos] = prefix

			for byteIdx in [length-1..0] by -1
				b = posItem & 0xff
				@data[byteIdx+1+@pos] = if negative then ~b else b
				posItem = (posItem - b) / 0x100

			# @initData(4)
			# @writeInt32BE(value)

			return
	    
		getValue: (buffer) -> 
			code = buffer[@pos]

			if (Math.abs(code-20) <= 7)
				value = if code is 20 then 0 else decodeNumber(buffer, @pos+1, code-20)
			else if (Math.abs(code-20) <= 8)
				throw new Error('Cannot decode signed integers larger than 54 bits')

			value

			# buffer.readInt32BE(@pos)