const assert = require('assert');
const mocha = require('mocha');

const streamify = require('stream-array');
const JSONStream = require('JSONStream');

const index = require('../index.js');

describe('filterMapReduceStream', function() {
  const data = [
    { a: 'b', c: 10 },
    { a: 'c', c: 20 },
    { a: 'e', c: 0 },
    { a: 'f', c: -9 }
  ];

  describe('synchronous', function() {
    it('should return [30] with this array of objects', function(done) {
      const f = datum => datum.c >= 10;
      const m = datum => datum.c;
      const r = (acc, datum) => acc + datum;

      const strm = index.filterMapReduceStream(streamify(data), f, m, r, 0);

      strm.on('err', err => done(err));

      strm.on('data', datum => {
        assert.equal(datum, [30]);
        done();
      });
    });
  });

  describe('async - callback', function() {
    it('should return [30] with this array of objects', function(done) {
      const f = (datum, cb) => {
        setTimeout(() => cb(null, datum.c >= 10), 0);
      };

      const m = (datum, cb) => {
        setTimeout(() => cb(null, datum.c), 0);
      };

      const r = (acc, datum, cb) => {
        setTimeout(() => cb(null, acc + datum), 0);
      };

      const strm = index.filterMapReduceStream(streamify(data), f, m, r, 0, true);

      strm.on('err', err => done(err));

      strm.on('data', datum => {
        assert.equal(datum, [30]);
        done();
      });
    });
  });

  describe('async - promise', function() {
    it('should return [30] with this array of objects', function(done) {
      const f = datum => new Promise(resolve => resolve(datum.c >= 10));
      const m = datum => new Promise(resolve => resolve(datum.c));
      const r = (acc, datum) => new Promise(resolve => resolve(acc + datum));

      const strm = index.filterMapReduceStream(streamify(data), f, m, r, 0, true);

      strm.on('err', err => done(err));

      strm.on('data', datum => {
        assert.equal(datum, [30]);
        done();
      });
    });
  });

});
