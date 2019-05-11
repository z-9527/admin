import React from 'react'
import './style.css'

//此效果来源于https://codepen.io/MarioDesigns/pen/LLrVLK

class Loading extends React.Component {
    render() {
        return (
            <div id="my-loading">
                <div className="loader"></div>
                <div className="shadow"></div>
            </div>
        )
    }
}

export default Loading 