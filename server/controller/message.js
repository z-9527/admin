const { exec } = require('../db/mysql')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getUser } = require('./user')

/**
 * 创建留言
 * @param {*} param 
 */
const createMessage = async (param, sessionId) => {
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    const userRes = await getUser({ username: loginName })
    const user = userRes.data || {}

    let insertObj = {
        type: param.type || 0,
        pid: param.pid || -1,
        createTime: Date.now(),
        content: `'${param.content}'` || '',
        userId: user.id,
        userIsAdmin: user.isAdmin,
        userName: `'${user.username}'`,
        userAvatar: `'${user.avatar}'`
    }
    if (param.type === 1) {
        const targetUserRes = await getUser({ id: param.targetUserId })
        const targetUser = targetUserRes.data || {}
        insertObj = {
            ...insertObj,
            targetUserId: targetUser.id,
            targetUserIsAdmin: targetUser.isAdmin,
            targetUserName: `'${targetUser.username}'`,
            targetUserAvatar: `'${targetUser.avatar}'`,
        }
    }
    const sql = `insert into messages (${Object.keys(insertObj).join(',')}) values (${Object.values(insertObj).join(',')})`
    const res = await exec(sql)
    if (res.affectedRows) {
        return new SuccessModel({
            data: {
                id: res.insertId
            },
            message: '新增成功'
        })
    } else {
        return new ErrorModel({
            message: '新增失败'
        })
    }
}

/**
 * 获取留言列表
 */
const getMessages = async (query) => {
    const { current = 0, pageSize = 10 } = query
    // 获取留言信息
    const sqlMsg = `select SQL_CALC_FOUND_ROWS * from messages where pid=-1 order by createTime DESC limit ${current * pageSize},${pageSize}`
    const resMsg = await exec(sqlMsg)

    // 获取总留言数
    const sqlTotal = 'select found_rows() as total'
    const resTotal = await exec(sqlTotal)

    // 获取对应页的回复数据
    const pids = Array.isArray(resMsg) ? resMsg.map(i => i.id) : []
    let resReply = []
    if (pids.length) {
        const sqlReply = `select * from messages where pid in (${pids.join(',')}) order by createTime`
        resReply = await exec(sqlReply)
    }

    const list = resMsg.map(item => {
        const children = resReply.filter(i => i.pid === item.id)
        return {
            ...item,
            children
        }
    })

    return new SuccessModel({
        data: {
            list,
            current: parseInt(current),
            pageSize: parseInt(pageSize),
            total: resTotal[0].total,
        }
    })
}

/**
 * 删除留言
 * @param {*} param 
 * @param {*} sessionId 
 */
const deleteMessage = async (param, sessionId) => {
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    const userRes = await getUser({ username: loginName })
    const user = userRes.data || {}
    const sql = `select userId from messages where id=${param.id}`
    const res = await exec(sql)
    if (user.id !== res[0].userId && !user.isAdmin) {
        return new ErrorModel({
            message: '暂无权限'
        })
    }
    const sql2 = `delete from messages where id=${param.id} or pid=${param.id}`
    const res2 = await exec(sql2)
    return new SuccessModel({
        message: `成功删除${res2.affectedRows}条数据`,
    })
}

/**
 * 当更新用户名或用户头像时，更新他留言的用户名和头像
 * @param {*} user 
 */
const updateUserMessage = (user) => {
    const sql = `update messages set userIsAdmin=${user.isAdmin},userName='${user.username}',userAvatar='${user.avatar}' where userId=${user.id}`
    const sql2 = `update messages set targetUserIsAdmin=${user.isAdmin},targetUserName='${user.username}',targetUserAvatar='${user.avatar}' where targetUserId=${user.id}`
    Promise.all([exec(sql), exec(sql2)]).then(([res, res2]) => {
        console.log(444, res)
        console.log(555, res2)
    })
}

module.exports = {
    createMessage,
    getMessages,
    deleteMessage,
    updateUserMessage
}