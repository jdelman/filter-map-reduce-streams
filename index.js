const Transformer = require('./transformer');

function filterMapReduceStream(stream, filterFunc, mapFunc, reduceFunc, accumulator) {
  const filterTransformer = new Transformer('filter', filterFunc, null, isAsync);
  const mapTransformer = new Transformer('map', mapFunc, null, isAsync);
  const reduceTransformer = new Transformer('reduce', reduceFunc, accumulator, isAsync);

  return stream.pipe(filterTransformer).pipe(mapTransformer).pipe(reduceTransformer);
}

function reduceStream(stream, reduceFunc, accumulator) {
  const reduceTransformer = new Transformer('reduce', reduceFunc, accumulator, isAsync);
  return stream.pipe(reduceTransformer);
}

module.exports = {
  filterMapReduceStream,
  reduceStream,
  Transformer
};
