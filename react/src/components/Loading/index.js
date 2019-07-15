import React from 'react'
import './style.css'

//此效果来源于https://codepen.io/MarioDesigns/pen/LLrVLK

class Loading extends React.Component {
    render() {
        const { className = '', style = {} } = this.props
        return (
            <div id="my-loading" className={className} style={style}>
                <div className="loader"></div>
                <div className="shadow"></div>
            </div>
        )
    }
}

export default Loading 