import React from 'react';
import './App.css';
import {Button} from 'antd'
// import ColorPicker from './components/ColorPicker'
import ColorPicker from '@/components/ColorPicker/index'

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
      </div>
    );
  }
}

export default App;
