const router = require('koa-router')()
const uploadFile = require('../utils/upload')
const path = require('path')

router.get('/', async (ctx, next) => {
  await ctx.render('pubilc/build/index.html')
})

//上传接口
router.post('/upload', async (ctx, next) => {
  const serverFilePath = path.join(__dirname, '../public/upload-files')
  try {
    const result = await uploadFile(ctx, {
      fileType: 'myUpload', // common or album
      path: serverFilePath,
      isImg: !!ctx.query.isImg
    })
    ctx.body = result
  } catch (error) {
    ctx.body = error
    ctx.status = 500
  }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
