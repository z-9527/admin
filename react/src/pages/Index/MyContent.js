import React from 'react'
import { Tabs } from 'antd'
import './style.less'

const TabPane = Tabs.TabPane;

class MyContent extends React.Component {
    /**
     *  标签页的改变触发的函数
     */
    onChange = (activeKey) => {
        this.props.onChangeState({
            activeMenu: activeKey
        })
    }
    onEdit = (targetKey, action) => {
        if (action === 'remove') {
            this.remove(targetKey)
        }
    }
    /**
    * 关闭标签页
    */
    remove = (targetKey) => {
        let activeMenu = this.props.activeMenu
        let panes = this.props.panes.slice()
        let preIndex = panes.findIndex(item => item.key === targetKey) - 1
        preIndex = Math.max(preIndex, 0)

        panes = panes.filter(item => item.key !== targetKey)

        if (targetKey === activeMenu) {
            activeMenu = panes[preIndex] ? panes[preIndex].key : ''
        }
        this.props.onChangeState({
            activeMenu,
            panes
        })
    }
    render() {
        const { panes, activeMenu } = this.props
        return (
            <div style={styles.container}>
                {
                    panes.length ? (
                        <Tabs
                            tabBarStyle={{ background: '#f0f2f5', marginBottom: 0 }}
                            onEdit={this.onEdit}
                            onChange={this.onChange}
                            activeKey={activeMenu}
                            type="editable-card"
                            hideAdd>
                            {
                                panes.map(item => (<TabPane key={item.key} tab={item.name} style={{ padding: 24 }}>
                                    {item.content}
                                </TabPane>))
                            }
                        </Tabs>
                    ) : <div style={styles.bg} />
                }
            </div>
        )
    }
}

const styles = {
    container: {
        position: 'relative',
        height: '100%',
        backgroundColor: '#fff'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 64px)',
        backgroundColor: '#eee',
        backgroundImage:`url(${require('../../assets/images/bg.jpg')})`,
        backgroundSize:'100%'
    }
}

export default MyContent