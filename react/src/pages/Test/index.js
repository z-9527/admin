import React from 'react'
import { Card, Divider } from 'antd'
import Typing from '@/components/Typing'
import AnimatedBook from '@/components/AnimatedBook'
import './style.less'
import {get} from '@/utils/ajax'

class Test extends React.Component {
    state = {
        name:'zzh'
    }
    test = async ()=>{
        fetch('http://localhost:8888/json',{
            method: 'GET',
            credentials: 'include',
            headers:
                {
                    // Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inp6eiIsImlhdCI6MTU2MDUxNTAxM30.87U15X93jbBFnrsHEccyVxiy4hCgUuHCcmmpFFI45Fk'
                    Cookies:'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inp6eiIsImlhdCI6MTU2MDUxNTAxM30.87U15X93jbBFnrsHEccyVxiy4hCgUuHCcmmpFFI45Fk'
                }
            
        }).then(res=>{
            return res.json()
        }).then(res=>{
            console.log(123,res)
        })
    }
    render() {
        return (
            <Card>
                <button onClick={this.test}>click</button>
                <div className="test">fdsafasdf</div>
                {/* <div onClick={this.test}>fdasfa</div>
                <Typing style={{minHeight:500}}>
                    fdsafadsf   
                    打印带有标签的段落
                    <p>我是段落</p>
                    <a href="https://segmentfault.com/a/1190000018891454#articleHeader2" target="_blank">fdsaf</a>
                    {null}
                    {this.state.name}
                    <ul className="tttt" style={{color:'red'}} onClick={this.test}>
                        <li>列    表1</li>
                        <li>列表2</li>
                        <li>列表3</li>
                    </ul>
                </Typing> */}
                <AnimatedBook cover={'封面'} content={"内容"}/>
            </Card>
        )
    }
}

export default Test