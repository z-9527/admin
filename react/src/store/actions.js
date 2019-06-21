import {json} from '../utils/ajax'

export const SET_USER = 'SET_USER'
export function setUser(user){
    return {
        type:SET_USER,
        user
    }
}

export const GET_USER = 'GET_USER'
export function getUser (param){
    return async function (dispatch){
        const res = await json.get('/user/getUser',param)
        dispatch(setUser(res.data || {}))
    }
}
