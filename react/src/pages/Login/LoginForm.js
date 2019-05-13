import React from 'react'
// import './style.less'   //没有设置模块化所以这里可以不用引，index中已经引入了
import { Form, Input, Row, Col } from 'antd'
import { randomNum } from '@/utils/util'


class LoginForm extends React.Component {
    state = {
        focusItem: -1,   //当前焦点聚焦在哪一项上
        code: ''  //验证码
    }
    componentDidMount() {
        this._createCode()
    }

    onRegister = () => {
        this.props.toggleShow()
    }
    /**
     * 生成验证码
     */
    _createCode = () => {
        const ctx = this.canvas.getContext('2d')
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        let code = ''
        ctx.clearRect(0, 0, 80, 40)
        for (let i = 0; i < 4; i++) {
            const char = chars[randomNum(0, 57)]
            code += char
            ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
            ctx.fillStyle = '#D3D7F7'
            ctx.textBaseline = 'middle'
            ctx.shadowOffsetX = randomNum(-3, 3)
            ctx.shadowOffsetY = randomNum(-3, 3)
            ctx.shadowBlur = randomNum(-3, 3)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            let x = 80 / 5 * (i + 1)
            let y = 40 / 2
            let deg = randomNum(-25, 25)
            /**设置旋转角度和坐标原点**/
            ctx.translate(x, y)
            ctx.rotate(deg * Math.PI / 180)
            ctx.fillText(char, 0, 0)
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180)
            ctx.translate(-x, -y)
        }
        this.setState({
            code
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { focusItem } = this.state
        return (
            <div>
                <h3 className="title">管理员登录</h3>
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
                        style={{ marginBottom: 20 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-securityCode-b' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {

                                })(
                                    <Input
                                        className="myInput"
                                        onFocus={() => this.setState({ focusItem: 2 })}
                                        onBlur={() => this.setState({ focusItem: -1 })}
                                        placeholder="验证码"
                                    />
                                )}
                            </Col>
                            <Col span={9}>
                                <canvas onClick={this._createCode} width="80" height='40' ref={el => this.canvas = el} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn">登录</div>
                            <div className="registerBtn" onClick={this.onRegister}>注册</div>
                        </div>
                    </Form.Item>
                </Form>

                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default Form.create()(LoginForm)