const { exec } = require('../db/mysql')
const axios = require('axios')

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
    const sql = `insert into users (username, password, registrationAddress, registrationTime) values
        ('${username}', '${password}', '${registrationAddress}', ${registrationTime})
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
    const res = await axios.get('http://ip.taobao.com/service/getIpInfo.php?ip=myip', {
        headers: {
            referer: 'http://ip.taobao.com/ipSearch.html',
            host: 'ip.taobao.com'
        },
    })
    if (res.data) {
        return {
            success: true,
            data: res.data.data
        }
    } else {
        return {
            success: false,
            message: '获取ip地址失败'
        }
    }
}

module.exports = {
    register,
    checkName,
    getIpInfo
}