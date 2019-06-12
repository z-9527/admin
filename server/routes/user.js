const router = require('koa-router')()
const { register, checkName, getIpInfo } = require('../controller/user')

router.prefix('/user')

router.post('/register', async function (ctx, next) {
  const { username, password, registrationAddress, registrationTime } = ctx.request.body
  const res = await register(username, password, registrationAddress, registrationTime)
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
