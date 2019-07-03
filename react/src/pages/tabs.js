import React from 'react'
import asyncComponent from '../utils/asyncComponent'
//const Test = React.lazy(() => import('./Test'));   //报错，就没用React.lazy了
const ButtonDemo = asyncComponent(() => import('./ButtonDemo/index'));
const IconDemo = asyncComponent(() => import('./IconDemo/index'));
const FeedbackDemo = asyncComponent(() => import('./FeedbackDemo/index'));
const Users = asyncComponent(() => import('./Users/index'));
const Collection = asyncComponent(() => import('./Collection/index'));
const MessageBoard = asyncComponent(() => import('./MessageBoard/index'));
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
            {
                name: '反馈',
                icon: '',
                key: 'FeedbackDemo',
            },
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
        key: 'MessageBoard'
    },
    {
        name: '关于',
        icon: 'info-circle',
        key: 'About'
    }
]

const tabs = {
    ButtonDemo: <ButtonDemo />,
    IconDemo: <IconDemo />,
    FeedbackDemo: <FeedbackDemo />,
    Users: <Users />,
    Collection: <Collection />,
    MessageBoard: <MessageBoard />,
    About: <About />,

}

export {
    menu,
    tabs
}