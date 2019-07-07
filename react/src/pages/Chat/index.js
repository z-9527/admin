import React, { Component } from 'react';
import { message } from 'antd'
import { getUser, initWebSocket } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './style.less'

const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket, chatList: state.chatList }),
    (dispatch) => bindActionCreators({ getUser, initWebSocket }, dispatch)
)

@store
class Chat extends Component {
    state = {
        editorState: BraftEditor.createEditorState(null)
    }
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    //定制键盘命令
    handleKeyCommand = (command) => {
        //如果是回车命名就发送信息
        if (command === 'split-block') {
            this.onSend()
            return 'handled';
        }
        return 'not-handled';
    }
    onSend = () => {
        const editorState = this.state.editorState
        const htmlContent = editorState.toHTML()
        const websocket = this.props.websocket
        if (editorState.isEmpty()) {
            return message.warning('请先输入聊天内容')
        }
        if (websocket.readyState !== 1) {
            //断开连接，重新连接
            this.props.initWebSocket(this.props.user)
            return message.warning('消息发送失败，请重新发送')
        }
        websocket.send(JSON.stringify({
            content: htmlContent
        }))
        this.setState({
            editorState: BraftEditor.createEditorState(null)
        })
    }
    render() {
        const { editorState } = this.state
        const { chatList } = this.props
        const controls = ['emoji', 'italic', 'text-color', 'separator', 'link', 'separator', 'media']
        return (
            <div className='chat-container'>
                <div className='chat-box'>
                    <div className='chat-header'>头部</div>
                    <div className='chat-body'>
                        <div className='left'></div>
                        <div className='main'>
                            <div className='chat-list'>
                                {chatList && chatList.map((item,index)=>(
                                    <div key={index}>
                                        {item.content}
                                    </div>
                                ))}
                            </div>
                            <div className='chat-editor-wrapper'>
                                <BraftEditor
                                    draftProps={{
                                        handleKeyCommand: this.handleKeyCommand
                                    }}
                                    value={editorState}
                                    onChange={this.handleEditorChange}
                                    contentStyle={styles.contentStyle}
                                    controlBarStyle={styles.controlBarStyle}
                                    controls={controls}
                                />
                            </div>
                        </div>
                        <div className='right'>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const styles = {
    contentStyle: {
        height: 100,
        paddingBottom: 0,
        transform: 'translateY(-15px)',
        fontSize: 14
    },
    controlBarStyle: {
        boxShadow: 'none'
    }
}

export default Chat;