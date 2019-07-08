import React from 'react'
import { json } from '../utils/ajax'
import { notification, Avatar } from 'antd'
import { replaceImg } from '../utils/util'

// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER'
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}

//异步action
export function getUser(param) {
    return async function (dispatch) {
        const res = await json.get('/user/getUser', param)
        dispatch(setUser(res.data || {}))
    }
}

export const SET_WEBSOCKET = 'SET_WEBSOCKET'  //设置websocket对象
export function setWebsocket(websocket) {
    return {
        type: SET_WEBSOCKET,
        websocket
    }
}


export function initWebSocket(user) {    //初始化websocket对象
    return async function (dispatch) {
        const websocket = new WebSocket("ws://" + window.location.hostname + ":8081")
        websocket.onopen = function () {
            const data = {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            }
            websocket.send(JSON.stringify(data))
        }
        websocket.onmessage = function (event) {
            const data = JSON.parse(event.data)
            if (data.type === 0) {
                setOnlinelist(data.msg.onlineList)
                notification.info({
                    message: '提示',
                    description: data.msg.text
                })
            }
            if (data.type === 1) {
                dispatch(addChat(data.msg))
                notification.open({
                    message: data.msg.username,
                    description: <div dangerouslySetInnerHTML={{ __html: replaceImg(data.msg.content) }} />,
                    icon: <Avatar src={data.msg.userAvatar} />
                })
            }
            console.log(11, data)
        }
        dispatch(setWebsocket(websocket))
        dispatch(initChatList())
    }
}

export const SET_ONLINELIST = 'SET_ONLINELIST'   //设置在线列表
export function setOnlinelist(onlineList) {
    return {
        type: SET_ONLINELIST,
        onlineList
    }
}

//异步action
export function initChatList() {
    return async function (dispatch) {
        const res = await json.get('/chat/list')
        dispatch(setChatList(res.data || []))
    }
}

export const SET_CHATLIST = 'SET_CHATLIST'
export function setChatList(chatList) {
    return {
        type: SET_CHATLIST,
        chatList
    }
}

export const ADD_CHAT = 'ADD_CHAT'
export function addChat(chat) {
    return {
        type: ADD_CHAT,
        chat
    }
}