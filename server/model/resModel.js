class SuccessModel{
    constructor({data,message}){
        this.status = 0
        this.httpCode = 200
        this.message = message || '请求成功'
        this.data = data || {}
    }
}
class ErrorModel{
    constructor({message,httpCode}){
        this.status = 1
        this.httpCode = httpCode || 500
        this.message = message || '网络错误'
    }
}


module.exports = {
    SuccessModel,
    ErrorModel
}