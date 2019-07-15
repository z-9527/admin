import React from 'react'
import { Tabs, Carousel, Layout, Icon } from 'antd'
import './style.less'

const Footer = Layout.Footer
const TabPane = Tabs.TabPane;
const imgs = [
    `${process.env.REACT_APP_BASE_URL}/public/images/bg1.jpg`,
    `${process.env.REACT_APP_BASE_URL}/public/images/bg2.jpg`,
    `${process.env.REACT_APP_BASE_URL}/public/images/bg3.jpg`,
]

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
            <div className='content-container'>
                {
                    panes.length ? (
                        <Tabs
                            style={{ height: '100%' }}
                            tabBarStyle={{ background: '#f0f2f5', marginBottom: 0 }}
                            onEdit={this.onEdit}
                            onChange={this.onChange}
                            activeKey={activeMenu}
                            type="editable-card"
                            hideAdd>
                            {
                                panes.map(item => (<TabPane key={item.key} tab={item.name}>
                                    <div className='tabpane-box'>
                                        {item.content}
                                    </div>
                                    <Footer style={{ textAlign: 'center', background: '#fff' }}>
                                        React-Admin ©{new Date().getFullYear()} Created by 137596665@qq.com <a target='_blank' href='https://github.com/zhangZhiHao1996/admin' rel="noopener noreferrer"><Icon type="github" /></a>
                                    </Footer>
                                </TabPane>))
                            }
                        </Tabs>
                    ) : (
                            <div className='bg-box'>
                                <Carousel className='bg-size' autoplay autoplaySpeed={5000}>
                                    {imgs.map(item => (
                                        <div className='bg-size' key={item}>
                                            <img src={item} alt="" style={{ width: '100%', height: '100%' }} />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        )
                }
            </div>
        )
    }
}



export default MyContent