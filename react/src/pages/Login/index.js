import React from 'react'
import Background from '@/components/Background'
import './style.less'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

class Login extends React.Component {
    state = {
        show: 'login'    //当前展示的是登录框还是注册框
    }

    toggleShow = () => {
        this.setState({
            show: this.state.show === 'login' ? 'register' : 'login'
        })
    }
    render() {
        const { show } = this.state
        return (
            <Background>
                <div className="login-container">
                    <div className={`box ${show === 'login' ? 'active' : ''}`}>
                        <LoginForm toggleShow={this.toggleShow}/>
                    </div>
                    <div className={`box ${show === 'register' ? 'active' : ''}`}>
                        <RegisterForm toggleShow={this.toggleShow}/>
                    </div>
                </div>
            </Background>
        )
    }
}

export default Login