const { exec } = require('../db/mysql')
const axios = require('axios')
const { decrypt, genPassword } = require('../utils/util')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')
// const { updateUserMessage } = require('./message')不能引用message否则message和user形成循环引用

//用户表的列名（除去了密码）
const usersColumns = [
    'id',
    'username',
    'registrationAddress',
    'registrationTime',
    'lastLoginAddress',
    'lastLoginTime',
    'isAdmin',
    'avatar',
    'birth',
    'phone',
    'location',
    'gender',
]

/**
 * 注册用户
 * @param {*} username 
 * @param {*} password 
 * @param {*} ctx 
 */
const register = async function (username, password, ctx) {
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
    const ip = await getIpInfo(ctx)
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
    const sql = `select username from users where username='${username}'`
    const res = await exec(sql)
    return new SuccessModel({
        data: { num: res.length }
    })
}

/**
 * 腾讯地图api获取ip地址
 */
const getIpInfo = async function (ctx) {
    const ip = ctx.ip.split(':').pop()   
    const res = await axios.get('https://apis.map.qq.com/ws/location/v1/ip', {
        params: {
            key: 'MH2BZ-4WTK3-2D63K-YZRHP-HM537-HHBD3',
            // ip //本地测试时ip一直是:::1，所以先注释掉
        }
    })
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
 * @param {*} ctx 
 */
const login = async function (username, password, ctx) {
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
    const sql = `select username from users where username='${username}' and password='${ciphertext}'`
    const res = await exec(sql)
    if (!res.length) {
        return new ErrorModel({
            message: '密码错误',
            httpCode: 400
        })
    }
    const ip = await getIpInfo(ctx)
    if (ip.status !== 0) {
        return new ErrorModel({
            message: '获取IP地址失败',
            httpCode: 500
        })
    }
    const lastLoginAddress = JSON.stringify(ip.data)
    const sql2 = `update users set lastLoginAddress='${lastLoginAddress}',lastLoginTime='${Date.now()}' where username='${username}'`
    const res2 = await exec(sql2)
    return new SuccessModel({
        message: '登陆成功',
        data: {
            uesrname: res[0].username,
            token: jwt.sign({ username }, TOKEN_SECRETKEY, { expiresIn: '7d' })   //7天过期时间
        }
    })
}

/**
 * 获取用户列表
 * @param {*} param 
 */
const getUsers = async (param) => {
    const { current = 0, pageSize = 10, username, startTime, endTime } = param
    let sql = `select SQL_CALC_FOUND_ROWS ${usersColumns.join(',')} from users where registrationTime between ${startTime || 0} and ${endTime || Date.now()} `
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
 * @param {*} param 
 */
const getUser = async (param) => {
    const { id, username } = param
    if (!id && !username) {
        return new ErrorModel({
            message: '参数异常',
            httpCode: 400
        })
    }
    let sql = `select ${usersColumns.join(',')} from users where `
    if (id) {
        sql += `id=${id}`
    } else if (username) {
        sql += `username='${username}'`
    }
    const res = await exec(sql)
    return new SuccessModel({
        data: res[0]
    })
}

/**
 * 当更新用户名或用户头像时，更新其它表中和用户相关连的信息
 * @param {*} user 
 */
const updateUserMessage = (user) => {
    const sql = `update messages set userIsAdmin=${user.isAdmin},userName='${user.username}',userAvatar='${user.avatar}' where userId=${user.id}`
    const sql2 = `update messages set targetUserIsAdmin=${user.isAdmin},targetUserName='${user.username}',targetUserAvatar='${user.avatar}' where targetUserId=${user.id}`
    const sql3 = `update chats set username='${user.username}',userAvatar='${user.avatar}'`
    // 同步执行3个异步任务
    Promise.all([exec(sql), exec(sql2), exec(sql3)]).then(([res, res2, res3]) => {
        console.log(444, res)
        console.log(555, res2)
        console.log(666, res3)
    })
}

/**
 * 更新用户信息
 * @param {*} param 
 */
const updateUser = async (param, sessionId) => {
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    if (param.username && loginName !== param.username) {
        //如果修改了用户名还要检查用户名是否已经存在
        const checkNameResult = await checkName(param.username)
        if (checkNameResult.data.num) {
            return new ErrorModel({
                message: '用户名已存在',
                httpCode: 400
            })
        }
    }
    let str = ''
    for (let [key, value] of Object.entries(param)) {
        if (value) {
            if (key === 'password') {
                //先解密前端加密的密码
                const originalText = decrypt(value)
                //然后再用另一种方式加密密码
                const ciphertext = genPassword(originalText)
                str += `,${key}='${ciphertext}'`
            } else {
                str += `,${key}='${value}'`
            }
        }
    }
    const sql = `update users set ${str.substring(1)} where username='${loginName}'`
    const res = await exec(sql)
    const res2 = await getUser({ username: param.username })
    if (res2.status === 0) {
        //更新用户的留言（头像、用户名）
        updateUserMessage(res2.data)
    }
    return new SuccessModel({
        data: {
            ...res2.data,
            token: jwt.sign({ username: param.username }, TOKEN_SECRETKEY, { expiresIn: '7d' })
        },
        message: '修改成功'
    })
}

const deleteUsers = async (param) => {
    const ids = param.ids
    if (!Array.isArray(ids)) {
        return new ErrorModel({
            message: '参数异常',
            httpCode: 400
        })
    }
    const sql = `delete from users where id in (${ids.join(',')})`
    const res = await exec(sql)
    return new SuccessModel({
        message: `成功删除${res.affectedRows}条数据`
    })
}

/**
 * 获取所有用户
 */
const getAllUsers = async () => {
    const sql = `select id,username,avatar,isAdmin from users order by registrationTime desc`
    const res = await exec(sql)
    return new SuccessModel({
        data: res
    })
}

module.exports = {
    register,
    checkName,
    getIpInfo,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUsers,
    getAllUsers
}