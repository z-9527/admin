import React from 'react'
import './style.less'
import PropTypes from 'prop-types';

class AnimatedBooks extends React.Component {
    static propTypes = {
        content: PropTypes.any,      //内容
        cover: PropTypes.any,      //封面
    }
    static defaultProps = {
        content: '',
        cover: ''
    }

    render() {
        const {cover,content,className='',style={}} = this.props
        return (
            <div className={`book-container ${className}`} style={style}>
                <div className="book">
                    {/* 封面 */}
                    <ul className="hardcover_front">
                        <li>{cover}</li>
                        <li></li>
                    </ul>
                    {/* 书页 */}
                    <ul className="page">
                        <li></li>
                        <li>{content}</li>
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