import React from 'react'
import { Modal, Input, Form } from 'antd'

@Form.create()
class EditPasswordModal extends React.Component {
    state = {
        visible: false
    }
    handleCancel = () => {
        this.props.form.resetFields()
        this.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleCancel()
            }
        });
    }
    toggleVisible = (visible) => {
        this.setState({
            visible
        })
    }

    render() {
        const { visible } = this.state
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
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'新密码'} {...formItemLayout}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入新密码' }],
                        })(
                            <Input
                                placeholder="请输入新密码"
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
                                placeholder="请确认密码"
                                type={'password'} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default EditPasswordModal