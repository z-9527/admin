const router = require('koa-router')()
const uploadFile = require('../utils/upload')
const path = require('path')

function handleRes(ctx, next, res) {
  if (res.status === 0) {
    ctx.body = res
  } else {
    ctx.status = res.httpCode
    ctx.body = res
    // ctx.message = res.message   //本来想直接设置fetch的statusText，但是加了这句话请求就出错
  }
}

router.get('/', async (ctx, next) => {
  await ctx.render('pubilc/build/index.html')
})

//上传接口
router.post('/upload', async (ctx, next) => {
  const serverFilePath = path.join(__dirname, '../public/upload-files')
  const res = await uploadFile(ctx, {
    fileType: 'myUpload', // common or album
    path: serverFilePath,
    isImg: !!ctx.query.isImg
  })
  handleRes(ctx, next, res)
})

router.get('/json', async (ctx, next) => {
  console.log(ctx.cookies.get('sessionId'))
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
