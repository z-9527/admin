import React from 'react'
import './style.less'

class AnimatedBooks extends React.Component{
    render(){
        return (
            <div className="book-container">
                <div className="book">
                    {/* 封面 */}
                    <ul className="hardcover_front">
                        <li></li>
                        <li></li>
                    </ul>
                    {/* 书页 */}
                    <ul className="page">
                        <li></li>
                        <li>fdsafdaf</li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    {/* 背面 */}
                    <ul className="hardcover_back">
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default AnimatedBooks