import React from 'react'
import { Modal } from 'antd'

class EditInfoModal extends React.Component {
    state = {
        visible: false
    }
    handleCancel = () => {
        this.toggleVisible(false)
    }
    handleOk = () => {
        this.handleCancel()
    }
    toggleVisible = (visible)=>{
        this.setState({
            visible
        })
    }
    render() {
        const { visible } = this.state
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                title="编辑个人信息">


            </Modal>
        )
    }
}

export default EditInfoModal