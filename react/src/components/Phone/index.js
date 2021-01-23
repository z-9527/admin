import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types';
import './index.less'

function Phone(props) {
  const [time, setTime] = useState(handleTime)
  const timer = useRef()

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(handleTime)
    }, 1000);
    return () => {
      clearInterval(timer.current)
    }
  })

  function handleTime() {
    const date = new Date()
    const hour = String(date.getHours())
    const minute = String(date.getMinutes())
    return `${hour.padStart(2, 0)}:${minute.padStart(2, 0)}`
  }
  return (
    <div id="phone" style={props.style}>
      <div className="speaker"></div>
      <div className="screen">
        <div className="status-bar">
          <div className="signal">
            <span className="full"></span>
            <span className="full"></span>
            <span className="full"></span>
            <span></span>
            <span></span>
                T-Mobile
              </div>
          <div className="time">{time}</div>
          <div className="battery"></div>
        </div>
        <iframe
          id={props.iframeId}
          title={props.title}
          style={{ height: 458, width: '100%', border: 'none' }}
          src={props.src}
        ></iframe>
      </div>
      <div className="home-btn"></div>
    </div>
  )
}

Phone.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string
}

Phone.defaultProps = {
  title: 'UI',
  src: ''
}


export default Phone
