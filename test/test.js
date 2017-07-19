const assert = require('assert');
const mocha = require('mocha');

const streamify = require('stream-array');
const JSONStream = require('JSONStream');

const index = require('../index.js');

describe('filterMapReduceStream', function() {
  describe('synchronous', function() {
    it('should return [30] with this array of objects', function() {
      const data = [
        { a: 'b', c: 10 },
        { a: 'c', c: 20 },
        { a: 'e', c: 0 },
        { a: 'f', c: -9 }
      ];

      const f = datum => datum.c >= 10;
      const m = datum => datum.c;
      const r = (acc, datum) => acc + datum;

      const strm = index.filterMapReduceStream(streamify(data), f, m, r, 0).pipe(JSONStream.stringify());

      strm.on('err', err => {
        throw err;
      });
      strm.on('data', datum => {
        assert.equal(datum[0], 30);
      });
    });
  });
});
