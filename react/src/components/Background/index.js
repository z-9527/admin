import React from 'react'
import PropTypes from 'prop-types'
import { TweenLite, Circ } from "gsap/all";
import { throttle } from '@/utils/util'
import Loading from '@/components/Loading'

class Background extends React.Component {
    static propTypes = {
        url: PropTypes.string
    }
    static defaultProps = {
        url: 'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/bg1.jpg?raw=true',
    }

    constructor(props) {
        super(props)
        this.points = []    //背景粒子
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.canvas = null
        this.ctx = null
        this.target = {}   //当前鼠标在屏幕的位置

        this.state = {
            loading: false          //背景图太大，所以加一个loading
        }
    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        //当图片载入完成后再显示背景
        this.loadImageAsync(this.props.url).then(() => {
            this.setState({
                loading: false
            })
        }).then(() => {
            this.canvas && this.initPage()
        })
    }
    componentWillUnmount() {
        this.destory()
    }
    /**
     * 登录背景图太大，所以加了一个loading效果
     */
    loadImageAsync = (url) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = function () {
                resolve(url);
            };
            image.onerror = function () {
                console.log('图片载入错误')
            };
            image.src = url;
        })
    }
    /**
     * 创建背景粒子
     */
    _createPoints() {
        const { width, height } = this
        //创建粒子和粒子的起始位置
        for (let x = 0; x < width; x = x + width / 20) {
            for (let y = 0; y < height; y = y + height / 20) {
                let px = x + Math.random() * width / 20;
                let py = y + Math.random() * height / 20;
                let p = { x: px, originX: px, y: py, originY: py };
                this.points.push(p);
            }
        }
        //给每个粒子添加新属性closest、radius
        for (let i = 0; i < this.points.length; i++) {
            let closest = [];
            let p1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let p2 = this.points[j]
                let placed = false;
                for (let k = 0; k < 5; k++) {
                    if (!placed) {
                        if (closest[k] === undefined) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
                for (let k = 0; k < 5; k++) {
                    if (!placed) {
                        if (this._getDistance(p1, p2) < this._getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
            }
            p1.closest = closest;
            p1.radius = 2 + Math.random() * 2
            //给粒子添加抖动
            this._shakePoint(p1);
        }
    }
    /**
     * 粒子抖动
     * @param {object} point 
     */
    _shakePoint(point) {
        TweenLite.to(point, 1 + 1 * Math.random(), {
            x: point.originX - 50 + Math.random() * 100,
            y: point.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
            onComplete: () => {
                this._shakePoint(point);
            }
        });
    }
    /**
     * 绘制单个粒子
     * @param {*} point 
     * @param {*} ctx 
     */
    _drawPoint(point, ctx) {
        if (!point.pointActive) return;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(156,217,249,' + point.pointActive + ')';
        ctx.fill();
    }
    /**
     * 绘制线条
     */
    _drawLines(point, ctx) {
        if (!point.lineActive) return;
        for (let item of point.closest) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(item.x, item.y);
            ctx.strokeStyle = 'rgba(156,217,249,' + point.lineActive + ')';
            ctx.stroke();
        }
    }
    /**
     * 获取两个粒子之间的距离
     * @param {object} p1 
     * @param {object} p2 
     */
    _getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    /**
    * 鼠标移动事件处理
    * @param {*} e 
    */
    handleMouseMove = (e) => {
        let posx = 0, posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        this.target.x = posx;
        this.target.y = posy;
    }
    /**
     * 开始函数
     */
    start = () => {
        const { width, height, points, ctx, target } = this
        ctx.clearRect(0, 0, width, height);
        for (let point of points) {
            if (Math.abs(this._getDistance(target, point)) < 4000) {
                point.lineActive = 0.3;
                point.pointActive = 0.6;
            } else if (Math.abs(this._getDistance(target, point)) < 20000) {
                point.lineActive = 0.1;
                point.pointActive = 0.3;
            } else if (Math.abs(this._getDistance(target, point)) < 40000) {
                point.lineActive = 0.02;
                point.pointActive = 0.1;
            } else {
                point.lineActive = 0;
                point.pointActive = 0;
            }
            this._drawLines(point, ctx)
            this._drawPoint(point, ctx);
        }
        this.myReq = window.requestAnimationFrame(() => this.start());
    }
    initPage = () => {
        this.ctx = this.canvas.getContext('2d')
        this._createPoints()
        this.start()
        window.onmousemove = throttle(this.handleMouseMove, 50)   //函数节流优化
    }
    destory = () => {
        window.cancelAnimationFrame(this.myReq)
        window.onmousemove = null
    }

    render() {
        const { url } = this.props
        const { loading } = this.state
        return (
            <div>
                {
                    loading ? (
                        <div style={styles.backgroundBox}>
                            <Loading />
                        </div>
                    ) : (
                            <div style={{ ...styles.backgroundBox, backgroundImage: `url(${url})` }}>
                                <canvas
                                    ref={el => this.canvas = el}
                                    style={styles.canvasStyle}
                                    width={this.width}
                                    height={this.height} />
                                {this.props.children}
                            </div>
                        )
                }
            </div>
        )
    }
}

const styles = {
    backgroundBox: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundSize: '100% 100%',
    },
    canvasStyle: {
        display: 'block',   //防止全屏的canvas出现滚动条
        position: 'fixed',
        top: '0',
        left: '0',
    }
}

export default Background