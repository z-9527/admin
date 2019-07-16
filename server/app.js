const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');
const historyApiFallback = require('koa-history-api-fallback')
const { TOKEN_SECRETKEY } = require('./config/secret')
const jwt = require('koa-jwt')
const errorHandle = require('./middlewares/errorHandle')
const koaStatic = require('koa-static')
const chat = require('./chat')

const index = require('./routes/index')
const user = require('./routes/user')
const works = require('./routes/works')
const message = require('./routes/message')
const score = require('./routes/score')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

app.use(views(__dirname + '/public/build'))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(errorHandle)

app.use(cors({ credentials: true })); //前端调试时解决跨域，上线不用跨域

//验证token登陆,unless是不需要验证的路由，每一项是匹配路由的正则
const unPath = [/^\/$/, /public/, /checkName/, /register/, /getIpInfo/, /login/]
const buildFiles = [/\.js$/, /\.css$/, /\.less$/, /\.ico/, /\.json$/, /static/]  //前端打包后不需要验证的资源
app.use(jwt({ secret: TOKEN_SECRETKEY, cookie: 'sessionId' }).unless({ path: unPath.concat(buildFiles) }));


// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(works.routes(), works.allowedMethods())
app.use(message.routes(), message.allowedMethods())
app.use(score.routes(), score.allowedMethods())

//一定要写在路由后面，写在前面就不会返回接口内容，而是直接返回首页了
app.use(historyApiFallback()); // 在这个地方加入。一定要加在静态文件的serve之前，否则会失效。
app.use(koaStatic(__dirname, { maxage: 7 * 24 * 60 * 60 }))
app.use(koaStatic(__dirname + '/public/build', { maxage: 7 * 24 * 60 * 60 }))
app.use(koaStatic(__dirname + '/public/upload-files', { maxage: 7 * 24 * 60 * 60 }))

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app
