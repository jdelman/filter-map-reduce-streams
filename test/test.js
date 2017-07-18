const streamz = require('./streamz.js');
const streamify = require('stream-array');
const JSONStream = require('JSONStream');

const data = [
  { a: 'b', c: 10 },
  { a: 'c', c: 20 },
  { a: 'e', c: 0 },
  { a: 'f', c: -9 }
];

const f = datum => datum.c >= 10;
const m = datum => datum.c;
const r = (acc, datum) => acc + datum;

streamz(streamify(data), f, m, r, 0).pipe(JSONStream.stringify()).pipe(process.stdout);

// streamify(data).pipe(JSONStream.stringify()).pipe(process.stdout);
// 