import React from 'react'
import { Form, Input } from 'antd'

class RegisterForm extends React.Component {
    state = {
        focusItem: -1   //当前焦点聚焦在哪一项上
    }
    backLogin = ()=>{
        this.props.toggleShow()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { focusItem } = this.state
        return (
            <div>
                <h3 className="title">管理员注册</h3>
                <Form>
                    <Form.Item
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('username', {

                        })(
                            <Input
                                className="myInput"
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('password', {

                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 1 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 35 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('confirmPassword', {

                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 2 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                placeholder="确认密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                    <div className="btn-box">
                            <div className="loginBtn">注册</div>
                            <div className="registerBtn" onClick={this.backLogin}>返回登录</div>
                        </div>
                    </Form.Item>
                </Form>
                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default Form.create()(RegisterForm)