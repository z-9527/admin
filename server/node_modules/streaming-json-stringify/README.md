# Streaming JSON.stringify()

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Similar to [JSONStream.stringify()](https://github.com/dominictarr/JSONStream#jsonstreamstringifyopen-sep-close) except it is, by default, a binary stream, and it is a streams2 implementation.

## Example

The main use case for this is to stream a database query to a web client.
This is meant to be used only with arrays, not objects.

```js
var Stringify = require('streaming-json-stringify')

app.get('/things', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  db.things.find()
  .stream()
  .pipe(Stringify())
  .pipe(res)
})
```

will yield something like

```json
[
{"_id":"123412341234123412341234"}
,
{"_id":"123412341234123412341234"}
]

```

## Separators

* The stream always starts with `'[\n'`.
* Documents are separated by `'\n,\n'`.
* The stream is terminated with `'\n]\n'`.

## Stringifier

By default, [json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe) is used to convert objects into strings. This can be configured with `options.stringifier`.

## API

### Stringify([options])

Returns a `Transform` stream.
The options are passed to the `Transform` constructor.

### JSON.stringify options

You can override these:

```js
var stringify = Stringify()
stringify.replacer = function () {}
stringify.space = 2
stringify.opener = '['
stringify.seperator = ','
stringify.closer = ']'
stringify.stringifier = JSON.stringify
```

[gitter-image]: https://badges.gitter.im/stream-utils/streaming-json-stringify.png
[gitter-url]: https://gitter.im/stream-utils/streaming-json-stringify
[npm-image]: https://img.shields.io/npm/v/streaming-json-stringify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/streaming-json-stringify
[github-tag]: http://img.shields.io/github/tag/stream-utils/streaming-json-stringify.svg?style=flat-square
[github-url]: https://github.com/stream-utils/streaming-json-stringify/tags
[travis-image]: https://img.shields.io/travis/stream-utils/streaming-json-stringify.svg?style=flat-square
[travis-url]: https://travis-ci.org/stream-utils/streaming-json-stringify
[coveralls-image]: https://img.shields.io/coveralls/stream-utils/streaming-json-stringify.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/stream-utils/streaming-json-stringify
[david-image]: http://img.shields.io/david/stream-utils/streaming-json-stringify.svg?style=flat-square
[david-url]: https://david-dm.org/stream-utils/streaming-json-stringify
[license-image]: http://img.shields.io/npm/l/streaming-json-stringify.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/streaming-json-stringify.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/streaming-json-stringify
