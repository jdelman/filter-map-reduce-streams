const Transformer = require('./transformer');

function filterMapReduceStream(stream, filterFunc, mapFunc, reduceFunc, accumulator) {
  const filterTransformer = new Transformer('filter', filterFunc);
  const mapTransformer = new Transformer('map', mapFunc);
  const reduceTransformer = new Transformer('reduce', reduceFunc, accumulator);

  return stream.pipe(filterTransformer).pipe(mapTransformer).pipe(reduceTransformer);
}

function reduceStream(stream, reduceFunc, accumulator) {
  const reduceTransformer = new Transformer('reduce', reduceFunc, accumulator);
  return stream.pipe(reduceTransformer);
}

module.exports = {
  filterMapReduceStream,
  reduceStream,
  Transformer
};
