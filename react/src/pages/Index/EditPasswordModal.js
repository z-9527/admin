import React from 'react'
import { Modal, Input, Form, message } from 'antd'
import { connect } from 'react-redux'
import { createFormField, encrypt } from '../../utils/util'
import { json } from '../../utils/ajax'

const store = connect(
    (state) => ({ user: state.user }),
)
const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        const user = props.user
        return createFormField({
            username: user.username
        })
    }
})

@store @form
class EditPasswordModal extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    /**
     * 模态框的确定按钮
     */
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onSubmit(values)
            }
        });
    }
    /**
     * 提交修改密码
     */
    onSubmit = async (values) => {
        //加密密码
        const ciphertext = encrypt(values.oldPassword)
        const res = await json.post('/user/login', {
            username: values.username,
            password: ciphertext
        })
        if (res.status === 0) {
            const ciphertext2 = encrypt(values.password)
            const res2 = await json.post('/user/update', {
                username: values.username,
                password: ciphertext2
            })
            if (res2.status === 0) {
                message.success('修改密码成功')
                this.handleCancel()
            }
        }
    }

    render() {
        const { visible } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                centered
                title="修改密码">
                <Form>
                    <Form.Item label={'用户名'} {...formItemLayout}>
                        {getFieldDecorator('username', {})(
                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item label={'旧密码'} {...formItemLayout}>
                        {getFieldDecorator('oldPassword', {
                            rules: [{ required: true, message: '请输入旧密码' }],
                        })(
                            <Input
                                placeholder="请输入旧密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'新密码'} {...formItemLayout}>
                        {getFieldDecorator('password', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '密码不能为空' },
                                { pattern: '^[^ ]+$', message: '密码不能有空格' },
                                { min: 3, message: '密码至少为3位' },
                            ]
                        })(
                            <Input
                                placeholder="请输入新密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'确认密码'} {...formItemLayout}>
                        {getFieldDecorator('confirmPassword', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请确认密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value !== getFieldValue('password')) {
                                            callback('两次输入不一致！')
                                        }
                                        callback()
                                    }
                                },
                            ]
                        })(
                            <Input
                                onPressEnter={this.handleOk}
                                placeholder="请确认密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default EditPasswordModal