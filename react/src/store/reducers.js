import { combineReducers } from 'redux'
import { SET_USER, SET_WEBSOCKET, SET_ONLINELIST, SET_CHATLIST, ADD_CHAT } from './actions'

/**
 * 用户信息
 * @param {*} state 
 * @param {*} action 
 */
function user(state = {}, action) {
    switch (action.type) {
        case SET_USER: {
            return action.user
        }
        default:
            return state
    }
}

/**
 * websocket对象
 * @param {*} state 
 * @param {*} action 
 */
function websocket(state = null, action) {
    switch (action.type) {
        case SET_WEBSOCKET: {
            return action.websocket
        }
        default:
            return state
    }
}

/**
 * 在线列表
 * @param {*} state 
 * @param {*} action 
 */
function onlineList(state = [], action) {
    switch (action.type) {
        case SET_ONLINELIST: {
            return action.onlineList
        }
        default:
            return state
    }
}

/**
 * 聊天记录
 * @param {*} state 
 * @param {*} action 
 */
function chatList(state = [], action) {
    switch (action.type) {
        case SET_CHATLIST: {
            return action.chatList
        }
        case ADD_CHAT: {
            return [...state, action.chat]
        }
        default:
            return state
    }
}


const rootReducer = combineReducers({
    user,
    websocket,
    onlineList,
    chatList
})

export default rootReducer 