(function() {
  var AbstractAdapter;

  module.exports = AbstractAdapter = (function() {
    function AbstractAdapter(valueOrBuffer, pos) {
      this.pos = pos != null ? pos : 0;
      this.data = null;
      if (Buffer.isBuffer(valueOrBuffer)) {
        this.value = this.getValue(valueOrBuffer);
      } else {
        this.loadData(valueOrBuffer);
      }
    }

    AbstractAdapter.prototype.initData = function(size) {
      return this.data = new Buffer(this.pos + size);
    };

    AbstractAdapter.prototype.verifyData = function() {
      if (this.data === null) {
        throw new Error('Data property not initialized');
      }
    };

    AbstractAdapter.prototype.loadData = function() {
      return this.initData(this.pos);
    };

    AbstractAdapter.prototype.writeString = function(value) {
      this.verifyData();
      this.data.write(value, this.pos, value.length, 'utf8');
      this.pos += value.length;
    };

    AbstractAdapter.prototype.writeDoubleBE = function(value) {
      this.verifyData();
      this.data.writeDoubleBE(value, this.pos);
      this.pos += 8;
    };

    AbstractAdapter.prototype.writeInt32BE = function(value) {
      this.verifyData();
      this.data.writeInt32BE(value, this.pos);
      this.pos += 4;
    };

    AbstractAdapter.prototype.writeInt32LE = function(value) {
      this.verifyData();
      this.data.writeInt32LE(value, this.pos);
      this.pos += 4;
    };

    AbstractAdapter.prototype.writeUInt8 = function(value) {
      this.verifyData();
      this.data.writeUInt8(value, this.pos);
      this.pos += 1;
    };

    AbstractAdapter.prototype.writeUInt32LE = function(value) {
      this.verifyData();
      this.data.writeUInt32LE(value, this.pos);
      this.pos += 4;
    };

    AbstractAdapter.prototype.copyFrom = function(source) {
      this.verifyData();
      source.copy(this.data, this.pos);
      this.pos += source.length;
    };

    return AbstractAdapter;

  })();

}).call(this);
