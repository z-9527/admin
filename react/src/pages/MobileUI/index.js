import React, { useState } from 'react'
import { Card, Row, Col } from 'antd'
import Typing from '../../components/Typing/index'
import Phone from '../../components/Phone'
import { nav, BASE_URL } from './config'
import './index.less'

function MobileUI() {
  const [path, setPath] = useState('')

  function Item(props) {
    const item = props.item
    return (
      <Col span={12} key={item.title}>
        <div>{item.title}</div>
        <ol>
          {item.items.map(sub => <li className='nav-item' onClick={() => setPath(sub.path)} key={sub.path}>{sub.title}</li>)}
        </ol>
      </Col>
    )
  }

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: 24 }} className="markdown">
          <Typing style={{ height: 85 }}>
            代码和样式参考了
          <a href='https://github.com/ant-design/ant-design' target='_blank' rel="noopener noreferrer">antd</a>、
          <a href='https://github.com/youzan/vant' target='_blank' rel="noopener noreferrer">vant</a>、
          react-components <br />
            <a href='https://github.com/z-9527/sty-ui' target='_blank' rel="noopener noreferrer">项目地址</a> <br />
            <a href='http://47.99.130.140/project/sty-ui/#/' target='_blank' rel="noopener noreferrer">预览地址</a>
          </Typing>
          <Row style={{ marginTop: 20 }}>
            {nav.slice(0, 2).map(item => <Item item={item} key={item.title} />)}
          </Row>
          <Row style={{ marginTop: 20 }}>
            {nav.slice(2, 4).map(item => <Item item={item} key={item.title} />)}
          </Row>
        </div>

        <Phone iframeId='my-phone' src={`${BASE_URL}${path}`} style={{ marginRight: 40 }} />
      </div>

    </Card>
  )
}

export default MobileUI