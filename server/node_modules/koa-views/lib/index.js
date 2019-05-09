
'use strict'

var ref = require('path');
var resolve = ref.resolve;
var dirname = ref.dirname;
var extname = ref.extname;
var join = ref.join;
var debug = require('debug')('koa-views')
var consolidate = require('consolidate')
var ref$1 = require('mz/fs');
var stat = ref$1.stat;
var send = require('koa-send')

module.exports = viewsMiddleware

function viewsMiddleware (path, ref) {
  if ( ref === void 0 ) ref = {};
  var engineSource = ref.engineSource; if ( engineSource === void 0 ) engineSource = consolidate;
  var extension = ref.extension; if ( extension === void 0 ) extension = 'html';
  var options = ref.options; if ( options === void 0 ) options = {};
  var map = ref.map;

  return function views (ctx, next) {
    if (ctx.render) return next()

    ctx.render = function (relPath, locals) {
      if ( locals === void 0 ) locals = {};

      var suffix = (extname(relPath) || '.' + extension).slice(1)

      return getPaths(path, relPath, suffix)
        .then(function (paths) {
          var state = Object.assign(locals, options, ctx.state || {})
          debug('render `%s` with %j', paths.rel, state)
          ctx.type = 'text/html'

          if (isHtml(suffix) && !map) {
            return send(ctx, paths.rel, {
              root: path
            })
          } else {
            var engineName = map && map[suffix]
              ? map[suffix]
              : suffix

            var render = engineSource[engineName]

            if (!engineName || !render) return Promise.reject(new Error(
              ("Engine not found for the \"." + extension + "\" file extension")
            ))

            return render(resolve(paths.abs, paths.rel), state)
              .then(function (html) {
                ctx.body = html
              })
          }
        })
    }

    return next()
  }
}

function getPaths(abs, rel, ext) {
  return stat(join(abs, rel)).then(function (stats) {
    if (stats.isDirectory()) {
      // a directory
      return {
        rel: join(rel, toFile('index', ext)),
        abs: join(abs, dirname(rel), rel)
      }
    }

    // a file
    return { rel: rel, abs: abs }
  })
  .catch(function (e) {
    // not a valid file/directory
    if (!extname(rel)) {
      // Template file has been provided without extension
      // so append to it to try another lookup
      return getPaths(abs, (rel + "." + ext), ext)
    }

    throw e
  })
}

function isHtml (ext) {
  return ext === 'html'
}

function toFile (fileName, ext) {
  return (fileName + "." + ext)
}
