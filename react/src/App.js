import React from 'react'
import './App.css'
import {Switch,Route} from 'react-router-dom'
import Index from './pages/Index'

class App extends React.Component{
  render(){
    return (
      <Switch>
        {/* <Route path='/login' component={Login}/> */}
        {/* <PrivateRoute path='/' component={Index}/> */}
        <Route path='/' component={Index}/>
      </Switch>
    )
  }
}

export default App
