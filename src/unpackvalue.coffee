surreal = require('surreal')

### Modelled on https://github.com/leaflevellabs/node-foundationdblayers/blob/master/lib/utils.js

Copyright (c) 2013 Alex Gadea, All rights reserved.

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
THE SOFTWARE
###

unpackArray = (deepak, val) ->
  arr = deepak.tuple.unpack(val)
  deepak.unpackArray(arr)

module.exports = (val) ->
  return null if !val
  return val if val is '\xff'

  type = val.slice(0, 1).readUInt8(0)
  val = val.slice(1)

  switch type
    when 0 then return                            # undefined
    when 1 then val.toString('ascii')             # string
    when 2 then parseInt(val.toString('ascii'))   # integer
    when 3 then parseFloat(val.toString('ascii'), 10) # decimal
    when 4 then val.readUInt8(0) is 1                          # boolean
    when 5 then null                              # null
    when 6 then new Date(parseInt(val.toString('ascii'), 10))             # date
    when 7 then unpackArray(@, val)                  # array
    when 8 then surreal.deserialize(val.toString('ascii')) # object

    else
      throw new Error("the type (#{type}) of the passed val is unknown")
