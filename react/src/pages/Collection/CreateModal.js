import React, { Component } from 'react';
import { Form, Input, Modal, Icon, } from 'antd'
import { json } from '../../utils/ajax'
import { connect } from 'react-redux'

const { TextArea } = Input;

const store = connect(
    (state) => ({ user: state.user })
)

@store @Form.create()
class CreateModal extends Component {
    state = {}
    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    onOk = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                this.onCreate(values)
            }
        })
    }
    onCreate = async (values) => {
        const res = await json.post('/works/create', values)
        if (res.status === 0) {
            this.props.onCreated()  //更新外面的数据
            this.onCancel()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                visible={this.props.visible}
                title='新增作品(仅管理员)'
                centered
                onCancel={this.onCancel}
                okButtonProps={{ disabled: !this.props.user.isAdmin }}
                onOk={this.onOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'项目名称'}>
                        {getFieldDecorator('title', {
                            rules: [
                                { required: true, message: '请输入项目名称' },
                            ]
                        })(
                            <Input placeholder='请输入项目名称' />
                        )}
                    </Form.Item>
                    <Form.Item label={'项目描述'}>
                        {getFieldDecorator('description', {
                            rules: [
                                { required: true, message: '请输入项目描述' },
                            ]
                        })(
                            <TextArea placeholder='请输入项目描述' />
                        )}
                    </Form.Item>
                    <Form.Item label={'预览地址'}>
                        {getFieldDecorator('url', {
                            rules: [
                                { required: true, message: '请输入项目预览地址' },
                                { type: 'url', message: '请输入正确的网址' }
                            ]
                        })(
                            <Input placeholder='请输入项目预览地址' />
                        )}
                    </Form.Item>
                    <Form.Item label={<span><Icon type="github" /> 地址</span>}>
                        {getFieldDecorator('githubUrl', {
                            rules: [
                                { required: true, message: '请输入项目github地址' },
                                { type: 'url', message: '请输入正确的网址' }
                            ]
                        })(
                            <Input placeholder='请输入项目github地址' />
                        )}
                    </Form.Item>
                </Form>

            </Modal>
        );
    }
}

export default CreateModal;