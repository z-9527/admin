import 'whatwg-fetch'
import { message } from 'antd'
import { logout } from '../utils/session'
import history from './history'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

/**
 * 处理url
 * @param url
 * @param param
 * @returns {*}
 */
function handleURL(url, param) {
    let completeUrl = ''
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    if (param) {
        if (completeUrl.indexOf('?') === -1) {
            completeUrl = `${completeUrl}?${ObjToURLString(param)}`
        } else {
            completeUrl = `${completeUrl}&${ObjToURLString(param)}`
        }
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 * @constructor
 */
function ObjToURLString(param) {
    let str = ''
    if (Object.prototype.toString.call(param) === '[object Object]') {
        const list = Object.entries(param).map(item => {
            return `${item[0]}=${item[1]}`
        })
        str = list.join('&')
    }
    return str
}

export async function get(url, param) {
    const completeUrl = handleURL(url, param)
    const response = await fetch(completeUrl, {
        credentials: 'include',
        xhrFields: {
            withCredentials: true       //跨域
        },
    })
    const reslut = await response.json()
    if (!response.ok) {
        if(response.status === 401){
            logout()
            history.push('/login')
        }
        message.error(reslut.message || '网络错误')
    }
    return reslut
   
}

export async function post(url, parma) {
    let completeUrl = ''
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    const response = await fetch(completeUrl, {
        credentials: 'include',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parma),
    })
    const reslut = await response.json()
    if (!response.ok) {
        if(response.status === 401){
            logout()
            history.push('/login')
        }
        message.error(reslut.message || '网络错误')
    }
    return reslut
}

export const json = {
    get,
    post
}
