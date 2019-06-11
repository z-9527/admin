const { exec } = require('../db/mysql')

/**
 * 注册用户
 * @param {*} username 
 * @param {*} password 
 * @param {*} registrationAddress 
 * @param {*} registrationTime 
 */
const register = async function (username, password, registrationAddress, registrationTime) {
    if (!username || !password) {
        return {
            sussess: false,
            message: '请输入账号或密码',
            status: 400
        }
    }
    const checkNameResult = await checkName(username)
    if (checkNameResult.num) {
        return {
            sussess: false,
            message: '用户名已存在',
        }
    }
    const sql = `insert into users (username, password, registrationAddress, registrationTime) values
        ('${username}', '${password}', '${registrationAddress}', ${registrationTime})
    `
    const res = await exec(sql)
    if (res.affectedRows) {
        return {
            message: '注册成功',
            sussess: true,
            id: res.insertId,
            data: checkNameResult
        }
    } else {
        return {
            message: '注册失败',
            sussess: false
        }
    }
}

/**
 * 检查用户名是否存在
 * @param {string} username 
 */
const checkName = async function (username) {
    const sql = `select * from users where username='${username}'`
    const res = await exec(sql)
    return {
        sussess: true,
        num: res.length
    }
}

module.exports = {
    register,
    checkName
}