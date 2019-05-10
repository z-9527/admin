import React from 'react'
import asyncComponent from '../utils/asyncComponent'
//const Test = React.lazy(() => import('./Test'));   //报错，就没用React.lazy了
const Test = asyncComponent(() => import('./Test/index'));


const tabs = {
    submenu:<Test/>
}

export default tabs