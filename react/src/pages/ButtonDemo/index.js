import React, { Component } from 'react';
import { Button, Card, Row, Col, Menu, Dropdown, Icon } from 'antd'
import Typing from '../../components/Typing/index'


class ButtonDemo extends Component {
    state = {}
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1">1st item</Menu.Item>
                <Menu.Item key="2">2nd item</Menu.Item>
                <Menu.Item key="3">3rd item</Menu.Item>
            </Menu>
        );
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false} hoverable style={{ marginBottom: 24 }} bodyStyle={{ minHeight: 130 }}>
                    <Typing className="markdown">
                        <h3>何时使用</h3>
                        标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。
                    </Typing>
                </Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }}>
                            <div>
                                <Button type="primary">Primary</Button>&emsp;
                                <Button>Default</Button>&emsp;
                                <Button type="dashed">Dashed</Button>&emsp;
                                <Button type="danger">Danger</Button>
                                <br />
                                <br />
                                <Button type="primary" ghost>Primary</Button>&emsp;
                                <Button ghost>Default</Button>&emsp;
                                <Button type="dashed" ghost>Dashed</Button>&emsp;
                                <Button type="danger" ghost>danger</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }}>
                            <div>
                                <Button type="primary" shape="circle" icon="search" />&emsp;
                                <Button type="primary" icon="search">Search</Button>&emsp;
                                <Button shape="circle" icon="search" />&emsp;
                                <Button icon="search">Search</Button>
                                <br />
                                <br />
                                <Button shape="circle" icon="search" />&emsp;
                                <Button icon="search">Search</Button>&emsp;
                                <Button type="dashed" shape="circle" icon="search" />&emsp;
                                <Button type="dashed" icon="search">Search</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={false}>
                            <div style={{ width: '50%' }}>
                                <Button type="primary" block loading style={{ marginBottom: 8 }}>Primary</Button>
                                <Button block style={{ marginBottom: 8 }}>Default</Button>
                                <Button type="dashed" block style={{ marginBottom: 8 }}>Dashed</Button>
                                <Button type="danger" block style={{ marginBottom: 8 }}>Danger</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={false}>
                            <Button type="primary" loading>primary</Button>&emsp;
                            <Button>secondary</Button>&emsp;
                            <Dropdown overlay={menu}>
                                <Button>
                                    Actions <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ButtonDemo;