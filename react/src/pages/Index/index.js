import React from 'react'
import { Layout, Icon } from 'antd'
import MySider from './MySider'
import MyHeader from './MyHeader'
import MyContent from './MyContent'

const { Header, Sider, Content, Footer } = Layout;

class Index extends React.Component {
    //因为这些状态在不同组件中使用了，所以这里使用了状态提升（这里也可以用状态管理）
    state = {
        collapsed: false,  //侧边栏的折叠和展开
        panes: [],    //网站打开的标签页列表
        activeMenu: ''  //网站活动的菜单
    };
    _setState = (obj) => {
        this.setState(obj)
    }
    render() {
        const { collapsed, panes, activeMenu } = this.state
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <MySider
                        panes={panes}
                        activeMenu={activeMenu}
                        onChangeState={this._setState} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <MyHeader
                            collapsed={collapsed}
                            onChangeState={this._setState} />
                    </Header>
                    <Content>
                        <MyContent
                            panes={panes}
                            activeMenu={activeMenu}
                            onChangeState={this._setState} />
                    </Content>
                    <Footer style={{ textAlign: 'center', background: '#fff' }}>
                        React-Admin ©{new Date().getFullYear()} Created by 137596665@qq.com <a target='_blank' href='https://github.com/zhangZhiHao1996/admin' rel="noopener noreferrer"><Icon type="github" /></a>
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Index