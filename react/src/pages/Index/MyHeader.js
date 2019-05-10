import React from 'react'
import { Icon } from 'antd'

class MyHeader extends React.Component {
    toggleCollapsed = () => {
        this.props.onChangeState({
            collapsed: !this.props.collapsed
        })
    }
    render() {
        return (
            <div style={{ background: '#fff', padding: '0 16px' }}>
                <Icon
                    style={{ fontSize: 18 }}
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}
                />
            </div>
        )
    }
}

export default MyHeader