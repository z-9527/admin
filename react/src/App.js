import React from 'react';
import './App.css';
import {Button} from 'antd'
import ColorPicker from '@/components/ColorPicker/index'
import {Link,Route} from 'react-router-dom'

class A extends React.Component{
  render(){
    return (
      <div>
        A
      </div>
    )
  }
}
class B extends React.Component{
  render(){
    return (
      <div>
        B
      </div>
    )
  }
}

class App extends React.Component {
  change = (color)=>{
    window.less.modifyVars({
      '@primary-color': color
    })
  }
  test = ()=>{
    fetch('http://localhost:8888/json').then(res=>res.json()).then(res=>{
      console.log(res)
    })
  }
  render(){
    return (
      <div className="App">
        <h2>fdsafdasf</h2>
        <ColorPicker onChange={this.change}/>
        <Button onClick={this.test}>fdasfa</Button>
        <Button type="primary">fdasfa</Button>
        <div>
        <Link to='/a'><Button>a</Button></Link>&emsp;
        <Link to='/b'><Button>b</Button></Link>
        </div>
        <br/><br/>
        <Route path='/a' component={A}/>
        <Route path='/b' component={B}/>
      </div>
    );
  }
}

export default App;
