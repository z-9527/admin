const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');
const historyApiFallback = require('koa-history-api-fallback')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

app.use(views(__dirname, +'/public/build'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(cors({credentials: true})); //前端调试时解决跨域，上线不用跨域

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

//一定要写在路由后面，写在前面就不会返回接口内容，而是直接返回首页了
app.use(historyApiFallback()); // 在这个地方加入。一定要加在静态文件的serve之前，否则会失效。
app.use(require('koa-static')(__dirname + '/public/build'))
app.use(require('koa-static')(__dirname + '/public/upload-files'))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
