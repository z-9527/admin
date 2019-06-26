import React, { Component } from 'react';
import AnimatedBook from '../../components/AnimatedBook'
import { Card, Icon, Button, Empty, Modal, Checkbox } from 'antd'
import './style.less'
import { connect } from 'react-redux'
import CreateModal from './CreateModal'


const store = connect(
    (state) => ({ user: state.user })
)

@store
class Collection extends Component {
    state = {
        collections: [],   //作品列表
        isShowCreateModal: false
    }

    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        })
    }
    openCreateModal = () => {
        this.toggleShowCreateModal(true)
    }
    openDeleteModal = () => {
        Modal.confirm({
            title: '请在下面勾选要删除的项目',
            content: (
                <div style={{marginTop:30}}>
                    <Checkbox.Group>
                        <p><Checkbox value="A">基于Vue仿制QQ音乐</Checkbox></p>
                        <p><Checkbox value="B">原生小程序</Checkbox></p>
                        <p><Checkbox value="A">React实现的后退管理模板</Checkbox></p>
                    </Checkbox.Group>
                </div>
            ),
            onOk: () => {

            }
        })
    }


    render() {
        const { user } = this.props
        const { collections, isShowCreateModal } = this.state
        return (
            <div>
                <Card bordered={false}>
                    {user.isAdmin && (
                        <div style={{ textAlign: 'right', marginBottom: 40 }}>
                            <Button icon='plus' onClick={this.openCreateModal}>创建</Button>&emsp;
                            <Button icon='delete' type='danger' onClick={this.openDeleteModal}>删除</Button>
                        </div>
                    )}
                    <div style={styles.box}>
                        {collections && collections.map(item => (
                            <AnimatedBook
                                key={item.id}
                                cover={(
                                    <div className='cover-box'>
                                        <h3 className='title ellipsis'>Vue仿制QQ音乐</h3>
                                        <p className='ellipsis'>Vue+Vue-Router+Vuex</p>
                                    </div>
                                )}
                                content={(
                                    <div className='content-box'>
                                        <div className='btn'>
                                            <Icon type="github" /> 预览地址
                                </div>
                                    </div>
                                )}
                                style={{ marginBottom: 100 }} />
                        ))}
                    </div>
                    {
                        !collections.length && <Empty />
                    }
                </Card>
                <CreateModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        );
    }
}

const styles = {
    box: {
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
    }
}


export default Collection;