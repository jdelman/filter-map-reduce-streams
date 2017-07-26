const { Transform } = require('stream');

const FILTERED = Symbol.for('filterMapReduceStream/filtered');
const VALID_TYPES = ['map', 'reduce', 'filter'];

class Transformer extends Transform {
  constructor(type, func, accumulator) {
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

    this.isAsync = ((this.type === 'reduce' && this.func.length === 3) ||
                   (this.type !== 'reduce' && this.func.length === 2));
  }

  handler(chunk) {
    return new Promise((resolve, reject) => {
      const callback = (err, value) => {
        if (err) return reject(err);
        return resolve(value);
      };

      const args = [];

      if (this.type === 'reduce') {
        args.push(this.accumulator);
      }

      args.push(chunk, callback);

      const p = this.func(...args);
      if (p instanceof Promise) {
        p.then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      }
      else if (!this.isAsync) {
        return resolve(p);
      }
    });
  }

  _transform(chunk, encoding, cb) {
    if (chunk === FILTERED) return cb();

    if (this.type === 'map') {
      this.handler(chunk).then(value => {
        this.push(value);
        cb();
      });
    }
    else if (this.type === 'filter') {
      this.handler(chunk).then(value => {
        if (value) this.push(chunk);
        cb();
      });
    }
    else if (this.type === 'reduce') {
      this.handler(chunk).then(value => {
        this.accumulator = value;
        cb();
      });
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
