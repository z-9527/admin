import React, { Component } from 'react';
import {Card} from 'antd'
import Typing from '../../components/Typing/index'

class About extends Component {
    state = {  }
    render() { 
        return ( 
            <div style={{ padding: 24 }}>
                <Card bordered={false} hoverable style={{ marginBottom: 24 }} bodyStyle={{ minHeight: 130 }}>
                    <Typing className="markdown">
                        <h3>关于</h3>
                        这个人很懒，什么也没留下...
                    </Typing>
                </Card>
            </div>
         );
    }
}
 
export default About;