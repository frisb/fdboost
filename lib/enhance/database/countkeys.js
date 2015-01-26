
/* BSD Licence
Copyright (c) 2013, Doxense SARL
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
	* Redistributions of source code must retain the above copyright
	  notice, this list of conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright
	  notice, this list of conditions and the following disclaimer in the
	  documentation and/or other materials provided with the distribution.
	* Neither the name of Doxense nor the
	  names of its contributors may be used to endorse or promote products
	  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function() {
  module.exports = function(fdb, debug) {
    var count, execute;
    execute = function(tr, options, callback) {
      var begin, end;
      begin = options.begin, end = options.end;
      return getLastKey(tr, begin, end, function() {
        return count;
      });
    };
    count = function(tr, options, callback) {
      var INIT_WINDOW_SIZE, MAX_WINDOW_SIZE, MIN_WINDOW_SIZE, begin, end, getCursorCallback;
      begin = options.begin, end = options.end;
      INIT_WINDOW_SIZE = 1 << 8;
      MAX_WINDOW_SIZE = 1 << 16;
      MIN_WINDOW_SIZE = 64;
      getCursorCallback = function(err, cursor) {
        var advanceCursor, counter, doubleBack, getNextKey, handleError, innerCallback, iteration, last, lastMile, onProgress, retry, stride, windowSize;
        if (err) {
          callback(err);
        } else {
          if (cursor >= end) {
            callback(null, 0);
          } else {
            iteration = 1;
            counter = 1;
            windowSize = INIT_WINDOW_SIZE;
            last = false;
            onProgress = function(cur) {
              debug(function(writer) {
                var progress;
                progress = {
                  cursor: (cur instanceof fdb.KeySelector ? cur.key : cur).toString('utf8'),
                  iteration: iteration,
                  counter: counter,
                  windowSize: windowSize
                };
                return writer.log('countKeys', 'progress', progress);
              });
            };
            innerCallback = function(err, c) {
              if (c === null) {
                stride();
              } else {
                callback(null, c);
              }
            };
            retry = function() {
              tr.options.setReadYourWritesDisable();
              innerCallback(null, null);
            };
            handleError = function(err) {
              if (err.message === 'past_version') {
                tr.reset();
                retry();
              } else {
                tr.onError(err, function(e) {
                  if (e) {
                    innerCallback(e);
                  } else {
                    retry();
                  }
                });
              }
            };
            lastMile = function() {
              var iterator;
              begin = fdb.KeySelector.firstGreaterThan(cursor);
              end = end instanceof fdb.KeySelector ? end : fdb.KeySelector.firstGreaterOrEqual(end);
              options = {
                limit: windowSize - 1,
                streamingMode: fdb.streamingMode.want_all
              };
              iterator = tr.snapshot.getRange(begin, end, options);
              iterator.toArray(function(err, arr) {
                if (err) {
                  innerCallback(err);
                } else {
                  counter += arr.length;
                  onProgress(end);
                  ++iteration;
                  innerCallback(null, counter);
                }
              });
            };
            doubleBack = function() {
              last = true;
              if (windowSize === 1) {
                innerCallback(null, counter);
              } else {
                if (windowSize <= MIN_WINDOW_SIZE) {
                  lastMile();
                } else {
                  windowSize >>= 1;
                  innerCallback(null, null);
                }
              }
            };
            advanceCursor = function(next) {
              counter += windowSize;
              cursor = next;
              onProgress(cursor);
              if (!last) {
                windowSize = Math.min(windowSize << 1, MAX_WINDOW_SIZE);
              }
              innerCallback(null, null);
            };
            getNextKey = function() {
              var selector;
              selector = fdb.KeySelector.firstGreaterOrEqual(cursor).add(windowSize);
              tr.snapshot.getKey(selector, function(err, next) {
                if (err) {
                  handleError(err);
                } else {
                  ++iteration;
                  if (next > end) {
                    doubleBack();
                  } else {
                    advanceCursor(next);
                  }
                }
              });
            };
            stride = function() {
              if (cursor < end) {
                getNextKey();
              }
            };
            stride();
          }
        }
      };
      tr.snapshot.getKey(fdb.KeySelector.firstGreaterOrEqual(begin), getCursorCallback);
    };

    /** Counts keys over a range.
     * @param {object} [tr] Transaction
     * @param {object} options Provider specific configuration options.
     * @param {object} options.begin Begin inclusive key.
     * @param {object} [options.end] End exclusive key.
     * @param {object} [options.debug] Function called to display debug info.
     * @param {Function} callback Function called on completion.
     */
    return function(options, callback) {
      if (!options) {
        throw new Error('options cannot be undefined');
      }
      return fdb.future.create((function(_this) {
        return function(futureCb) {
          return count(_this, options, futureCb);
        };
      })(this), callback);
    };
  };

}).call(this);
