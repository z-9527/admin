import React, { Component } from 'react';
import { Table, Card, Form, Input, Button, DatePicker, message, Icon } from 'antd'
import { json } from '../../utils/ajax'
import moment from 'moment'

const { RangePicker } = DatePicker;

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
        this.setState({
            usersLoading: true
        })
        console.log(typeof pagination.current)
        const res = await json.get('/user/getUsers', {
            current: pagination.current - 1,   
        })
        if (res.status !== 0) {
            this.setState({
                usersLoading: false,
            })
            return
        }
        this.setState({
            usersLoading: false,
            users: res.data.list
        })
        console.log(123, res)
    }

    onReset = () => {
        this.props.form.resetFields()
        this.getUsers()
        message.success('重置成功')
    }
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        })
        this.getUsers()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { users, usersLoading, pagination } = this.state
        console.log(123,usersLoading)
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
                    <Form layout='inline' style={{ marginBottom: 12 }}>
                        <Form.Item label="用户名">
                            {getFieldDecorator('username')(
                                <Input
                                    style={{ width: 200 }}
                                    placeholder="用户名"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="注册开始时间">
                            {getFieldDecorator('startTime')(
                                <DatePicker />
                            )}
                        </Form.Item>
                        <Form.Item label="注册截止时间">
                            {getFieldDecorator('endTime')(
                                <DatePicker />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <div>
                                <Button type="primary" icon='search'>搜索</Button>
                                <Button icon="reload" onClick={this.onReset}>重置</Button>
                            </div>
                        </Form.Item>
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