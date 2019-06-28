const { exec } = require('../db/mysql')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/**
 * 创建留言
 * @param {*} params 
 */
const createMessage = async (params)=>{
    return new SuccessModel({
        data:{
            test:'fff'
        }
    })
}

module.exports = {
    createMessage
}