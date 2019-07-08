import React, { Component } from 'react';
import { message, Avatar, Divider } from 'antd'
import { initChatList, initWebSocket } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isAuthenticated } from '../../utils/session'
import { json } from '../../utils/ajax'
import { replaceImg } from '../../utils/util'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './style.less'

const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket, chatList: state.chatList, onlineList: state.onlineList }),
    (dispatch) => bindActionCreators({ initChatList, initWebSocket }, dispatch)
)

@store
class Chat extends Component {
    state = {
        editorState: BraftEditor.createEditorState(null),
        userList: [], //所有用户列表
    }
    componentDidMount() {
        if (this.props.websocket && this.props.websocket.readyState !== 1) {
            this.props.initWebSocket(this.props.user)
        }
        this.chatListDom.scrollTop = this.chatListDom.scrollHeight
        this.getUserList()
    }
    //首次渲染不会执行此方法
    componentDidUpdate(prevProps) {
        if (this.props.chatList !== prevProps.chatList) {
            this.chatListDom.scrollTop = this.chatListDom.scrollHeight
        }
        if (this.props.onlineList !== prevProps.onlineList) {
            this.handleUserList()
        }
        if (this.props.user !== prevProps.user) {
            this.getUserList()      
            this.props.initChatList()
        }
    }
    /**
     * 获取所有用户列表
     */
    getUserList = async () => {
        const res = await json.get('/user/getAllUsers')
        await this.setState({
            userList: res.data || []
        })
        this.handleUserList()
    }
    /**
     * 处理用户列表(管理员、在线用户放在数组前面)
     */
    handleUserList = () => {
        const userList = this.state.userList
        const onlineList = this.props.onlineList
        let list1 = []
        let list2 = []
        let list3 = []
        for (let item of userList) {
            const isHave = onlineList.find(i => i.id === item.id)
            const user = {
                ...item,
                online: !!isHave
            }
            if (item.isAdmin) {
                list1.push(user)
            } else if (!!isHave) {
                list2.push(user)
            } else {
                list3.push(user)
            }
        }
        this.setState({
            userList: list1.concat(list2, list3)
        })
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
        const { editorState, userList } = this.state
        const { chatList, user, onlineList } = this.props
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
                const pattern = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-.,@?^=%&:/~+#]*)+)?$/
                if (pattern.test(href)) {
                    return { href, target }
                }
                message.warning('请输入正确的网址')
                return false
            }
        }
        const lastChat = chatList[chatList.length - 1] || {}
        return (
            <div className='chat-container'>
                <div className='chat-box'>
                    <div className='chat-header'>头部</div>
                    <div className='chat-body'>
                        <div className='left'>
                            <div className='left-item'>
                                <div><Avatar size='large' src='https://www.runoob.com/wp-content/uploads/2016/02/react.png' /></div>
                                <div className='left-item-text'>
                                    <div className='group-name'>聊天室01</div>
                                    <div className='group-message' style={{ display: lastChat.userId ? 'flex' : 'none' }}>
                                        <div style={{flexFlow:1,flexShrink:0}}>{lastChat.username}:&nbsp;</div>
                                        <div className='ellipsis' dangerouslySetInnerHTML={{ __html: replaceImg(lastChat.content) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <div style={{ height: 162 }}>
                                <div style={{ padding: 5 }}>群公告</div>
                                <div style={styles.center}>
                                    <img src={require('./imgs/zanwu.png')} alt="" style={{ width: '80%' }} />
                                </div>
                                <Divider style={{ margin: '10px 0 0' }} />
                                <div className='member'>成员 {onlineList.length}/{userList.length}</div>
                            </div>
                            <div style={{ overflow: 'auto', flexGrow: 1, height: 0 }}>
                                {userList && userList.map(item => (
                                    <div key={item.id} className='user-item'>
                                        <div className={`avatar-box ${item.online ? '' : 'mask'}`}>
                                            <img style={{ width: '100%', height: '100%' }} src={item.avatar} alt="" />
                                            <div />
                                        </div>
                                        <div className='ellipsis' style={{ flexGrow: 1, margin: '0 3px 0 5px' }}>{item.username}</div>
                                        <div style={{ display: item.isAdmin ? 'block' : 'none' }}><img width={18} height={20} src={require('./imgs/administrator.png')} alt="" /></div>
                                    </div>
                                ))}
                            </div>
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
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}

export default Chat;