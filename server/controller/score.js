const { exec } = require('../db/mysql')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/**
 * 获取用户评分列表
 */
const getScores = async () => {
    const sql = 'select * from scores'
    const res = await exec(sql)
    return new SuccessModel({
        data: res
    })
}

/**
 * 用户评分
 * @param {*} param 
 */
const createScore = async (param) => {
    const { userId, score } = param
    if (userId === undefined || score === undefined) {
        return new ErrorModel({
            message: '参数异常'
        })
    }
    const res = await exec(`select userId from scores where userId=${userId}`)
    if (res.length) {
        return new ErrorModel({
            message: '用户已经评过分'
        })
    }
    const sql = `insert into scores (createTime,userId,score) values (${Date.now()},${userId},${score})`
    const res2 = await exec(sql)
    if (res2.affectedRows) {
        return new SuccessModel({
            message: '评分成功'
        })
    } else {
        return new ErrorModel({
            message: '评分失败'
        })
    }
}

module.exports = {
    getScores,
    createScore
}