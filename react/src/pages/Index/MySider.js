import React from 'react'
import { Menu, Icon } from 'antd'
import tabs from '../tabs'

const menu = [
    {
        name: '菜单一',
        icon: 'user',
        key: 'menu1',
        children: [
            {
                name: '子菜单',
                icon: '',
                key: 'submenu'
            }
        ]

    },
    {
        name: '菜单二',
        icon: 'plus',
        key: 'menu2'
    }
]

class MySider extends React.Component {

    renderMenu = (menu) => {
        if (Array.isArray(menu)) {
            return menu.map(item => {
                if (!item.children || !item.children.length) {
                    return (
                        <Menu.Item key={item.key}>
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
        const { activeMenu } = this.props
        return (
            <div>
                <div style={styles.logo} />
                <Menu theme="dark" mode="inline" selectedKeys={[activeMenu]}>
                    {this.renderMenu(menu)}
                </Menu>
            </div>
        )
    }
}

const styles = {
    logo: {
        height: 32,
        background: 'rgba(255, 255, 255, .2)',
        margin: 16,
    }
}

export default MySider