import React from 'react';
import './App.css';
import { Button, Upload, Icon,message } from 'antd'
import ColorPicker from '@/components/ColorPicker/index'
import { Link, Route } from 'react-router-dom'

class A extends React.Component {
  render() {
    return (
      <div>
        A
      </div>
    )
  }
}
class B extends React.Component {
  render() {
    return (
      <div>
        B
      </div>
    )
  }
}

class App extends React.Component {
  change = (color) => {
    window.less.modifyVars({
      '@primary-color': color
    })
  }
  test = () => {
    fetch('http://localhost:8888/json').then(res => res.json()).then(res => {
      console.log(res)
    })
  }
  render() {
    console.log(`${process.env.REACT_APP_BASE_URL}/upload`)
    const props = {
      name: 'file',
      action: `${process.env.REACT_APP_BASE_URL}/upload`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log('uploading',info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          console.log('done',info)
        } else if (info.file.status === 'error') {
          console.log('error',info)
        }
      },
    }
    return (
      <div className="App">
        <h2>fdsafdasf</h2>
        <ColorPicker onChange={this.change} />
        <Button onClick={this.test}>fdasfa</Button>
        <Button type="primary">fdasfa</Button>
        <div>
          <Link to='/a'><Button>a</Button></Link>&emsp;
        <Link to='/b'><Button>b</Button></Link>
        </div>
        <br /><br />
        <Route path='/a' component={A} />
        <Route path='/b' component={B} />
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
    </Button>
          </Upload>,
        </div>
      </div>
    );
  }
}

export default App;
