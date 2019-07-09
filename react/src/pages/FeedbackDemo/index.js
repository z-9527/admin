import React, { Component } from 'react';
import { Button, Card, Row, Col, Alert, Radio, message, Drawer, Tooltip, notification, Select, Modal, Result } from 'antd'
import Typing from '../../components/Typing/index'

const RadioGroup = Radio.Group;
const Option = Select.Option

const StatusMap = {
    '403': {
        title: '403',
        status:'403',
        subTitle: '抱歉，您无权访问此页面。',
        extra: <Button type="primary">返回</Button>,
    },
    '404': {
        title: '404',
        status:'404',
        subTitle: '抱歉，您访问的页面不存在。',
        extra: <Button type="primary">返回</Button>,
    },
    '500': {
        title: '500',
        status:'500',
        subTitle: '抱歉，服务器开小差。',
        extra: <Button type="primary">返回</Button>,
    },
    success: {
        title: '恭喜您成功购买兰博基尼',
        status:'success',
        subTitle: 'F-22猛禽战斗机正在拦件，请注意查收',
        extra: [
            <Button type="primary" key="console">
                返回
            </Button>,
            <Button key="buy">再买一辆</Button>,
        ],
    },
    info: {
        title: '包裹已寄出',
        status:'info',
        extra: (
            <Button type="primary" key="console">
                查看物流
            </Button>
        ),
    },
    warning: {
        title: '车辆被扣留',
        status:'warning',
        extra: (
            <Button type="primary" key="console">
               查看详情
            </Button>
        ),
    },
    error: {
        title: '车辆被没收',
        subTitle: '',
        status:'error',
        extra: [
            <Button type="primary" key="console">
                查看详情
            </Button>,
        ],
    },
};


class FeedbackDemo extends Component {
    state = {
        drawer: {
            placement: 'right',  //抽屉弹出方向
            visible: false
        },
        notification: {
            placement: 'topRight'
        },
        modal: {
            visible: false
        },
        result: {
            type: '403'
        }
    }
    openNotification = (type) => {
        notification[type]({
            message: `${type}通知提醒框`,
            description: '这是内容这是内容这是内容这是内容这是内容这是内容这是内容...',
            placement: this.state.notification.placement
        });
    }
    showConfirm = () => {
        Modal.confirm({
            title: '提示',
            content: '您确认要进行此操作吗？',
            maskClosable: true,
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    showTypeModal = (type) => {
        Modal[type]({
            title: type,
            content: '一些提示内容一些提示内容一些提示内容一些提示内容一些提示内容一些提示内容...',
            maskClosable: true
        })
    }
    render() {
        const { drawer, notification, modal, result } = this.state
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false} hoverable style={{ marginBottom: 24 }} bodyStyle={{ minHeight: 305 }}>
                    <Typing className="markdown">
                        <h3>何时使用</h3>
                        主要是对用户的操作进行反馈
                        <ol>
                            <li><code>Alert </code> 警告提示，展现需要关注的信息。</li>
                            <li><code>Drawer </code> 用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到到原任务。</li>
                            <li><code>Message </code> 全局展示操作反馈信息。</li>
                            <li><code>Notification </code> 全局展示通知提醒信息。</li>
                            <li><code>Modal </code> 模态对话框。</li>
                            <li><code>Result </code> 用于反馈一系列操作任务的处理结果。</li>
                        </ol>
                    </Typing>
                </Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }} title='Drawer'>
                            <Button onClick={() => this.setState({ drawer: { ...drawer, visible: true } })}>弹出抽屉</Button>
                            <RadioGroup style={{ marginLeft: 16 }} defaultValue='right' onChange={(e) => this.setState({ drawer: { ...drawer, placement: e.target.value } })}>
                                <Radio value="top">上</Radio>
                                <Radio value="right">右</Radio>
                                <Radio value="bottom">下</Radio>
                                <Radio value="left">左</Radio>
                            </RadioGroup>
                            <Drawer
                                title="基本抽屉"
                                placement={drawer.placement}
                                closable={false}
                                onClose={() => this.setState({ drawer: { ...drawer, visible: false } })}
                                visible={drawer.visible}
                            >
                                <p>一些信息内容...</p>
                                <p>一些信息内容...</p>
                                <p>一些信息内容...</p>
                            </Drawer>
                        </Card>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }} title='message'>
                            <Tooltip title="成功提示">
                                <Button onClick={() => message.success('成功信息')}>成功</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="错误提示">
                                <Button onClick={() => message.error('错误信息')}>错误</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="警告提示">
                                <Button onClick={() => message.warning('警告信息')}>警告</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="加载中">
                                <Button onClick={() => message.loading('加载中...')}>加载中</Button>
                            </Tooltip>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }} title='Alert'>
                            <Alert message="成功信息" type="success" showIcon style={{ marginBottom: 16 }} />
                            <Alert message="一般信息" type="info" showIcon style={{ marginBottom: 16 }} />
                            <Alert message="警告信息" type="warning" showIcon style={{ marginBottom: 16 }} />
                            <Alert message="错误信息" type="error" showIcon style={{ marginBottom: 16 }} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }} title='notification'>
                            <Tooltip title="成功通知提醒框">
                                <Button onClick={() => this.openNotification('success')}>成功</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="一般通知提醒框">
                                <Button onClick={() => this.openNotification('info')}>一般</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="警告通知提醒框">
                                <Button onClick={() => this.openNotification('warning')}>警告</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="失败通知提醒框">
                                <Button onClick={() => this.openNotification('error')}>失败</Button>&emsp;
                            </Tooltip>
                            <Select defaultValue='topRight' onChange={(value) => this.setState({ notification: { ...notification, placement: value } })}>
                                <Option value='topLeft'>左上角</Option>
                                <Option value='topRight'>右上角</Option>
                                <Option value='bottomLeft'>左下角</Option>
                                <Option value='bottomRight'>右下角</Option>
                            </Select>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable bordered={false} style={{ marginBottom: 24 }} title='Modal'>
                            <Tooltip title="对话框">
                                <Button onClick={() => this.setState({ modal: { ...modal, visible: true } })}>对话框</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="确认框">
                                <Button onClick={this.showConfirm}>确认框</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="一般信息框">
                                <Button onClick={() => this.showTypeModal('info')}>一般信息框</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="成功信息框">
                                <Button onClick={() => this.showTypeModal('success')}>成功信息框</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="错误信息框">
                                <Button onClick={() => this.showTypeModal('error')}>错误信息框</Button>&emsp;
                            </Tooltip>
                            <Tooltip title="警告信息框">
                                <Button onClick={() => this.showTypeModal('warning')} style={{ marginTop: 8 }}>警告信息框</Button>
                            </Tooltip>
                            <Modal
                                title="基本模态框"
                                visible={modal.visible}
                                onCancel={() => this.setState({ modal: { ...modal, visible: false } })}
                                onOk={() => this.setState({ modal: { ...modal, visible: false } })}
                            >
                                <p>一些内容...</p>
                                <p>一些内容...</p>
                                <p>一些内容...</p>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <RadioGroup defaultValue='403' onChange={(e) => this.setState({ result: { ...result, type: e.target.value } })}>
                        {Object.keys(StatusMap).map(item => (
                            <Radio key={item} value={item}>{item}</Radio>
                        ))}
                    </RadioGroup>
                    <Result {...StatusMap[result.type]}/>
                </Row>
            </div>
        );
    }
}

export default FeedbackDemo;