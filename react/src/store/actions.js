import { json } from '../utils/ajax'
import { notification } from 'antd'

// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER'
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}

export const GET_USER = 'GET_USER'
export function getUser(param) {
    return async function (dispatch) {
        const res = await json.get('/user/getUser', param)
        dispatch(setUser(res.data || {}))
    }
}

export const SET_WEBSOCKET = 'SET_WEBSOCKET'
export function setWebsocket(websocket) {
    return {
        type: SET_WEBSOCKET,
        websocket
    }
}
export function initWebSocket(user) {
    return async function (dispatch) {
        const websocket = new WebSocket("ws://" + window.location.hostname + ":8081")
        websocket.onopen = function () {
            websocket.send(JSON.stringify(user))
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
            console.log(11, data)
        }
        dispatch(setWebsocket(websocket))
    }
}

export const SET_ONLINELIST = 'SET_ONLINELIST'
export function setOnlinelist(onlineList) {
    return {
        type: SET_ONLINELIST,
        onlineList
    }
}