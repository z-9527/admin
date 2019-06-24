import React from 'react'
import asyncComponent from '../utils/asyncComponent'
//const Test = React.lazy(() => import('./Test'));   //报错，就没用React.lazy了
const Test = asyncComponent(() => import('./Test/index'));
const ButtonDemo = asyncComponent(() => import('./ButtonDemo/index'));
const IconDemo = asyncComponent(() => import('./IconDemo/index'));
const Users = asyncComponent(() => import('./Users/index'));
const Collection = asyncComponent(() => import('./Collection/index'));
const About = asyncComponent(() => import('./About/index'));


const menu = [
    {
        name: 'antd',
        icon: 'ant-design',
        key: 'antd',
        children: [
            {
                name: '按钮',
                icon: '',
                key: 'ButtonDemo',
            },
            {
                name: '图标',
                icon: '',
                key: 'IconDemo',
            },
        ]
    },
    {
        name: '菜单一',
        icon: 'user',
        key: 'menu1',
        children: [
            {
                name: '子菜单',
                icon: '',
                key: 'submenu'
            }
        ]
    },
    {
        name: '用户管理',
        icon: 'user',
        key: 'Users'
    },
    {
        name: '作品集',
        icon: 'bulb',
        key: 'Collection'
    },
    {
        name: '留言板',
        icon: 'message',
        key: 'T'
    },
    {
        name: '关于',
        icon: 'info-circle',
        key: 'About'
    }
]

const tabs = {
    submenu: <Test />,
    ButtonDemo: <ButtonDemo />,
    IconDemo: <IconDemo />,
    Users: <Users />,
    Collection: <Collection />,
    About: <About />,

}

export {
    menu,
    tabs
}