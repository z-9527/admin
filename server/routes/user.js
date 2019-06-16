const router = require('koa-router')()
const { register, checkName, getIpInfo, login } = require('../controller/user')

router.prefix('/user')

router.post('/register', async function (ctx, next) {
  const { username, password } = ctx.request.body
  const res = await register(username, password)
  ctx.body = res
})

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.body = {
      message: '请输入账号或密码'
    }
    ctx.status = 400
    return
  }
  const res = await login(username, password)
  ctx.body = res
})

router.get('/checkName', async function (ctx, next) {
  const { username } = ctx.query
  const res = await checkName(username)
  ctx.body = res
})

router.get('/getIpInfo', async function (ctx, next) {
  const res = await getIpInfo()
  ctx.body = res
})

module.exports = router
