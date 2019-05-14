import React from 'react'
import { Card } from 'antd'
import Typing from '@/components/Typing'

class Test extends React.Component {
    state = {
        name:'zzh'
    }
    test = ()=>{
        console.log(1233)
    }
    render() {
        return (
            <Card>
                <div onClick={this.test}>fdasfa</div>
                <Typing>
                    fdsafadsf   
                    打印带有标签的段落
                    <p>我是段落</p>
                    {/* <a href="https://segmentfault.com/a/1190000018891454#articleHeader2">fdsaf</a> */}
                    {null}
                    {this.state.name}
                    <ul className="tttt" style={{color:'red'}} onClick={this.test}>
                        <li>列    表1</li>
                        <li>列表2</li>
                        <li>列表3</li>
                    </ul>
                </Typing>
            </Card>
        )
    }
}

export default Test