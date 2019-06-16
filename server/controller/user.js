const { exec } = require('../db/mysql')
const axios = require('axios')
const { decrypt, genPassword } = require('../utils/util')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')


/**
 * 注册用户
 * @param {*} username 
 * @param {*} password 
 */
const register = async function (username, password) {
    if (!username || !password) {
        return {
            success: false,
            message: '请输入账号或密码',
            status: 400
        }
    }
    const checkNameResult = await checkName(username)
    if (checkNameResult.num) {
        return {
            success: false,
            message: '用户名已存在',
        }
    }
    const ip = await getIpInfo()
    if(!ip.success){
        return {
            success:false,
            message:'获取IP地址失败'
        }
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
        return {
            message: '注册成功',
            success: true,
            id: res.insertId
        }
    } else {
        return {
            message: '注册失败',
            success: false
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
        success: true,
        num: res.length
    }
}

/**
 * 淘宝ip地址有跨越，利用后端代理请求
 */
const getIpInfo = async function () {
    const res = await axios.get('https://apis.map.qq.com/ws/location/v1/ip?key=MH2BZ-4WTK3-2D63K-YZRHP-HM537-HHBD3')
    if (res.data.status === 0 ) {
        return {
            success: true,
            data: res.data.result
        }
    } else {
        return {
            success: false,
            message: '获取ip地址失败'
        }
    }
}
/**
 * 登陆
 * @param {*} username 
 * @param {*} password 
 */
const login = async function (username, password) {
    const checkNameResult = await checkName(username)
    if (!checkNameResult.num) {
        return {
            success: false,
            message: '用户名不存在'
        }
    }
    //先解密前端加密的密码
    const originalText = decrypt(password)
    //然后再用另一种方式加密密码
    const ciphertext = genPassword(originalText)
    const sql = `select * from users where username='${username}' and password='${ciphertext}'`
    const res = await exec(sql)
    if (!res.length) {
        return {
            message: '密码错误',
            success: false,
            status: 401
        }
    }
    const ip = await getIpInfo()
    if(!ip.success){
        return {
            success:false,
            message:'获取IP地址失败'
        }
    }
    const lastLoginAddress = JSON.stringify(ip.data)
    const sql2 = `update users set lastLoginAddress='${lastLoginAddress}',lastLoginTime='${Date.now()}' where username='${username}'`
    const res2 = await exec(sql2)
    console.log(5555,res2)

    
    //去掉密码
    delete res[0].password
    return {
        data: {
            ...res[0],
            token: jwt.sign({ username }, TOKEN_SECRETKEY)
        },
        success: true
    }
}

module.exports = {
    register,
    checkName,
    getIpInfo,
    login
}