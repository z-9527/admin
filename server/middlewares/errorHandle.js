const { ErrorModel } = require('../model/resModel')
module.exports = errorHandle = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = new ErrorModel({
                httpCode: 401,
                message: '登陆异常'
            })
        } else {
            throw err;
        }
    });
}