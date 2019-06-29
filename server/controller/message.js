const { exec } = require('../db/mysql')
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getUser } = require('./user')

/**
 * 创建留言
 * @param {*} params 
 */
const createMessage = async (params, sessionId) => {
    const loginName = jwt.verify(sessionId, TOKEN_SECRETKEY).username
    const userRes = await getUser({ username: loginName })
    const user = userRes.data || {}

    let insertObj = {
        type: params.type || 0,
        pid: params.pid || -1,
        createTime: Date.now(),
        content: `'${params.content}'` || '',
        userId: user.id,
        userName: `'${user.username}'`,
        userAvatar: `'${user.avatar}'`
    }
    if (params.type === 1) {
        const targetUserRes = await getUser({ id: params.targetUserId })
        const targetUser = targetUserRes.data || {}
        insertObj = {
            ...insertObj,
            targetUserId: targetUser.id,
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
const getMessages = async () => {
    const sql = `select * from messages order by createTime DESC` //按时间降序排列
    const res = await exec(sql)
    //这里可以用sql查两次类型的回复，也可以用js来过滤

    let list = res.reduce((total,current)=>{
        if(current.type===0){
            total.push({
                ...current,
                children:[]
            })
        }
        return total
    },[])
    let subList = res.filter(item => item.type === 1)
    subList.forEach(item => {
        const index = list.findIndex(i => i.id === item.pid)
        list[index].children.unshift(item)
    })
    return new SuccessModel({
        data: list
    })
}

module.exports = {
    createMessage,
    getMessages
}