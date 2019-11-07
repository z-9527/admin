import React from 'react'
import PropTypes from 'prop-types'

// 如何将react节点转换为dom，比如拥有className、style、onClick的react元素，我们生成的dom如何保留这些。
// 本来想直接用React.createElement来代替document.createElement。但是ReactDOM.render()方法插入的位置节点必须是dom所以此方法不行
function isObject(obj){
    return Object.prototype.toString.call(obj) === '[object Object]'
}

class Typing extends React.Component {
    static propTypes = {
        delay: PropTypes.number,   //设置打印延时,单位为毫秒
        frequency: PropTypes.number,   //设置打印频率
        done: PropTypes.func    //打印结束的函数
    }
    static defaultProps = {
        delay: 0,
        frequency: 30,
        done: () => { }
    }

    componentDidMount() {
        this.chain = {          //此变量就是将要打印的对象
            parent: null,
            dom: this.wrapper,
            val: []
        };
        this.chain.val = this._convert(this.props.children, this.chain.val)
        setTimeout(() => {
            this._play(this.chain)
        }, this.props.delay)
    }
    /**
     * children转换为符合打印的数组
     * @param {*} children  Object、Array、String、undefined、Null
     * @param {array} arr 保存打印的数组
     */
    _convert(children, arr = []) {
        let list = arr.slice()
        if(Array.isArray(children)){
            for(let item of children){
                list = list.concat(this._convert(item))
            }
        }
        if(isObject(children)){
            const dom = this._createDom({
                ...children.props,
                type:children.type
            })
            const val = this._convert(children.props.children,[])
            list.push({
                dom,
                val
            })
        }
        if(typeof children === 'string'){
            list = list.concat(children.split(''))
        }
        return list
    }
    /**
     * 打印字符
     * @param {*} dom 父节点
     * @param {*} val 打印内容
     * @param {*} callback 打印完成的回调
     */
    _print(dom, val, callback) {
        setTimeout(function () {
            dom.appendChild(document.createTextNode(val));
            callback();
        }, this.props.frequency);
    }
    /**
     * 打印节点
     * @param {*} node 
     */
    _play = (node) => {
        //当打印最后一个字符时，动画完毕，执行done
        if (!node.val.length) {
            if (node.parent) this._play(node.parent);
            else this.props.done();
            return;
        }
        let current = node.val.shift()    //获取第一个元素，并从打印列表中删除
        if (typeof current === 'string') {
            this._print(node.dom, current, () => {
                this._play(node)
            })
        } else {
            let dom = current.dom
            node.dom.appendChild(dom)
            this._play({
                parent: node,
                dom,
                val: current.val
            })
        }
    }
    /**
     * 根据信息生成dom节点
     * @param {object} info 
     */
    _createDom(info) {
        info = { ...info }   
        let dom = document.createElement(info.type)

        delete info.children

        for (let [key, value] of Object.entries(info)) {
            if (key === 'className') {
                key = 'class'
            }
            dom.setAttribute(key, value)
        }
        if (info.style) {
            let cssText = ''
            for (let [key, value] of Object.entries(info.style)) {
                cssText += `${key}:${value};`
            }
            dom.style.cssText = cssText
        }

        return dom
    }

    render() {
        const { className = '', style = {} } = this.props
        return (
            <div ref={el => this.wrapper = el} className={className} style={style}>

            </div>
        )
    }
}

export default Typing
