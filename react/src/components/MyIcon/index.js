import { Icon } from 'antd'

// 刚开始我还没发现antd的Icon可以自定义图标，后来发现可以这样使用，非常方便，使用方法和Icon一致，svg也是未来图标的主流
//<MyIcon type=''/>

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_731989_0s6wteco74wa.js', // 在 iconfont.cn 上生成
});

export default MyIcon