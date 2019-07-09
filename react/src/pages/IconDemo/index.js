import React, { Component } from 'react';
import { Card, Icon } from 'antd'
import Typing from '../../components/Typing'
import { categories } from './icons'
import './style.less'

class IconDemo extends Component {

    render() {
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false} hoverable style={{ marginBottom: 24 }} bodyStyle={{minHeight:250}}>
                    <Typing className="markdown">
                        <h3>SVG图标</h3>
                        在<code>3.9.0 </code>之后，我们使用了 SVG 图标替换了原先的 font 图标，从而带来了以下优势：
                        <ol>
                            <li>完全离线化使用，不需要从 CDN 下载字体文件，图标不会因为网络问题呈现方块，也无需字体文件本地部署。</li>
                            <li>在低端设备上 SVG 有更好的清晰度。</li>
                            <li>支持多色图标。</li>
                            <li>对于内建图标的更换可以提供更多 API，而不需要进行样式覆盖。</li>
                        </ol>
                    </Typing>
                </Card>
                {
                    Object.entries(categories).map(item => (
                        <Card title={item[1].title} key={item[0]} style={{marginBottom:24}}>
                            {
                                item[1].list.map(icon => (
                                    <Card.Grid className={'gridStyle'} key={icon}>
                                        <div>
                                            <Icon type={icon} className="icon" />
                                            <div>{icon}</div>
                                        </div>
                                    </Card.Grid>
                                ))
                            }
                        </Card>
                    ))
                }
            </div>
        );
    }
}

export default IconDemo;