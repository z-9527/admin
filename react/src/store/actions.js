import {json} from '../utils/ajax'
// 实际上用户信息完全可以保存在localStorage中，这里我是为了学习和使用redux才将用户信息保存在这里的
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
