import React from 'react'
import { Modal, Form, Upload, Icon, message } from 'antd'

class EditInfoModal extends React.Component {
    state = {
        visible: false,
        uploading: false
    }
    handleCancel = () => {
        this.toggleVisible(false)
    }
    handleOk = () => {
        this.handleCancel()
    }
    toggleVisible = (visible) => {
        this.setState({
            visible
        })
    }
    render() {
        const { visible } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form

        let avatar = getFieldValue('avatar')
        avatar = avatar && avatar.url

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        const uploadProps = {
            name: "avatar",
            listType: "picture-card",
            action: 'http://localhost:8888/upload?isImg=1',
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
                    message.error('上传头像失败')
                }
            }
        }
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                title="编辑个人信息">
                <Form>
                    <Form.Item label={'头像'} {...formItemLayout}>
                        {getFieldDecorator('avatar', {
                            rules: [{ required: true, message: '请上传用户头像' }],
                            getValueFromEvent: (info) => info.file.response,     //将上传的结果作为表单项的值（用normalize报错了，所以用的这个）
                        })(
                            <Upload {...uploadProps} style={styles.avatarUploader}>
                                {avatar ? <img src={avatar} alt="avatar" style={styles.avatar} /> : <Icon style={styles.icon} type={'plus'} />}
                            </Upload>
                        )}
                    </Form.Item>
                </Form>


            </Modal>
        )
    }
}

const styles = {
    avatarUploader: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
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


export default Form.create()(EditInfoModal)