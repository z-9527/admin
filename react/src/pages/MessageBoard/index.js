import React, { Component } from 'react';
import { Card, Divider,Button,Modal,message } from 'antd'
import Typing from '../../components/Typing/index'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './style.less'
import {json} from '../../utils/ajax'

class MessageBoard extends Component {
    state = {
        editorState: BraftEditor.createEditorState(null)
    }
    handleChange = (editorState) => {
        this.setState({
            editorState
        })
    }
    sendMessage = async ()=>{
        const editorState = this.state.editorState
        if(editorState.isEmpty()){
            message.warning('请先输入内容')
        }
        const htmlContent = this.state.editorState.toHTML()
        const res = await json.post('/message/create')
        console.log(res)
        
    }
    render() {
        const { editorState } = this.state
        const controls = [
            {
                key: 'bold',
                text: <b>加粗</b>
            },
            'italic', 'underline', 'separator', 'link', 'separator', 'media'
        ]
        return (
            <div style={{ background: '#fff' }}>
                <div className='message-list-box'></div>
                <Divider />
                <div style={{marginBottom:30}}>
                    <div className="editor-wrapper">
                        <BraftEditor
                            controls={controls}
                            contentStyle={{ height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                            value={editorState}
                            onChange={this.handleChange}
                        />
                    </div>
                    <Button type='primary' onClick={this.sendMessage}>发表</Button>
                </div>
            </div>
        );
    }
}

export default MessageBoard;