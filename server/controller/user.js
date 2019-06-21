const { exec } = require('../db/mysql')
const axios = require('axios')
const { decrypt, genPassword } = require('../utils/util')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')


/**
 * 注册用户
 * @param {*} username 
 * @param {*} password 
 */
const register = async function (username, password) {
    if (!username || !password) {
        return new ErrorModel({
            message: '请输入账号或密码',
            httpCode: 400
        })
    }
    const checkNameResult = await checkName(username)
    if (checkNameResult.data.num) {
        return new ErrorModel({
            message: '用户名已存在',
            httpCode: 400
        })
    }
    const ip = await getIpInfo()
    if (ip.status !== 0) {
        return new ErrorModel({
            message: '获取IP地址失败',
            httpCode: 500
        })
    }
    const registrationAddress = JSON.stringify(ip.data)
    //先解密前端加密的密码
    const originalText = decrypt(password)
    //然后再用另一种方式加密密码
    const ciphertext = genPassword(originalText)
    const sql = `insert into users (username, password, registrationAddress, registrationTime) values
        ('${username}', '${ciphertext}', '${registrationAddress}', ${Date.now()})
    `
    const res = await exec(sql)
    if (res.affectedRows) {
        return new SuccessModel({
            data: { userId: res.insertId },
            message: '注册成功'
        })
    } else {
        return new ErrorModel({
            message: '注册失败',
            httpCode: 500
        })
    }
}

/**
 * 检查用户名是否存在
 * @param {string} username 
 */
const checkName = async function (username) {
    const sql = `select * from users where username='${username}'`
    const res = await exec(sql)
    return new SuccessModel({
        data: { num: res.length }
    })
}

/**
 * 淘宝ip地址有跨越，利用后端代理请求
 */
const getIpInfo = async function () {
    const res = await axios.get('https://apis.map.qq.com/ws/location/v1/ip?key=MH2BZ-4WTK3-2D63K-YZRHP-HM537-HHBD3')
    if (res.data.status === 0) {
        return new SuccessModel({
            data: res.data.result
        })
    } else {
        return new ErrorModel({
            message: '获取ip地址失败',
            httpCode: 500
        })
    }
}
/**
 * 登陆
 * @param {*} username 
 * @param {*} password 
 */
const login = async function (username, password) {
    const checkNameResult = await checkName(username)
    if (!checkNameResult.data.num) {
        return new ErrorModel({
            message: '用户名不存在',
            httpCode: 400
        })
    }
    //先解密前端加密的密码
    const originalText = decrypt(password)
    //然后再用另一种方式加密密码
    const ciphertext = genPassword(originalText)
    const sql = `select * from users where username='${username}' and password='${ciphertext}'`
    const res = await exec(sql)
    if (!res.length) {
        return new ErrorModel({
            message: '密码错误',
            httpCode: 400
        })
    }
    const ip = await getIpInfo()
    if (ip.status !== 0) {
        return new ErrorModel({
            message: '获取IP地址失败',
            httpCode: 500
        })
    }
    const lastLoginAddress = JSON.stringify(ip.data)
    const sql2 = `update users set lastLoginAddress='${lastLoginAddress}',lastLoginTime='${Date.now()}' where username='${username}'`
    const res2 = await exec(sql2)

    //去掉密码
    delete res[0].password
    return new SuccessModel({
        message: '登陆成功',
        data: {
            ...res2[0],
            token: jwt.sign({ username }, TOKEN_SECRETKEY)
        }
    })
}

/**
 * 获取用户列表
 * @param {*} params 
 */
const getUsers = async (params) => {
    const { current = 0, pageSize = 10, username, startTime, endTime } = params
    let sql = `select SQL_CALC_FOUND_ROWS * from users where registrationTime between ${startTime || 0} and ${endTime || Date.now()} `
    if (username) {
        sql += `and username like '%${username}%' `
    }
    sql += `order by registrationTime desc limit ${current * pageSize},${pageSize}`
    const res = await exec(sql)
    const sql2 = 'select found_rows() as total'
    const res2 = await exec(sql2)
    return new SuccessModel({
        data: {
            list: res,
            current: parseInt(current),
            pageSize: parseInt(pageSize),
            total: res2[0].total
        }
    })
}
/**
 * 获取单个用户,可根据id或用户名查询单个用户
 * @param {*} params 
 */
const getUser = async (params)=>{
    const {id,username} = params
    if(!id && !username){
        return new ErrorModel({
            message:'参数异常',
            httpCode:400
        })
    }
    let sql = `select * from users where `
    if(id){
        sql += `id=${id}`
    } else if(username){
        sql += `username='${username}'`
    }
    const res = await exec(sql)
    return new SuccessModel({
        data:res[0]
    })
}

module.exports = {
    register,
    checkName,
    getIpInfo,
    login,
    getUsers,
    getUser
}