import CryptoJS from 'crypto-js'
import { SECRETKEY } from '../config/secret'
import { Form } from 'antd'

/**
 * 防抖函数
 * @param {*} func 
 * @param {*} wait 
 */
export function debounce(func, wait = 500) {
    let timeout;  // 定时器变量
    return function (event) {
        clearTimeout(timeout);  // 每次触发时先清除上一次的定时器,然后重新计时
        event.persist && event.persist()   //保留对事件的引用
        timeout = setTimeout(() => {
            func(event)
        }, wait);  // 指定 xx ms 后触发真正想进行的操作 handler
    };
}

/**
 * 节流函数
 * @param {*} func 
 * @param {*} interval 
 */
export function throttle(func, interval = 100) {
    let timeout;
    let startTime = new Date();
    return function (event) {
        event.persist && event.persist()   //保留对事件的引用
        clearTimeout(timeout);
        let curTime = new Date();
        if (curTime - startTime <= interval) {
            //小于规定时间间隔时，用setTimeout在指定时间后再执行
            timeout = setTimeout(() => {
                func(event);
            }, interval)
        } else {
            //重新计时并执行函数
            startTime = curTime;
            func(event)
        }
    }
}

/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 加密函数，加密同一个字符串生成的都不相同
 * @param {*} str 
 */
export function encrypt(str) {
    return CryptoJS.AES.encrypt(JSON.stringify(str), SECRETKEY).toString();
}

/**
 * 解密函数
 * @param {*} str 
 */
export function decrypt(str) {
    const bytes = CryptoJS.AES.decrypt(str, SECRETKEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

/**
 * 判断是否是对象
 * @param {*} obj 
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 创建表单回显的对象
 * @param {*} obj 
 */
export function createFormField(obj) {
    let target = {}
    if (isObject(obj)) {
        for (let [key, value] of Object.entries(obj)) {
            target[key] = Form.createFormField({
                value
            })
        }
    }
    return target
}

/**
 * 将img标签转换为【图片】
 * @param {string} str 
 */
export function replaceImg(str){
    if(typeof str === 'string'){
        str = str.replace(/<img(.*?)>/g, "[图片]")
    }
    return str
}

/**
 * 图片预加载
 * @param arr
 * @constructor
 */
export function preloadingImages(arr) {
    if(Array.isArray(arr)){
        arr.forEach(item=>{
            const img = new Image()
            img.src = item
          })
    }
  }