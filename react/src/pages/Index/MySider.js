import React from 'react'
import { Menu, Icon } from 'antd'
import { tabs, menu } from '../tabs'

class MySider extends React.Component {
    /**
     * 生成侧边栏菜单
     */
    renderMenu = (menu) => {
        if (Array.isArray(menu)) {
            return menu.map(item => {
                if (!item.children || !item.children.length) {
                    return (
                        <Menu.Item key={item.key || item.name}>
                            <div onClick={() => this.addPane(item)}>{item.icon && <Icon type={item.icon} />}<span>{item.name}</span></div>
                        </Menu.Item>
                    )
                } else {
                    return (
                        <Menu.SubMenu key={item.key} title={<span>{item.icon && <Icon type={item.icon} />}<span>{item.name}</span></span>}>
                            {this.renderMenu(item.children)}
                        </Menu.SubMenu>
                    )
                }
            })
        }
    }
    /**
     * 点击侧边栏菜单添加标签页
     */
    addPane = (item) => {
        const panes = this.props.panes.slice()
        const activeMenu = item.key
        //如果标签页不存在就添加一个
        if (!panes.find(i => i.key === activeMenu)) {
            panes.push({
                name: item.name,
                key: item.key,
                content: tabs[item.key] || item.name
            })
        }
        this.props.onChangeState({
            panes,
            activeMenu
        })
    }
    render() {
        const { activeMenu, theme } = this.props
        return (
            <div className={`my-sider ${theme}`}>
                <div className={`sider-menu-logo ${theme}`}>
                    <a href="https://ant.design/docs/react/introduce-cn" target="_blank" rel="noopener noreferrer">
                        <img src={require('../../assets/images/antd.svg')} alt="" />
                        <h1>Ant Design</h1>
                    </a>
                </div>
                <Menu theme={theme} mode="inline" selectedKeys={[activeMenu]} style={{ paddingTop: 16 }}>
                    {this.renderMenu(menu)}
                </Menu>
            </div >
        )
    }
}



export default MySider