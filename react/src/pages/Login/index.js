import React from 'react'
import './style.less'
import { isAuthenticated, logout } from '../../utils/session'
import { withRouter } from 'react-router-dom'
import LoadableComponent from '@/utils/LoadableComponent'
import { preloadingImages } from '../../utils/util'

const LoginForm = LoadableComponent(import('./LoginForm'))
const RegisterForm = LoadableComponent(import('./RegisterForm'))
const Background = LoadableComponent(import('@/components/Background'))

const imgs = [
    `${process.env.REACT_APP_BASE_URL}/public/images/bg1.jpg`,
    `${process.env.REACT_APP_BASE_URL}/public/images/bg2.jpg`,
    `${process.env.REACT_APP_BASE_URL}/public/images/bg3.jpg`,
]


@withRouter
class Login extends React.Component {
    state = {
        show: 'login'    //当前展示的是登录框还是注册框
    }

    componentDidMount() {
        // 防止用户通过浏览器的前进后退按钮来进行路由跳转
        // 当用户登陆后再通过浏览器的后退按钮回到登录页时，再点击前进按钮可以直接回到首页
        if (!!isAuthenticated()) {
            this.props.history.go(1)   //不然他后退或者后退了直接登出
            // logout()
        }
        preloadingImages(imgs)
    }
    /**
     * 切换登录和注册的面板
     */
    toggleShow = () => {
        this.setState({
            show: this.state.show === 'login' ? 'register' : 'login'
        })
    }
    render() {
        const { show } = this.state
        return (
            <Background url={`${process.env.REACT_APP_BASE_URL}/public/images/login_bg1.jpg`}>
                <div className="login-container">
                    <div className={`box ${show === 'login' ? 'active' : ''}`}>
                        <LoginForm toggleShow={this.toggleShow} />
                    </div>
                    <div className={`box ${show === 'register' ? 'active' : ''}`}>
                        <RegisterForm toggleShow={this.toggleShow} />
                    </div>
                </div>
            </Background>
        )
    }
}

export default Login