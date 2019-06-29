import React, { Component } from 'react';
import { Comment, Divider, Button, Card, message, Tooltip, Icon, Input } from 'antd'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import './style.less'
import { json } from '../../utils/ajax'
import moment from 'moment'
import { isAuthenticated } from '../../utils/session'

const TextArea = Input.TextArea

function createMarkup(html) {
    return { __html: html };
}

class MessageBoard extends Component {
    state = {
        editorState: BraftEditor.createEditorState(null),   //留言内容
        messages: [],   //留言列表
        isShowEditor: false,
        replyPid: '',//回复第几条的父级id
        replyContent: '',  //回复内容
        replyUser: null //回复的对象
    }
    componentDidMount() {
        this.getMessages()
    }
    /**
     * 留言输入框的onChange
     */
    handleMessageChange = (editorState) => {
        this.setState({
            editorState
        })
    }
    /**
     * 回复输入框的onChange
     */
    handleReplyChange = (e) => {
        this.setState({
            replyContent: e.target.value
        })
    }
    /**
     * 清空留言框
     */
    clearContent = () => {
        this.setState({
            editorState: ContentUtils.clear(this.state.editorState)
        })
    }
    /**
     * 关闭留言框
     */
    closeMessage = () => {
        this.setState({
            isShowEditor: false
        })
        this.clearContent()
    }
    /**
     * 获取留言列表
     */
    getMessages = async () => {
        const res = await json.get('/message/list')
        console.log(1111, res)
        this.setState({
            messages: res.data || []
        })
    }
    /**
     * 留言
     */
    sendMessage = async () => {
        const editorState = this.state.editorState
        if (editorState.isEmpty()) {
            message.warning('请先输入内容')
            return
        }
        const htmlContent = this.state.editorState.toHTML()
        console.log(222, htmlContent)
        const res = await json.post('/message/create', {
            content: htmlContent
        })
        if (res.status === 0) {
            message.success('留言成功')
            this.clearContent()
            this.getMessages()
        }
    }
    /**
     * 展开回复的textarea
     * @param {object} item 当前回复的对象
     * @param {number} pid  回复的父级id
     */
    showReply = (item, pid) => {
        this.setState({
            replyPid: pid,
            replyContent: '',
            replyUser: item
        })
    }
    /**
     * 关闭回复的texttarea
     */
    closeReply = () => {
        this.setState({
            replyPid: '',
            replyContent: '',
            replyUser: ''
        })
    }
    /**
     * 确认回复
     */
    confirmReply = async () => {
        const replyContent = this.state.replyContent
        if (!replyContent) {
            message.warning('请输入回复内容')
            return
        }
        const param = {
            content: replyContent,
            type: 1,
            pid: this.state.replyPid,
            targetUserId: this.state.replyUser.userId
        }
        const res = await json.post('/message/create', param)
        if (res.status === 0) {
            message.success('回复成功')
            this.closeReply()
            this.getMessages()
        }
    }
    renderActions = (item, pid) => {
        const actions = [
            <span>
                <Tooltip title="回复时间">
                    {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Tooltip>
            </span>,
            <span>
                <Tooltip title="赞">
                    <Icon type="like" />
                </Tooltip>
            </span>,
            <span>
                <Tooltip title="回复">
                    <span onClick={() => this.showReply(item, pid)}>
                        <Icon type="message" />&nbsp;回复
                   </span>
                </Tooltip>
            </span>
        ]
        return actions
    }
    myUploadFn = async (param) => {
        const formData = new FormData();
        formData.append('file', param.file);
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
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
        const { isShowEditor, messages, editorState, replyPid, replyContent } = this.state
        const controls = [
            {
                key: 'bold',
                text: <b>加粗</b>
            },
            'italic', 'underline', 'separator', 'link', 'separator', 'media'
        ]


        return (
            <Card bordered={false} style={{ marginBottom: 30 }} bodyStyle={{paddingTop:0}}>
                <div>
                    {
                        isShowEditor ? (
                            <div style={{ marginTop: 10 }}>
                                <div className="editor-wrapper">
                                    <BraftEditor
                                        controls={controls}
                                        contentStyle={{ height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                                        value={editorState}
                                        media={{ uploadFn: this.myUploadFn }}
                                        onChange={this.handleMessageChange}
                                    />
                                </div>
                                <Button type='primary' onClick={this.sendMessage}>发表</Button>&emsp;
                                <Button onClick={this.closeMessage}>取消</Button>
                            </div>
                        ) : <Button onClick={() => this.setState({ isShowEditor: true })}>我要留言</Button>
                    }
                </div>
                <Divider />
                <div className='message-list-box'>
                    {
                        messages && messages.map(item => (
                            <Comment
                                key={item.id}
                                author={item.userName}
                                avatar={<img className='avatar-img' src={item.userAvatar} alt='avatar' />}
                                content={<div dangerouslySetInnerHTML={createMarkup(item.content)} />}
                                actions={this.renderActions(item, item.id)}
                            >
                                {item.children.length > 0 && item.children.map(i => (
                                    <Comment
                                        key={i.id}
                                        author={<div>{i.userName} @ {i.targetUserName}</div>}
                                        avatar={<img className='avatar-img-small' src={i.userAvatar} alt='avatar' />}
                                        content={<div dangerouslySetInnerHTML={createMarkup(i.content)} />}
                                        actions={this.renderActions(i, item.id)}
                                    />
                                ))}
                                {replyPid === item.id && (
                                    <div style={{ width: '70%', textAlign: 'right' }}>
                                        <TextArea rows={4} style={{ marginBottom: 10 }} value={replyContent} onChange={this.handleReplyChange} />
                                        <Button size='small' onClick={this.closeReply}>取消</Button>&emsp;
                                        <Button size='small' type='primary' onClick={this.confirmReply}>回复</Button>
                                    </div>
                                )}
                            </Comment>
                        ))
                    }
                </div>
            </Card>
        );
    }
}

export default MessageBoard;