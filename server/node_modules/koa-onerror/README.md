koa-onerror
=================

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/koa-onerror.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-onerror
[travis-image]: https://img.shields.io/travis/koajs/onerror.svg?style=flat
[travis-url]: https://travis-ci.org/koajs/onerror
[coveralls-image]: https://img.shields.io/coveralls/koajs/onerror.svg?style=flat
[coveralls-url]: https://coveralls.io/r/koajs/onerror?branch=master
[gittip-image]: https://img.shields.io/gittip/dead_horse.svg?style=flat
[gittip-url]: https://www.gittip.com/dead-horse/
[david-image]: https://img.shields.io/david/koajs/onerror.svg?style=flat
[david-url]: https://david-dm.org/koajs/onerror

an error handler for koa, hack ctx.onerror.

different with [koa-error](https://github.com/kosjs/koa):
- we can not just use try catch to handle all errors, steams' and events'
errors are directly handle by `ctx.onerror`, so if we want to handle all
errors in one place, the only way i can see is to hack `ctx.onerror`.
- it is more customizable.

## install

```bash
npm install koa-onerror
```

## Usage

```js
var fs = require('fs');
var koa = require('koa');
var onerror = require('koa-onerror');
var app = koa();

onerror(app);

app.use(function *(){
  // foo();
  this.body = fs.createReadStream('not exist');
});
```

## Options

```
onerror(app, options);
```

* **all**: if options.all exist, ignore negotiation
* **text**: text error handler
* **json**: json error handler
* **html**: html error handler
* **template**: default html error handler template path
* **redirect**: if accepct html, can redirect to another error page

check out default handler to write your own handler.

## Status and Headers

`koa-onerror` will automatic set `err.status` as response status code, and `err.headers` as response headers.

## License
MIT
