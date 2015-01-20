# FDBoost 
[![Build Status](https://travis-ci.org/frisb/fdboost.png)](http://travis-ci.org/frisb/fdboost)
[![Dependency Status](https://gemnasium.com/frisb/fdboost.svg)](https://gemnasium.com/frisb/fdboost)
[![Code Climate](https://codeclimate.com/github/frisb/fdboost/badges/gpa.svg)](https://codeclimate.com/github/frisb/fdboost)
[![npm version](https://badge.fury.io/js/fdboost.svg)](http://badge.fury.io/js/fdboost)
[![npm status badge](https://nodei.co/npm/fdboost.png?stars=true&downloads=true)](https://nodei.co/npm/fdboost/)

FDBoost is a collection of utilities for FoundationDB enhancing the functionality of the FoundationDB node.js bindings.

Includes utilities for encoding tuples with strongly typed values and a high performance range key counting method (thanks to Christophe Chevalier @Doxsense).

This module is still early alpha and work is in progress. All contributions are welcome.

## API

#### Timeously(options, callback)

* `options` Object
  * `name` String. Name.
  * `type` PeriodType. The type of interval.
  * `interval` Number Optional. The number of interval periods between each event callback. Defaults to 1.
  * `start` Number Optional. The starting point of the interval, the modulo of the Interval periods and the start must equal 0. Defaults to 1.
* `callback` Function. The callback has argument `(response)`, a Dynect JSON [Response](Response.md)

Returns a Timeously instance.

#### Timeously.PeriodTypes

* `MINUTELY`
* `HOURLY`
* `DAILY`
* `WEEKLY`
* `MONTHLY`

#### instance.start()

Starts the scheduler.

#### instance.stop()

Stops the scheduler.

## Todo

Polish comments 

More elegant debug logging

Debug boundariestask class

## Installation
```
npm install fdboost
```

## License

(The MIT License)

Copyright (c) frisB.com &lt;play@frisb.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![Analytics](https://ga-beacon.appspot.com/UA-40562957-11/fdboost/readme)](https://github.com/igrigorik/ga-beacon)
