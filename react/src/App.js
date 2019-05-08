import React from 'react';
import './App.css';
import {Button} from 'antd'

class App extends React.Component {
  change = ()=>{
    window.less.modifyVars({
      '@primary-color': '#0035ff'
    })
  }
  render(){
    return (
      <div className="App">
        <h2>fdsafdasf</h2>
        <Button onClick={this.change}>fdasfa</Button>
        <Button type="primary">fdasfa</Button>
      </div>
    );
  }
}

export default App;
