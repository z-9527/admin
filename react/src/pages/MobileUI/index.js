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
          <Typing>
            代码和样式参考了
          <a href='https://github.com/ant-design/ant-design' target='_blank' rel="noopener noreferrer">antd</a>、
          <a href='https://github.com/youzan/vant' target='_blank' rel="noopener noreferrer">vant</a>、
          react-components
          </Typing>
          <Row style={{ marginTop: 20 }}>
            {nav.slice(0, 2).map(item => <Item item={item} key={item.title} />)}
          </Row>
          <Row style={{ marginTop: 20 }}>
            {nav.slice(1, 3).map(item => <Item item={item} key={item.title} />)}
          </Row>
        </div>

        <Phone iframeId='my-phone' src={`${BASE_URL}${path}`} style={{ marginRight: 40 }} />
      </div>

    </Card>
  )
}

export default MobileUI