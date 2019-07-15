import React from 'react'
import './App.css'
import './index.css'
import { Switch, Route, withRouter } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import './assets/iconfont/iconfont.css'
import LoadableComponent from '@/utils/LoadableComponent'

const Index = LoadableComponent(import('./pages/Index'))
const Login = LoadableComponent(import('./pages/Login'))

@withRouter
class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/login' component={Login} />
        <PrivateRoute path='/' component={Index} />
      </Switch>
    )
  }
}

export default App
