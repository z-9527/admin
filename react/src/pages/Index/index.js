import React from 'react'
import { Layout, Icon } from 'antd'
import MySider from './MySider'
import MyHeader from './MyHeader'
import MyContent from './MyContent'
import { getUser, initWebSocket } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'

const { Header, Sider, Content, Footer } = Layout;

const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket }),
    (dispatch) => bindActionCreators({ getUser, initWebSocket }, dispatch)
)

@store
class Index extends React.Component {
    //因为这些状态在不同组件中使用了，所以这里使用了状态提升（这里也可以用状态管理,为了学习这里就使用状态提升）
    state = {
        collapsed: false,  //侧边栏的折叠和展开
        panes: [],    //网站打开的标签页列表
        activeMenu: ''  //网站活动的菜单
    };
    componentDidMount() {
        this.init()
    }
    componentWillUnmount(){
        const websocket = this.props.websocket
        websocket && websocket.close()
    }
    /**
     * 初始化用户信息和建立websocket连接
     */
    init = async () => {
        const username = localStorage.getItem('username')
        await this.props.getUser({username})
        const user = this.props.user
        this.props.initWebSocket({
            id: user.id,
            username: user.username,
            avatar: user.avatar
        })
    }
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