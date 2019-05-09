/*!
 * koa-onerror - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var assert = require('assert');
var http = require('http');
var path = require('path');
var copy = require('copy-to');
var swig = require('swig');

var env = process.env.NODE_ENV || 'development';
var isDev = env === 'development';

/**
 * Expose `onerror`
 */

module.exports = onerror;

function onerror(app, options) {
  options = options || {};

  var defaultOptions = {
    html: html,
    text: text,
    json: json,
    redirect: null,
    template: path.join(__dirname, 'error.html'),
    accepts: null,
  };

  copy(defaultOptions).to(options);
  var render = swig.compileFile(options.template);

  app.context.onerror = function(err) {
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) {
      return;
    }

    assert(err instanceof Error, 'non-error thrown: ' + err);

    // delegate
    this.app.emit('error', err, this);

    // nothing we can do here other
    // than delegate to the app-level
    // handler and log.
    if (this.headerSent || !this.writable) {
      err.headerSent = true;
      return;
    }

    // ENOENT support
    if ('ENOENT' === err.code) {
      err.status = 404;
    }

    if ('number' !== typeof err.status || !http.STATUS_CODES[err.status]) {
      err.status = 500;
    }
    this.status = err.status;

    this.set(err.headers);

    var type = 'text';
    if (options.accepts) {
      type = options.accepts.call(this, 'html', 'text', 'json');
    } else {
      type = this.accepts('html', 'text', 'json');
    }
    type = type || 'text';
    if (options.all) {
      options.all.call(this, err);
    } else {
      if (options.redirect && type !== 'json') {
        this.redirect(options.redirect);
      } else {
        options[type].call(this, err);
        this.type = type;
      }
    }

    if (type === 'json') {
      this.body = JSON.stringify(this.body);
    }
    this.res.end(this.body);
  };

  /**
   * default html error handler
   * @param {Error} err
   */

  function html(err) {
    this.body = render({
      env: env,
      ctx: this,
      request: this.request,
      response: this.response,
      error: err.message,
      stack: err.stack,
      status: this.status,
      code: err.code
    });
  }

  /**
   * default text error handler
   * @param {Error} err
   */

  function text(err) {
    // unset all headers, and set those specified
    this.res._headers = {};
    this.set(err.headers);

    this.body = isDev || err.expose
      ? err.message
      : http.STATUS_CODES[this.status];
  }

  /**
   * default json error handler
   * @param {Error} err
   */

  function json(err) {
    this.body = isDev || err.expose
      ? { error: err.message }
      : { error: http.STATUS_CODES[this.status] };
  }
}
