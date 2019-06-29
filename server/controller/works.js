
const { exec } = require('../db/mysql')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getUser } = require('./user')


/**
 * 判断是否是管理员
 * @param {*} loginName 
 */
async function isAdmin(loginName) {
    const userRes = await getUser({ username: loginName })
    if (userRes.status === 0) {
        return userRes.data.isAdmin
    }
    return false
}

/**
 * 创建作品
 * @param {*} param 
 * @param {*} token 
 */
const createWorks = async (param, sessionId) => {
    const { title, description, url, githubUrl } = param
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    const isAdminRes = await isAdmin(loginName)
    if (!isAdminRes) {
        return new ErrorModel({
            message: '暂无权限'
        })
    }
    const sql = `insert into works (author,createTime,title,description, url, githubUrl) values
     ('${loginName}',${Date.now()},'${title}','${description}','${url}','${githubUrl}')`
    const res = await exec(sql)
    if (res.affectedRows) {
        return new SuccessModel({
            data: { id: res.insertId },
            message: '创建成功'
        })
    } else {
        return new ErrorModel({
            message: '创建失败',
            httpCode: 500
        })
    }

}
/**
 * 获取作品列表
 */
const getWorks = async () => {
    const sql = `select * from works order by id DESC`
    const res = await exec(sql)
    return new SuccessModel({
        data: res
    })
}

const deleteWorks = async (param, sessionId) => {
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    const isAdminRes = await isAdmin(loginName)
    if (!isAdminRes) {
        return new ErrorModel({
            message: '暂无权限'
        })
    }
    const ids = param.ids
    if (!Array.isArray(ids)) {
        return new ErrorModel({
            message: '参数异常',
            httpCode: 400
        })
    }
    const sql = `delete from works where id in (${ids.join(',')})`
    const res = await exec(sql)
    return new SuccessModel({
        message: `成功删除${res.affectedRows}条数据`
    })
}

module.exports = {
    createWorks,
    getWorks,
    deleteWorks
}
