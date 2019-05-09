
/*

  db.collection.find().stream().pipe(Stringify()).pipe(res)

*/

var Transform = require('readable-stream/transform')
var stringify = require('json-stringify-safe')
var util = require('util')

util.inherits(Stringify, Transform)

module.exports = Stringify

function Stringify(options) {
  if (!(this instanceof Stringify))
    return new Stringify(options || {})
  if (options && options.replacer) {
    this.replacer = options.replacer;
  }
  if (options && options.space !== undefined) {
    this.space = options.space;
  }
  Transform.call(this, options || {})
  this._writableState.objectMode = true

  // Array Deliminator and Stringifier defaults
  var opener = options && options.opener ? options.opener : '[\n'
  var seperator = options && options.seperator ? options.seperator : '\n,\n'
  var closer = options && options.closer ? options.closer : '\n]\n'
  var stringifier = options && options.stringifier ? options.stringifier : stringify

  // Array Deliminators and Stringifier
  this.opener = new Buffer(opener, 'utf8')
  this.seperator = new Buffer(seperator, 'utf8')
  this.closer = new Buffer(closer, 'utf8')
  this.stringifier = stringifier
}

// Flags
Stringify.prototype.started = false

// JSON.stringify options
Stringify.prototype.replacer = null
Stringify.prototype.space = 0

Stringify.prototype._transform = function (doc, enc, cb) {
  if (this.started) {
    this.push(this.seperator)
  } else {
    this.push(this.opener)
    this.started = true
  }

  doc = this.stringifier(doc, this.replacer, this.space)

  this.push(new Buffer(doc, 'utf8'))
  cb()
}

Stringify.prototype._flush = function (cb) {
  if (!this.started) this.push(this.opener)
  this.push(this.closer)
  this.push(null)
  cb()
}
