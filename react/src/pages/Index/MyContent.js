import React from 'react'
import { Tabs,Carousel } from 'antd'
import './style.less'
import bg1 from '../../assets/images/bg1.jpg'
import bg2 from '../../assets/images/bg2.jpg'
import bg3 from '../../assets/images/bg3.jpg'

const TabPane = Tabs.TabPane;
const imgs = [bg1,bg2,bg3]

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
                    ) : (
                        <div className='bg-box'>
                            <Carousel className='bg-size' autoplay autoplaySpeed={5000}>
                                {imgs.map(item=>(
                                    <div className='bg-size' key={item}>
                                        <img src={item} alt="" style={{width:'100%',height:'100%'}}/>
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

const styles = {
    container: {
        position: 'relative',
        height: '100%',
        backgroundColor: '#fff'
    }
}

export default MyContent