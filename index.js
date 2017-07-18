const { Transform } = require('stream');

const FILTERED = Symbol.for('filterMapReduceStream/filtered');

module.exports = function filterMapReduceStream(stream, filterFunc, mapFunc, reduceFunc, accumulator) {
  const filterTransformer = new Transformer('filter', filterFunc);
  const mapTransformer = new Transformer('map', mapFunc);
  const reduceTransformer = new Transformer('reduce', reduceFunc, accumulator);

  return stream.pipe(filterTransformer).pipe(mapTransformer).pipe(reduceTransformer);
}

class Transformer extends Transform {
  constructor(type, func, accumulator) {
    // initialize the Transform stream into object mode
    super({ objectMode: true });

    this.type = type;
    this.accumulator = accumulator;
    this.func = func;
  }

  _transform(chunk, encoding, cb) {
    if (this.type === 'map') {
      let out;
      if (chunk === FILTERED) {
        out = chunk;
      }
      else {
        out = this.func(chunk);
      }
      this.push(out);
      cb();
    }
    else if (this.type === 'filter') {
      const out = this.func(chunk);
      if (out) {
        this.push(chunk);
      }
      else {
        this.push(FILTERED);
      }
      cb();
    }
    else if (this.type === 'reduce') {
      if (chunk !== FILTERED) {
        this.accumulator = this.func(this.accumulator, chunk);
      }
      cb();
    }
  }

  _flush(cb) {
    if (this.type === 'reduce') {
      this.push(this.accumulator);
    }
    cb();
  }
}
