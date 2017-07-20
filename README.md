# filter-map-reduce-streams

### Ok, but why

Sometimes you want to stream in a bunch of data from a DB, process it, and then spit it back out somewhere.

Sure, DBs have their aggregation methods, which are usually performant and optimized, but maybe you need  process and coordinate with outside data sources. This package lets you create your own custom data processing pipeline for streams.

This package includes a `Transformer` class to manage transforming the stream. Or use one of the included helpers (`filterMapReduceStream` or `reduceStream`). You can use synchronous functions that directly return a value, Node-style callbacks, or even return a `Promise`.

### Testing

Run `npm test`.
