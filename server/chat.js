const ws = require('nodejs-websocket')
const { addChat } = require('./controller/chat')

//当前在线列表
let onlineList = []
//信息类型
const msgType = {
    onlineInfo: 0,   //关于在线列表
    chatInfo: 1     //关于聊天内容
}

//对象数组去重
function unique(arr) {
    const obj = {}
    const result = arr.reduce((total, cur) => {
        if (!obj[cur.id]) {
            obj[cur.id] = total.push(cur)
        }
        return total
    }, [])
    return result
}

const server = ws.createServer(function (connection) {
    connection.user = {}

    connection.on('text', function (str) {
        const info = JSON.parse(str)
        if (!connection.user.id) {
            connection.user = info
            //防止同一个账号在同一个浏览器中的不同窗口重复上线
            const isExist = onlineList.find(item => item.id === connection.user.id)
            onlineList.push(info)
            const data = {
                onlineList: unique(onlineList),
                text: isExist ? '' : `用户${connection.user.username}已上线`
            }
            broadcast(data, msgType.onlineInfo)
        } else {
            //当用户修改头像或昵称时，修改connection.user,onlineList不用修改，因为userid不会变
            if (info.id) {
                connection.user = info
                return
            }
            const data = {
                userId: connection.user.id,
                username: connection.user.username,
                userAvatar: connection.user.avatar,
                createTime: Date.now(),
                content: info.content
            }
            addChat(data)
            broadcast(data)
        }
    })
    // 断开连接
    connection.on('close', function (code, reason) {
        //当同一个账号在同个浏览器的多个窗口打开时，会有多个userId相同的连接，如果用filter就全部下线了，我们应该只删除当前窗口的连接
        // onlineList = onlineList.filter(item => item.id !== connection.user.id)
        const index = onlineList.findIndex(item => item.id === connection.user.id)
        onlineList.splice(index, 1)   //只删除一个连接
        const isExist = onlineList.find(item => item.id === connection.user.id)
        const data = {
            onlineList: unique(onlineList),
            text: isExist ? '' : `用户${connection.user.username}已下线`
        }
        broadcast(data, msgType.onlineInfo)
    })

    // 连接错误
    connection.on('error', function (error) {
        console.log(error)
    })

})


//广播
function broadcast(msg, type = msgType.chatInfo) {
    server.connections.forEach(function (connection) {
        connection.sendText(JSON.stringify({
            type,
            msg
        }))
    })
}

server.listen(8081)
