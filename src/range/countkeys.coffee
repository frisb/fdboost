### BSD Licence
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
###

# To count the number of items in the range, we will scan it using a key selector with an offset equal to our window size
# > if the returned key is still inside the range, we add the window size to the counter, and start again from the current key
# > if the returned key is outside the range, we reduce the size of the window, and start again from the previous key
# > if the returned key is exactly equal to the end of range, OR if the window size was 1, then we stop

# Since we don't know in advance if the range contains 1 key or 1 Billion keys, choosing a good value for the window size is critical:
# > if it is too small and the range is very large, we will need too many sequential reads and the network latency will quickly add up
# > if it is too large and the range is small, we will spend too many times halving the window size until we get the correct value

# A few optimizations are possible:
# > we could start with a small window size, and then double its size on every full segment (up to a maximum)
# > for the last segment, we don't need to wait for a getKey to complete before issuing the next, so we could split the segment into 4 (or more), do the getKey() in parallel, detect the quarter that cross the boundary, and iterate again until the size is small
# > once the window size is small enough, we can switch to using getRange to read the last segment in one shot, instead of iterating with window size 16, 8, 4, 2 and 1 (the wost case being 2^N - 1 items remaning)



###* Counts keys over a range.
 * @param {object} tr Optional Transaction
 * @param {object} options Provider specific configuration options.
 * @param {Object} begin Begin inclusive key.
 * @param {Object} end End exclusive key.
 * @param {Object} progress Function called to display progress events.
 * @param {Function} callback Function called on completion.
###

module.exports = (FDBoost) ->
  fdb = FDBoost.fdb
  debug = FDBoost.Debug('FDBoost.range.countKeys')
  
  count = (tr, options, callback) ->
    beginInclusive = options.begin
    endExclusive = options.end
    
    INIT_WINDOW_SIZE = 1 << 8 # start at 256
    MAX_WINDOW_SIZE = 1 << 16 # never use more than 65536
    MIN_WINDOW_SIZE = 64 # use range reads when the windows size is smaller than 64
  
    getCursorCallback = (err, cursor) ->
      if (err)
        callback(err)
      else
        if (cursor >= endExclusive)
          # the range is empty !
        	callback(null, 0)
        else
          # we already have seen one key, so add it to the count
          iter = 1
          counter = 1
          # start with a medium-sized window
          windowSize = INIT_WINDOW_SIZE
          last = false
  
          onProgress = (cur) ->
            c = if cur instanceof fdb.KeySelector then cur.key else cur
            
            debug.buffer('iteration', iter)
            debug.buffer('counter', counter)
            debug.buffer('windowSize', windowSize)
            debug.buffer('cursor', 'utf8', Buffer.prototype.toString, c)
            debug.log('progress')
  
            return
  
          innerCallback = (err, c) ->
            if (c is null)
              stride()
            else
              callback(null, c)
  
            return
  
          retry = ->
            tr.options.setReadYourWritesDisable()
            innerCallback(null, null)
            return
  
          handleError = (err) ->
            if (err.message is 'past_version')
              #console.log(err)
              # the transaction used up its time window
              tr.reset()
              retry()
            else
              # check to see if we can continue...
              tr.onError err, (e) ->
                if (e)
                  innerCallback(e)
                else
                  retry()
  
                return
  
            return
  
          lastMile = ->
            #if TRACE_COUTING
            #console.log("Switch to reading all items (window size = %s)", windowSize)
  
            # Count the keys by reading them. Also, we know that there can not be more than windowSize - 1 remaining
  
            begin = fdb.KeySelector.firstGreaterThan(cursor) # cursor has already been counted once
            end = if endExclusive instanceof fdb.KeySelector then endExclusive else fdb.KeySelector.firstGreaterOrEqual(endExclusive) 
            options =
              limit: windowSize - 1
              streamingMode: fdb.streamingMode.want_all
              
            iterator = tr.snapshot.getRange(begin, end, options)
            iterator.toArray (err, arr) ->
              if (err)
                innerCallback(err)
              else
                counter += arr.length
                onProgress(endExclusive)
                ++iter
                innerCallback(null, counter)
  
              return
  
            return
  
          doubleBack = ->
            # we have reached past the end, switch to binary search
            last = true
  
            # if window size is already 1, then we have counted everything (the range.End key does not exist in the db)
            if (windowSize is 1)
              innerCallback(null, counter)
            else
              if (windowSize <= MIN_WINDOW_SIZE)
                # The window is small enough to switch to reading for counting (will be faster than binary search)
                lastMile()
              else
                #increase window size
                windowSize >>= 1
                innerCallback(null, null)
  
            return
  
          advanceCursor = (next) ->
            counter += windowSize
            cursor = next
            onProgress(cursor)
  
            if (!last)
              # double the size of the window if we are not in the last segment
              windowSize = Math.min(windowSize << 1, MAX_WINDOW_SIZE)
  
            #if TRACE_COUTING
            #console.log("Found %s keys in %s iterations", counter, iter)
            innerCallback(null, null)
            return
  
          getNextKey = ->
            selector = fdb.KeySelector.firstGreaterOrEqual(cursor).add(windowSize)
            tr.snapshot.getKey selector, (err, next) ->
  
              if (err)
                # => from this point, the count returned will not be transactionally accurate
                handleError(err)
              else
                ++iter
  
                # BUGBUG: getKey(...) always truncate the result to \xff if the selected key would be past the end,
                # so we need to fall back immediately to the binary search and/or geRange if next === \xff
  
                if (next > endExclusive)
                  doubleBack()
                else
                  # the range is not finished, advance the cursor
                  advanceCursor(next)
  
              return
  
            return
  
          stride = ->
            getNextKey() if (cursor < endExclusive)
            return
  
          stride()
  
      return
  
    # start looking for the first key in the range
    tr.snapshot.getKey(fdb.KeySelector.firstGreaterOrEqual(beginInclusive), getCursorCallback)
    return
  
  (tr, options, callback) ->
    if (!options)
      options = tr
      tr = null
    else if (typeof(options) is 'function')
      callback = options
      options = tr
      tr = null
      
    transactionalCount = fdb.transactional(count)
    transactionalCount(tr || FDBoost.db, options, callback)
