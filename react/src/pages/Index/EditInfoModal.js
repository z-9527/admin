import React from 'react'
import { Modal, Form, Upload, Icon, message, Input, Radio, DatePicker, Alert } from 'antd'
import { isAuthenticated, authenticateSuccess } from '../../utils/session'
import moment from 'moment'
import { json } from '../../utils/ajax'
import { setUser, initWebSocket } from '../../store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createFormField } from '../../utils/util'


const RadioGroup = Radio.Group;

const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket }),
    (dispatch) => bindActionCreators({ setUser, initWebSocket }, dispatch)
)
const form = Form.create({
    /**
     * 表单回显
     * @param {*} props 
     */
    mapPropsToFields(props) {
        const user = props.user
        return createFormField({
            ...user,
            birth: user.birth ? moment(user.birth) : null
        })
    }
})

@store @form
class EditInfoModal extends React.Component {
    state = {
        uploading: false
    }
    /**
     * 关闭模态框
     */
    handleCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    /**
     * 模态框的确定按钮
     */
    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.onUpdate(values)
            }
        });
    }
    /**
     * 更新用户信息
     */
    onUpdate = async (values) => {
        const param = {
            ...values,
            birth: values.birth && moment(values.birth).valueOf()
        }
        const res = await json.post('/user/update', param)
        if (res.status === 0) {
            //修改localStorage，为什么我们在redux中保存了用户信息还要在localStorage中保存？redux刷新就重置了，我们需要username重新去后台获取
            localStorage.setItem('username', values.username)
            //修改cookie
            authenticateSuccess(res.data.token)
            //修改redux中的user信息
            this.props.setUser(res.data)
            //修改websocket中的user信息
            if (this.props.websocket.readyState !== 1) {
                this.props.initWebSocket(res.data)
            } else {
                this.props.websocket.send(JSON.stringify({
                    id: res.data.id,
                    username: res.data.username,
                    avatar: res.data.avatar
                }))
            }
            message.success('修改信息成功')
            this.handleCancel()
        }
    }
    /**
     * 转换上传组件表单的值
     */
    _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    }
    render() {
        const { uploading } = this.state
        const { visible } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

        const avatar = getFieldValue('avatar')

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        const uploadProps = {
            name: "avatar",
            listType: "picture-card",
            headers: {
                Authorization: `Bearer ${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?isImg=1`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploading: false
                    })
                    message.success('上传头像成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    })
                    message.error(info.file.response.message || '上传头像失败')
                }
            }
        }
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                centered
                title="编辑个人信息">
                <div style={{ height: '60vh', overflow: 'auto' }}>
                    <Form>
                        <Form.Item label={'头像'} {...formItemLayout}>
                            {getFieldDecorator('avatar', {
                                rules: [{ required: true, message: '请上传用户头像' }],
                                getValueFromEvent: this._normFile,     //将上传的结果作为表单项的值（用normalize报错了，所以用的这个属性）
                            })(
                                <Upload {...uploadProps} style={styles.avatarUploader}>
                                    {avatar ? <img src={avatar} alt="avatar" style={styles.avatar} /> : <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />}
                                </Upload>
                            )}
                        </Form.Item>
                        <Form.Item label={'用户名'} {...formItemLayout}>
                            {getFieldDecorator('username', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '用户名不能为空' },
                                    { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                    { min: 3, message: '用户名至少为3位' }
                                ]
                            })(
                                <Input placeholder="请输入用户名" />
                            )}
                        </Form.Item>
                        <Form.Item label={'出生年月日'} {...formItemLayout}>
                            {getFieldDecorator('birth', {
                                // rules: [{ required: true, message: '请选择出生年月日' }],
                            })(
                                <DatePicker />
                            )}
                        </Form.Item>
                        <Form.Item label={'电话'} {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                // rules: [{ required: true, message: '请输入电话号码' }, { pattern: /^[0-9]*$/, message: '请输入正确的电话号码' }],
                            })(
                                <Input placeholder="请输入电话号码" />
                            )}
                        </Form.Item>
                        <Form.Item label={'所在地'} {...formItemLayout}>
                            {getFieldDecorator('location', {
                                validateFirst: true,
                                // rules: [{ required: true, message: '请输入目前所在地' }],
                            })(
                                <Input placeholder="请输入目前所在地" />
                            )}
                        </Form.Item>
                        <Form.Item label={'性别'} {...formItemLayout}>
                            {getFieldDecorator('gender', {
                                initialValue: '男',
                                // rules: [{ required: true, message: '请选择性别' }],
                            })(
                                <RadioGroup>
                                    <Radio value={'男'}>男</Radio>
                                    <Radio value={'女'}>女</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Alert message={"注：此信息仅为项目模拟数据，无其他用途"} type="info" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }
}

const styles = {
    avatarUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    avatar: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}


export default EditInfoModal