import React from 'react'
// import './style.less'   //没有设置模块化所以这里可以不用引，index中已经引入了

class LoginForm extends React.Component{
    render(){
        return (
            <div>
                <h3 className="title">管理员登录</h3>

                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default LoginForm