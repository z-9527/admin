import React from 'react'
import screenfull from 'screenfull'
import { Icon, message, Menu, Avatar } from 'antd'
import ColorPicker from '@/components/ColorPicker/index'
import EditInfoModal from './EditInfoModal'
import EditPasswordModal from './EditPasswordModal'
import { logout } from '@/utils/session'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const store = connect(
    (state) => ({ user: state.user })
)

@withRouter @store
class MyHeader extends React.Component {
    constructor(props) {
        super(props);
        const userTheme = JSON.parse(localStorage.getItem('user-theme'))
        let color = '#13C2C2'
        if (userTheme) {
            window.less.modifyVars(userTheme)
            color = userTheme['@primary-color']
        }
        this.state = {
            isFullscreen: false,    //控制页面全屏
            color: color,
            infoVisible: false,     //控制修改用户信息的模态框
            passwordVisible: false   //控制修改密码的模态框
        }
    }
    toggleCollapsed = () => {
        this.props.onChangeState({
            collapsed: !this.props.collapsed
        })
    }
    toggleFullscreen = () => {
        if (screenfull.enabled) {
            screenfull.toggle().then(() => {
                this.setState({
                    isFullscreen: screenfull.isFullscreen
                })
            });
        }
    }
    changeColor = (color) => {
        window.less.modifyVars({
            '@primary-color': color,
        }).then(() => {
            localStorage.setItem('user-theme', JSON.stringify({ '@primary-color': color }))
            this.setState({
                color
            })
            message.success('更换主题颜色成功')
        })
    }
    resetColor = () => {
        this.changeColor('#13C2C2')
    }
    toggleInfoVisible = (visible) => {
        this.setState({
            infoVisible: visible
        })
    }
    togglePasswordVisible = (visible) => {
        this.setState({
            passwordVisible:visible
        })
    }
    onLogout = () => {
        logout()   //清空cookie
        this.props.history.push('/login')
    }

    render() {
        const { isFullscreen, color, infoVisible,passwordVisible } = this.state
        const { user } = this.props
        return (
            <div style={{ background: '#fff', padding: '0 16px' }}>
                <Icon
                    style={{ fontSize: 18 }}
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}
                />
                <div style={styles.headerRight}>
                    <div style={styles.headerItem}>
                        <ColorPicker color={color} onChange={this.changeColor} />
                    </div>
                    <div style={styles.headerItem}>
                        <Menu mode="horizontal" selectable={false}>
                            <SubMenu title={<div style={styles.avatarBox}><Avatar size='small' src={user.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} />&nbsp;<span>{user.username}</span></div>}>
                                <MenuItemGroup title="用户中心">
                                    <Menu.Item key={1} onClick={() => this.toggleInfoVisible(true)}><Icon type="user" />编辑个人信息</Menu.Item>
                                    <Menu.Item key={77} onClick={()=>this.togglePasswordVisible(true)}><Icon type="edit" />修改密码</Menu.Item>
                                    <Menu.Item key={2} onClick={this.onLogout}><Icon type="logout" />退出登录</Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup title="设置中心">
                                    <Menu.Item key={3} onClick={this.toggleFullscreen}><Icon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} />切换全屏</Menu.Item>
                                    <Menu.Item key={4} onClick={this.resetColor}><Icon type="ant-design" />恢复默认主题</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                        </Menu>
                    </div>
                </div>
                <EditInfoModal toggleVisible={this.toggleInfoVisible} visible={infoVisible} />
                <EditPasswordModal toggleVisible={this.togglePasswordVisible} visible={passwordVisible} />
            </div>
        )
    }
}

const styles = {
    headerRight: {
        float: 'right',
        display: 'flex',
        height: 64,
        marginRight: 50
    },
    headerItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px'
    },
    avatarBox: {
        display: 'flex',
        alignItems: 'center',
    }
}

export default MyHeader