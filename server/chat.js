const ws = require('nodejs-websocket')
const { addChat } = require('./controller/chat')

//当前在线列表
let onlineList = []
//信息类型
const msgType = {
    onlineInfo: 0,   //关于在线列表
    chatInfo: 1     //关于聊天内容
}

const server = ws.createServer(function (connection) {
    connection.user = null

    connection.on('text', function (str) {
        const info = JSON.parse(str)
        if (!connection.user) {
            connection.user = info
            onlineList.push(info)
            const data = {
                onlineList,
                text: `用户${connection.user.username}已上线`
            }
            broadcast(data, msgType.onlineInfo)
        } else {
            //当用户修改头像或昵称时，修改connection.user,onlineList不用修改，因为userid不会变
            if(info.id){
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
        onlineList = onlineList.filter(item => item.id !== connection.user.id)
        const data = {
            onlineList,
            text: `用户${connection.user.username}已下线`
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
