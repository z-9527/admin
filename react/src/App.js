import React from 'react'
import './App.css'
import './index.css'
import {Switch,Route} from 'react-router-dom'
import Index from './pages/Index'
import Login from './pages/Login'

class App extends React.Component{
  render(){
    return (
      <Switch>
        <Route path='/login' component={Login}/>
        {/* <PrivateRoute path='/' component={Index}/> */}
        <Route path='/' component={Index}/>
      </Switch>
    )
  }
}

export default App
