import React, { Component } from 'react';
import { Form, Input, Modal, Icon, } from 'antd'

const { TextArea } = Input;

@Form.create()
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
        console.log(values)
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
                title='新增作品'
                centered
                onCancel={this.onCancel}
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
                            ]
                        })(
                            <Input placeholder='请输入项目预览地址' />
                        )}
                    </Form.Item>
                    <Form.Item label={<span><Icon type="github" /> 地址</span>}>
                        {getFieldDecorator('githubUrl', {
                            rules: [
                                { required: true, message: '请输入项目github地址' },
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