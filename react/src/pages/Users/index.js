import React, { Component } from 'react';
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import { json } from '../../utils/ajax'
import moment from 'moment'
import InfoModal from './InfoModal'
import { connect } from 'react-redux'
import { logout } from '../../utils/session'
import { withRouter } from 'react-router-dom'
import CreateUserModal from './CreateUserModal'

const store = connect(
    (state) => ({ user: state.user })
)


@withRouter @store @Form.create()
class Users extends Component {
    state = {
        users: [],    //用户列表
        usersLoading: false,//获取用户loading
        pagination: {
            total: 0,
            current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
            pageSize: 10,
            showQuickJumper: true
        },
        isShowInfoModal: false,
        userInfo: {},        //当前行的user信息
        selectedRowKeys: [],   //选择中的行keys
        isShowCreateModal: false

    }
    componentDidMount() {
        this.getUsers()
    }
    componentDidUpdate(prevProps) {
        //当修改用户信息时，重新加载
        if (this.props.user !== prevProps.user) {
            this.getUsers(this.state.pagination.current)
        }
    }
    /**
     * 虽然后台可以一次把所有数据返回给我，但是为了学习,前后台还是做了一个分页
     */
    getUsers = async (page = 1) => {
        const { pagination } = this.state
        const fields = this.props.form.getFieldsValue()
        this.setState({
            usersLoading: true,
        })
        const res = await json.get('/user/getUsers', {
            current: page - 1,
            username: fields.username || '',   //koa会把参数转换为字符串，undefined也会
            startTime: fields.startTime ? fields.startTime.valueOf() : '',
            endTime: fields.endTime ? fields.endTime.valueOf() : ''
        })
        if (res.status !== 0) {
            this.setState({
                usersLoading: false,
            })
            return
        }
        this.setState({
            usersLoading: false,
            users: res.data.list,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: page
            }
        })
    }
    /**
     * table分页
     */
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        })
        this.getUsers(page.current)
    }
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getUsers()
    }
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields()
        this.getUsers()
        this.setState({
            selectedRowKeys: []
        })
        message.success('重置成功')
    }
    /**
     * 打开用户信息模特框，并初始化用户信息回显
     */
    showInfoModal = (record) => {
        const registrationAddress = record.registrationAddress ? JSON.parse(record.registrationAddress) : {}
        const lastLoginAddress = record.lastLoginAddress ? JSON.parse(record.lastLoginAddress) : {}
        const userInfo = {
            username: record.username,
            gender: record.gender,
            rIp: registrationAddress.ip,
            rTime: record.registrationTime && moment(record.registrationTime).format('YYYY-MM-DD HH:mm:ss'),
            rNation: registrationAddress.ad_info.nation,
            rProvince: registrationAddress.ad_info.province,
            rCity: `${registrationAddress.ad_info.city}（${registrationAddress.ad_info.district}）`,
            lastLoginAddress: lastLoginAddress.ip && `${lastLoginAddress.ip}（${lastLoginAddress.ad_info.city}）`,
            lastLoginTime: record.lastLoginTime && moment(record.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.setState({
            isShowInfoModal: true,
            userInfo: userInfo
        })
    }
    /**
     * 关闭用户信息模态框
     */
    closeInfoModal = () => {
        this.setState({
            isShowInfoModal: false,
            userInfo: {}
        })
    }
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                if (!this.props.user.isAdmin) {
                    message.warning('管理员才可批量删除')
                    return
                }
                const res = await json.post('/user/delete', {
                    ids: this.state.selectedRowKeys
                })
                if (res.status === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.message,
                    })
                    this.setState({
                        selectedRowKeys: []
                    })
                    this.getUsers()
                }
            }
        })
    }
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await json.post('/user/delete', {
            ids: [record.id]
        })
        if (res.status === 0) {
            notification.success({
                message: '删除成功',
                description: '3秒后自动退出登录',
                duration: 3
            })
            logout()
            setTimeout(() => {
                this.props.history.push('/login')
            }, 3000)
        }
    }
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { users, usersLoading, pagination, userInfo, isShowInfoModal, selectedRowKeys, isShowCreateModal } = this.state
        const columns = [
            {
                title: '序号',
                key: 'num',
                align: 'center',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * 10 + index + 1
                    if (num < 10) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '用户名',
                dataIndex: 'username',
                align: 'center'
            },
            {
                title: '注册地址',
                dataIndex: 'registrationAddress',
                align: 'center',
                render: (text) => {
                    const info = text && JSON.parse(text)
                    if (info) {
                        return `${info.ip}（${info.ad_info.city}）`
                    }
                }
            },
            {
                title: '注册时间',
                dataIndex: 'registrationTime',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
                sorter: (a, b) => a.registrationTime - b.registrationTime
            },
            {
                title: '上一次登陆地址',
                dataIndex: 'lastLoginAddress',
                align: 'center',
                render: (text) => {
                    const info = text && JSON.parse(text)
                    if (info) {
                        return `${info.ip}（${info.ad_info.city}）`
                    }
                }
            },
            {
                title: '上一次登陆时间',
                dataIndex: 'lastLoginTime',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
                sorter: (a, b) => a.lastLoginTime - b.lastLoginTime
            },
            {
                title: '身份',
                dataIndex: 'isAdmin',
                align: 'center',
                render: (text) => text ? '管理员' : '游客',
                filterMultiple: false,
                filters: [
                    {
                        text: '游客',
                        value: 0,
                    },
                    {
                        text: '管理员',
                        value: 1,
                    },
                ],
                onFilter: (text, record) => record.isAdmin === text,
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'left' }}>
                        <span className='my-a' onClick={() => this.showInfoModal(record)}><Icon type="eye" /> 查看</span>
                        {
                            this.props.user.username === record.username &&
                            <Popconfirm title='您确定删除当前用户吗？' onConfirm={() => this.singleDelete(record)}>
                                <span className='my-a'><Divider type='vertical' /><Icon type='delete' /> 删除</span>
                            </Popconfirm>
                        }
                    </div>
                )
            },
        ]

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
            getCheckboxProps: (record) => ({
                disabled: record.id === this.props.user.id
            })
        }
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Row>
                            <Col span={6}>
                                <Form.Item label="用户名">
                                    {getFieldDecorator('username')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="用户名"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="注册开始时间">
                                    {getFieldDecorator('startTime')(
                                        <DatePicker style={{ width: 200 }} showTime />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="注册截止时间">
                                    {getFieldDecorator('endTime')(
                                        <DatePicker style={{ width: 200 }} showTime />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 24 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                        <Button icon="reload" onClick={this.onReset}>重置</Button>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={users}
                        loading={usersLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <InfoModal visible={isShowInfoModal} userInfo={userInfo} onCancel={this.closeInfoModal} />
                <CreateUserModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} onRegister={this.getUsers} />
            </div>
        );
    }
}

export default Users