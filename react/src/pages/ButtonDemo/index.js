import React, { Component } from 'react';
import { Button, Card,Row,Col } from 'antd'
import Typing from '../../components/Typing/index'


class ButtonDemo extends Component {
    state = {}
    render() {
        return (
            <div>
                <Card title='何时使用' bordered={true} hoverable style={{marginBottom:24}}>
                    <Typing>
                        标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。
                    </Typing>
                </Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable bordered={true}>
                            fdsaf
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={true}>
                            fdsaf
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ButtonDemo;