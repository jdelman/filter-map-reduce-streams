const { Transform } = require('stream');

const FILTERED = Symbol.for('filterMapReduceStream/filtered');
const VALID_TYPES = ['map', 'reduce', 'filter'];

class Transformer extends Transform {
  constructor(type, func, accumulator, async = false) {
    // initialize the Transform stream into object mode
    super({ objectMode: true });

    if (!VALID_TYPES.includes(type)) throw new Error(`
      Invalid type. Please choose from 'map', 'reduce', or 'filter'.
    `);
    this.type = type;

    if (this.type === 'reduce' && typeof accumulator === 'undefined') throw new Error(`
      Reduce transformers must include an accumulator.
    `);
    this.accumulator = accumulator;

    this.func = func;
    this.async = async;
  }

  _transform(chunk, encoding, cb) {
    if (chunk === FILTERED) return cb();

    if (this.type === 'map') {
      this.push(this.func(chunk));
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
      this.accumulator = this.func(this.accumulator, chunk);
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

module.exports = Transformer;
