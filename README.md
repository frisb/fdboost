# fdboost 
[![Build Status](https://travis-ci.org/frisb/fdboost.png)](http://travis-ci.org/frisb/fdboost)
[![Dependency Status](https://gemnasium.com/frisb/fdboost.svg)](https://gemnasium.com/frisb/fdboost)
[![Code Climate](https://codeclimate.com/github/frisb/fdboost/badges/gpa.svg)](https://codeclimate.com/github/frisb/fdboost)
[![npm version](https://badge.fury.io/js/fdboost.svg)](http://badge.fury.io/js/fdboost)

fdboost is a collection of utilities for FoundationDB enhancing the functionality of the FoundationDB node.js bindings.

Includes utilities for encoding tuples with strongly typed values and a high performance range key counting method (thanks to Christophe Chevalier @Doxsense).

This module is evolving speedily and further documentation and tests will be included over the coming days. All contributions are welcome.

## API activation

fdboost has 3 alternative methods of activation, each of which returns a fuctionality enhanced version of a typical `fdb` module.

Simple
```js
var fdb = require('fdboost')();
```

Version
```js
var fdb = require('fdboost')(300);

// or

var fdb = require('fdboost').apiVersion(300);
```

Injected
```js
var fdb = require('fdb').apiVersion(300);
require('fdboost').use(fdb);
```

**Throws** an error if an `fdb` module is not passed to the `use()` function.

## Enhancements

API activation surgically grafts a collection of new functions and namespaces onto carefully targetted facets of the `fdb` module prototype chain.

## RangeReader objects

A RangeReader object provides an elegant method of reading data using the node.js `EventEmitter` as an alternative to the `LazyIterator` model.

_class_ fdb.**RangeReader(**_options_**)**

* `options.begin` (`Buffer|fdb.KeySelector`) First key in the reader range.
* `[options.end=undefined]` (`Buffer|fdb.KeySelector`)  Last key in the reader range.
* `[options.limit=undefined]` (`number`)  Only the first limit keys (and their values) in the range will be returned.
* `[options.reverse=undefined]` (`boolean`)  Specified if the keys in the range will be returned in reverse order
* `[options.streamingMode=undefined]` (`iterator|want_all|small|medium|large|serial|exact`)  fdb.streamingMode property that permits the API client to customize performance tradeoff by providing extra information about how the iterator will be used.
* `[options.nonTransactional=false]` (`boolean`)  Reset transaction on expiry and start.
* `[options.snapshot=false]` (`boolean`)  Defines whether range reads should be snapshot reads.

fdb.RangeReader.**execute(**_[tr]_, iteratorType**)**

* `[tr=null]` (`object`) Transaction.
* `iteratorType` (`string`) Value can be `batch`, `each` or `array`.
 
#### Events

`data`

`continue`

`error`

`end`





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

Copyright (c) frisB.com &lt;play@frisb.com&gt;, Copyright (c) FoundationDB, LLC

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
