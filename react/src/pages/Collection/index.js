import React, { Component } from 'react';
import AnimatedBook from '../../components/AnimatedBook'
import { Card, Icon, Button, Empty, Modal, Checkbox, message } from 'antd'
import './style.less'
import { connect } from 'react-redux'
import CreateModal from './CreateModal'
import { json } from '../../utils/ajax'


const store = connect(
    (state) => ({ user: state.user })
)

@store
class Collection extends Component {
    state = {
        collections: [],   //作品列表
        isShowCreateModal: false
    }
    componentDidMount() {
        this.getCollections()
    }
    /**
     * 获得作品集数据
     */
    getCollections = async () => {
        const res = await json.get('/works/list')
        this.setState({
            collections: res.data || []
        })
    }
    /**
     * 打开/关闭创建模态框
     */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        })
    }
    openCreateModal = () => {
        this.toggleShowCreateModal(true)
    }
    openDeleteModal = () => {
        let ids = []
        Modal.confirm({
            title: '请在下面勾选要删除的项目(仅管理员)',
            content: (
                <div style={{ marginTop: 30 }}>
                    <Checkbox.Group onChange={(values) => ids = values}>
                        {
                            this.state.collections.map(item => (
                                <p key={item.id}><Checkbox value={item.id}>{item.title}</Checkbox></p>
                            ))
                        }

                    </Checkbox.Group>
                </div>
            ),
            maskClosable: true,
            okButtonProps: {
                disabled: !this.props.user.isAdmin
            },
            onOk: async () => {
                const res = await json.post('/works/delete', { ids })
                if (res.status === 0) {
                    message.success('删除成功')
                    this.getCollections()
                }
            }
        })
    }


    render() {
        const { collections, isShowCreateModal } = this.state
        const colors = ['#f3b47e','#83d3d3','#8bc2e8','#a3c7a3']
        return (
            <div>
                <Card bordered={false}>
                    <div style={{ textAlign: 'right', marginBottom: 40 }}>
                        <Button icon='plus' onClick={this.openCreateModal}>创建</Button>&emsp;
                            <Button icon='delete' type='danger' onClick={this.openDeleteModal}>删除</Button>
                    </div>
                    <div style={styles.box}>
                        {collections && collections.map((item,index) => (
                            <AnimatedBook
                                key={item.id}
                                cover={(
                                    <div className='cover-box' style={{background:colors[index%4]}}>
                                        <h3 className='title ellipsis'>{item.title}</h3>
                                        <p className='ellipsis'>{item.description}</p>
                                    </div>
                                )}
                                content={(
                                    <div className='content-box'>
                                        <div className='btn'>
                                            <a href={item.githubUrl} target='_blank' rel="noopener noreferrer"><Icon type="github" /> </a>
                                            <a href={item.url} target='_blank' rel="noopener noreferrer">预览地址</a>
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
                <CreateModal
                    visible={isShowCreateModal}
                    toggleVisible={this.toggleShowCreateModal}
                    onCreated={this.getCollections} />
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