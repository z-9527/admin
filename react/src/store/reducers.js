import { combineReducers } from 'redux'
import { SET_USER, SET_WEBSOCKET, SET_ONLINELIST } from './actions'

function user(state = {}, action) {
    switch (action.type) {
        case SET_USER: {
            return action.user
        }
        default:
            return state
    }
}

function websocket(state = null, action) {
    switch (action.type) {
        case SET_WEBSOCKET: {
            return action.websocket
        }
        default:
            return state
    }
}

function onlineList(state = [], action) {
    switch (action.type) {
        case SET_ONLINELIST: {
            return action.onlineList
        }
        default:
            return state
    }
}



const rootReducer = combineReducers({
    user,
    websocket,
    onlineList
})

export default rootReducer 