import { createBrowserHistory } from 'history'


const env = process.env.NODE_ENV  // 环境参数
let options = {}
if (env === 'production') {
    options.basename = '/admin'    
}


export default createBrowserHistory(options)