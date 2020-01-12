import React, { Component } from 'react';
import { Comment, Divider, Button, Card, message, Tooltip, Icon, Input, Modal, notification, Tag, Spin, Pagination } from 'antd'
import { json } from '../../utils/ajax'
import moment from 'moment'
import { isAuthenticated } from '../../utils/session'
import { connect } from 'react-redux'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import 'braft-extensions/dist/code-highlighter.css'
import './style.less'
import LoadableComponent from '@/utils/LoadableComponent'

BraftEditor.use(CodeHighlighter({}))

const TextArea = Input.TextArea
const Score = LoadableComponent(import('./Score.js'))

function createMarkup(html) {
    return { __html: html };
}

const store = connect(
    (state) => ({ user: state.user })
)

@store
class MessageBoard extends Component {
    state = {
        editorState: BraftEditor.createEditorState(null),   //留言内容
        messages: [],   //留言列表
        isShowEditor: false,
        replyPid: '',//回复第几条的父级id
        replyContent: '',  //回复内容
        replyUser: null, //回复的对象
        expandIds: [],  //展开的id列表
        placeholder: '',  //回复的placeholder
        loading: false,
        pagination: {
            total: 100,
            current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true
        },
    }
    componentDidMount() {
        this.getMessages()
    }
    componentDidUpdate(prevProps) {
        //修改用户信息时，重新加载
        if (this.props.user !== prevProps.user) {
            const { current, pageSize } = this.state.pagination
            this.getMessages(current, pageSize)
        }
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
    getMessages = async (page = 1, pageSize = 10) => {
        this.setState({
            loading: true
        })
        const res = await json.get('/message/list', {
            current: page - 1,
            pageSize: pageSize
        })
        if (res.status !== 0) {
            this.setState({
                loading: false,
            })
            return
        }
        this.setState({
            messages: res.data.list || [],
            loading: false,
            pagination: {
                ...this.state.pagination,
                total: res.data.total,
                current: page,
                pageSize
            }
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
            replyUser: item,
            placeholder: `${this.props.user.username} @ ${item.userName}`
        })
    }
    /**
     * 关闭回复的texttarea
     */
    closeReply = () => {
        this.setState({
            replyPid: '',
            replyContent: '',
            replyUser: '',
            placeholder: ''
        })
    }
    /**
     * 确认回复
     */
    confirmReply = async (item) => {
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
            const { current, pageSize } = this.state.pagination
            this.getMessages(current, pageSize)
            if (!this.state.expandIds.includes(item.id)) {
                this.setState({
                    expandIds: [...this.state.expandIds, item.id]
                })
            }
        }
    }
    /**
     * 删除回复
     */
    onDelete = async (item) => {
        Modal.confirm({
            title: '提示',
            content: `确认删除该留言${item.children && item.children.length ? '及其底下的回复' : ''}吗？`,
            onOk: async () => {
                const res = await json.post('/message/delete', {
                    id: item.id
                })
                if (res.status === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.message,
                        duration: 3
                    });
                    const { current, pageSize } = this.state.pagination
                    this.getMessages(current, pageSize)
                }
            },
        });
    }
    /**
     * 折叠回复
     */
    foldReply = (item) => {
        const list = this.state.expandIds.slice()
        const index = list.findIndex(i => i === item.id)
        list.splice(index, 1)
        this.setState({
            expandIds: list
        })
    }
    /**
     * 展开回复
     */
    expandReply = (item) => {
        this.setState({
            expandIds: [...this.state.expandIds, item.id]
        })
    }
    /**
     * 点击赞
     */
    onLike = () => {
        notification.warning({
            message: '提示',
            description: '暂不支持点赞功能',
            duration: 3,
            // icon: <Icon type="smile" />,
        });
    }
    renderActions = (item, pid) => {
        let actions = [
            <span>
                <Tooltip title="回复时间">
                    {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Tooltip>
            </span>,
            <span style={styles.actionItem}>
                <Tooltip title="赞">
                    <span onClick={this.onLike}>
                        <Icon type="like" />&nbsp;赞
                    </span>
                </Tooltip>
            </span>,
            <span style={styles.actionItem}>
                <Tooltip title="回复">
                    <span onClick={() => this.showReply(item, pid)}>
                        <span className='iconfont icon-commentoutline my-iconfont' />&nbsp;回复
                   </span>
                </Tooltip>
            </span>
        ]
        //只有管理员或者本人才可删除
        if (this.props.user.isAdmin || this.props.user.id === item.userId) {
            actions.splice(2, 0, (
                <span style={styles.actionItem}>
                    <Tooltip title="删除">
                        <span onClick={() => this.onDelete(item)}>
                            <Icon type="delete" />&nbsp;删除
                        </span>
                    </Tooltip>
                </span>
            ))
        }
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
    pageChange = (page) => {
        this.getMessages(page,this.state.pagination.pageSize)
    }
    pageSizeChange = (current, size) => {
        this.getMessages(1, size)
    }

    render() {
        const { isShowEditor, messages, editorState, replyPid, replyContent, expandIds, placeholder, loading, pagination } = this.state
        const controls = ['undo', 'redo', 'clear', 'separator', 'bold', 'text-color', 'blockquote', 'code', 'emoji', 'separator', 'link', 'separator', 'media']
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

        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
                    <div>
                        {
                            isShowEditor ? (
                                <div style={{ marginTop: 10 }}>
                                    <div className="editor-wrapper">
                                        <BraftEditor
                                            hooks={hooks}
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
                    <Spin spinning={loading} style={{ position: 'fixed', top: '50%', left: '50%' }} />
                    <div className='message-list-box'>
                        {
                            Array.isArray(messages) && messages.map((item, index) => (
                                <Comment
                                    key={item.id}
                                    author={<span style={{ fontSize: 16 }}>{item.userName} {item.userIsAdmin === 1 && <Tag color="#87d068">管理员</Tag>}</span>}
                                    avatar={<img className='avatar-img' src={item.userAvatar} alt='avatar' />}
                                    content={<div className='info-box braft-output-content' dangerouslySetInnerHTML={createMarkup(item.content)} />}
                                    actions={this.renderActions(item, item.id)}
                                    datetime={`第${pagination.total - (pagination.current - 1) * pagination.pageSize - index}楼`}
                                >
                                    {item.children.slice(0, expandIds.includes(item.id) ? item.children.length : 1).map(i => (
                                        <Comment
                                            key={i.id}
                                            author={<span style={{ fontSize: 15 }}>{i.userName} {i.userIsAdmin === 1 && <Tag color="#87d068">管理员</Tag>} @ {i.targetUserName} {i.targetUserIsAdmin === 1 && <Tag color="#87d068">管理员</Tag>}</span>}
                                            avatar={<img className='avatar-img-small' src={i.userAvatar} alt='avatar' />}
                                            content={<div className='info-box' dangerouslySetInnerHTML={createMarkup(i.content)} />}
                                            actions={this.renderActions(i, item.id)}
                                        />
                                    ))}
                                    <div className='toggle-reply-box' style={{ display: item.children.length > 1 ? 'block' : 'none' }}>
                                        {
                                            expandIds.includes(item.id) ? (
                                                <span onClick={() => this.foldReply(item)}>收起全部{item.children.length}条回复 <Icon type='up-circle' /></span>
                                            ) : (
                                                    <span onClick={() => this.expandReply(item)}>展开全部{item.children.length}条回复 <Icon type="down-circle" /></span>
                                                )
                                        }
                                    </div>
                                    {replyPid === item.id && (
                                        <div style={{ width: '70%', textAlign: 'right' }}>
                                            <TextArea rows={4} style={{ marginBottom: 10 }} value={replyContent} onChange={this.handleReplyChange} placeholder={placeholder} />
                                            <Button size='small' onClick={this.closeReply}>取消</Button>&emsp;
                                        <Button size='small' type='primary' onClick={() => this.confirmReply(item)}>回复</Button>
                                        </div>
                                    )}
                                </Comment>
                            ))
                        }
                    </div>
                    <Pagination {...pagination} onChange={this.pageChange} onShowSizeChange={this.pageSizeChange} />
                    <div className='score-box'>
                        <Score />
                    </div>
                </Card>
            </div>
        );
    }
}

const styles = {
    actionItem: {
        fontSize: 14
    }
}

export default MessageBoard;