import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd'
import { encrypt } from '../../utils/util'
import { post } from '../../utils/ajax'

@Form.create()
class CreateUserModal extends Component {
    state = {}
    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onRegister(values)
            }
        })
    }
    onRegister = async (values) => {
        //加密密码
        const ciphertext = encrypt(values.password)
        const res = await post('/user/register', {
            username: values.username,
            password: ciphertext,
        })
        if (res.status === 0) {
            message.success('注册成功')
            this.props.onRegister()     //注册成功后，要刷新外面的数据
            this.onCancel()
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
                onCancel={this.onCancel}
                visible={visible}
                title='新增用户'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'用户名'}>
                        {getFieldDecorator('username', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '用户名不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '用户名至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入用户名' />
                        )}
                    </Form.Item>

                    <Form.Item label={'密码'}>
                        {getFieldDecorator('password', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '密码不能为空' },
                                { pattern: '^[^ ]+$', message: '密码不能有空格' },
                                { min: 3, message: '密码至少为3位' },
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder="请输入密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'确认密码'}>
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
        );
    }
}

export default CreateUserModal;