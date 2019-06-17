import React, { Component } from 'react';
import { Table, Card, Form,Input,Button,DatePicker, message } from 'antd'

const { RangePicker } = DatePicker;

@Form.create()
class Users extends Component {
    state = {}
    onReset = ()=>{
        this.props.form.resetFields()
        message.success('重置成功')
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const columns = [
            {
                title: '序号',
                key: 'num',
                align: 'center'
            },
            {
                title: '用户名',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '注册地址',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '注册时间',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '上一次登陆地址',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '上一次登陆时间',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render:(text,record)=>(
                    <div>
                        查看
                    </div>
                )
            },
        ]
        return (
            <div>
                <Card bordered={false}>
                    <Form layout='inline' style={{marginBottom:12}}>
                        <Form.Item label="用户名">
                            {getFieldDecorator('username')(
                                <Input 
                                    style={{width:200}}
                                    placeholder="用户名"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="注册开始时间">
                            {getFieldDecorator('startTime')(
                                 <DatePicker/>
                            )}
                        </Form.Item>
                        <Form.Item label="注册截止时间">
                            {getFieldDecorator('endTime')(
                                 <DatePicker/>
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
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}

export default Users