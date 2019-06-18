import React, { Component } from 'react';
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col } from 'antd'
import { json } from '../../utils/ajax'
import moment from 'moment'


@Form.create()
class Users extends Component {
    state = {
        users: [],    //用户列表
        usersLoading: false,//获取用户loading
        pagination: {
            total: 0,
            current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
            pageSize: 10,
            showQuickJumper: true
        }

    }
    componentDidMount() {
        this.getUsers()
    }
    /**
     * 虽然后台可以一次把所有数据返回给我，但是为了学习,前后台还是做了一个分页
     */
    getUsers = async () => {
        const { pagination } = this.state
        const fields = this.props.form.getFieldsValue()
        this.setState({
            usersLoading: true,
        })
        const res = await json.get('/user/getUsers', {
            current: pagination.current - 1,
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
            pagination: { ...pagination, total: res.data.total }
        })
    }
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        })
        this.getUsers()
    }
    onSearch = () => {
        this.getUsers()
    }
    onReset = () => {
        this.props.form.resetFields()
        this.getUsers()
        message.success('重置成功')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { users, usersLoading, pagination } = this.state
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
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss')
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
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                title: '身份',
                dataIndex: 'isAdmin',
                align: 'center',
                render: (text) => text ? '管理员' : '游客'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div className='primary-color'>
                        <Icon type="eye" /> 查看
                    </div>
                )
            },
        ]
        return (
            <div>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Row>
                            <Col span={6}>
                                <Form.Item label="用户名">
                                    {getFieldDecorator('username')(
                                        <Input
                                            style={{ width: 200 }}
                                            placeholder="用户名"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="注册开始时间">
                                    {getFieldDecorator('startTime')(
                                        <DatePicker showTime />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="注册截止时间">
                                    {getFieldDecorator('endTime')(
                                        <DatePicker showTime />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item style={{marginRight:0}}>
                                    <div style={{textAlign:'center'}}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                        <Button icon="reload" onClick={this.onReset}>重置</Button>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>



                    </Form>
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={users}
                        loading={usersLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
            </div>
        );
    }
}

export default Users