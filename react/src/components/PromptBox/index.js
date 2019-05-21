import React from 'react'
import PropTypes from 'prop-types'

class PromptBox extends React.Component {
    static propTypes = {
        info: PropTypes.string
    }
    static defaultProps = {
        info: ''
    }
    componentDidUpdate(prevProps) {
        if (this.props.info && this.props.info !== prevProps.info) {
            this._renderContent()
        }
    }
    _renderContent = () => {
        const ctx = this.canvas.getContext('2d')
        const width = this._calcWidth()
        ctx.strokeStyle = '#fff'
        ctx.shadowOffsetX = -2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 2
        ctx.shadowColor = 'rgba(0,0,0,.3)'
        ctx.beginPath()
        ctx.moveTo(0, 20)
        ctx.lineTo(8, 16)
        ctx.lineTo(8, 1)
        ctx.lineTo(width - 1, 1)
        ctx.lineTo(width - 1, 39)
        ctx.lineTo(8, 39)
        ctx.lineTo(8, 23)
        ctx.closePath()
        ctx.stroke();
        ctx.fillStyle = '#D3D7F7'
        ctx.textBaseline = 'middle'
        ctx.font = '14px sans-serif'
        ctx.beginPath()
        ctx.fillText(this.props.info, 20, 20);
    }
    _calcWidth = () => {
        return 30 + this.props.info.length * 15
    }
    render() {
        const { className = '', style = {} } = this.props
        return (
            <div className={className} style={style}>
                <canvas height='41' width={this._calcWidth()} ref={el => this.canvas = el} />
            </div>
        )
    }
}

export default PromptBox