const router = require('koa-router')()
const { createWorks, getWorks, deleteWorks } = require('../controller/works')

router.prefix('/works')

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
    const res = await createWorks(ctx.request.body, sessionId)
    handleRes(ctx, next, res)
})

router.get('/list', async function (ctx, next) {
    const res = await getWorks()
    handleRes(ctx, next, res)
})

router.post('/delete', async function (ctx, next) {
    const sessionId = ctx.cookies.get('sessionId')
    const res = await deleteWorks(ctx.request.body, sessionId)
    handleRes(ctx, next, res)
})




module.exports = router
