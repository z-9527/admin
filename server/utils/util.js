const CryptoJS = require('crypto-js')
const crypto = require('crypto') //这是node自带的
const {FRONT_SECRETKEY,BACKEND_SECRETKEY} = require('../config/secret')

/**
 * 前端加密函数，加密同一个字符串生成的都不相同,加密/解密秘钥必须和前端的相同
 * @param {*} str 
 */
 function encrypt(str){
    return CryptoJS.AES.encrypt(JSON.stringify(str), FRONT_SECRETKEY).toString();
}

/**
 * 前端解密函数
 * @param {*} str 
 */
 function decrypt(str){
    const bytes  = CryptoJS.AES.decrypt(str, FRONT_SECRETKEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

/**
 * md5 加密
 * @param {*} content 
 */
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

/**
 * 后端及加密函数，加密同一个字符串每次结果相同，可存数据库
 * @param {*} password 
 */
function genPassword(password) {
    const str = `password=${password}&key=${BACKEND_SECRETKEY}`
    return md5(str)
}

module.exports = {
    encrypt,
    decrypt,
    genPassword
}
