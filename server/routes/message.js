const router = require('koa-router')()
const { } = require('../controller/message')
const { createMessage, getMessages, deleteMessage } = require('../controller/message')

router.prefix('/message')

function handleRes(ctx, next, res) {
    if (res.status === 0) {
        ctx.body = res
    } else {
        ctx.status = res.httpCode
        ctx.body = res
        // ctx.message = res.message   //本来想直接设置fetch的statusText，但是加了这句话请求就出错
    }
}

router.post('/create', async function (ctx, next) {
    const sessionId = ctx.cookies.get('sessionId')
    const res = await createMessage(ctx.request.body, sessionId)
    handleRes(ctx, next, res)
})

router.get('/list', async function (ctx, next) {
    const res = await getMessages(ctx.query)
    handleRes(ctx, next, res)
})

router.post('/delete', async function (ctx, next) {
    const sessionId = ctx.cookies.get('sessionId')
    const res = await deleteMessage(ctx.request.body, sessionId)
    handleRes(ctx, next, res)
})




module.exports = router
