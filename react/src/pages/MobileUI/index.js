import React from 'react'
import { Card } from 'antd'
import Typing from '../../components/Typing/index'
import Phone from '../../components/Phone'

function MobileUI() {
  return (
    <Card bordered={false}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: 24 }} className="markdown">
          <Typing>
            正在开发中...
          </Typing>
          <ol>
            <li>按钮</li>
            <li>按钮</li>
            <li>按钮</li>
          </ol>
        </div>

        <Phone src="https://youzan.github.io/vant/mobile.html?weapp=1#/zh-CN/" style={{ marginRight: 40 }} />
      </div>

    </Card>
  )
}

export default MobileUI