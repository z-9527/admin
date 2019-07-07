import React, { Component } from 'react';
import { message, Avatar } from 'antd'
import { getUser, initWebSocket } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isAuthenticated } from '../../utils/session'
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
    componentDidMount() {
        if (this.props.websocket && this.props.websocket.readyState !== 1) {
            this.props.initWebSocket(this.props.user)
        }
        this.chatListDom.scrollTop = this.chatListDom.scrollHeight
    }
    //首次渲染不会执行此方法
    componentDidUpdate(prevProps) {
        if (this.props.chatList !== prevProps.chatList) {
            this.chatListDom.scrollTop = this.chatListDom.scrollHeight
        }
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
    myUploadFn = async (param) => {
        const formData = new FormData();
        formData.append('file', param.file);
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/upload?fileType=chat`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${isAuthenticated()}`,
            },
            body: formData
        }).then(response => response.json())

        if (res.status === 0) {
            param.success(res.data)
        } else {
            param.error({
                msg: '上传错误'
            })
        }
    }
    render() {
        const { editorState } = this.state
        const { chatList, user } = this.props
        const controls = ['emoji', 'italic', 'text-color', 'separator', 'link', 'separator', 'media']
        // 禁止上传video、audio
        const media = {
            uploadFn: this.myUploadFn,
            accepts: {
                image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                video: false,
                audio: false
            },
            externals: {
                image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                video: false,
                audio: false,
                embed: false
            }
        }
        const hooks = {
            'toggle-link': ({ href, target }) => {
                const pattern = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
                if (pattern.test(href)) {
                    return { href, target }
                }
                message.warning('请输入正确的网址')
                return false
            }
        }
        return (
            <div className='chat-container'>
                <div className='chat-box'>
                    <div className='chat-header'>头部</div>
                    <div className='chat-body'>
                        <div className='left'></div>
                        <div className='main'>
                            <div className='chat-list' ref={el => this.chatListDom = el}>
                                {chatList && chatList.map((item, index) => (
                                    <div key={index} className='chat-item'>
                                        <div></div>
                                        <div className={`chat-item-info ${user.id === item.userId ? 'chat-right' : ''}`}>
                                            <div><Avatar src={item.userAvatar} /></div>
                                            <div className='chat-main'>
                                                <div className='username'>{item.username}</div>
                                                <div className='chat-content' dangerouslySetInnerHTML={{ __html: item.content }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='chat-editor-wrapper'>
                                <BraftEditor
                                    draftProps={{
                                        handleKeyCommand: this.handleKeyCommand
                                    }}
                                    media={media}
                                    hooks={hooks}
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