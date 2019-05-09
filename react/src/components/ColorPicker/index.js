import React from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
    static propTypes = {
        color: PropTypes.string,
        onChange: PropTypes.func,
        presetColors: PropTypes.array,
        disableAlpha:PropTypes.bool,
    }
    static defaultProps = {
        color: '',
        onChange: () => { },
        presetColors: [
            '#F5222D',
            '#FA541C',
            '#FA8C16',
            '#FAAD14',
            '#FADB14',
            '#A0D911',
            '#52C41A',
            '#13C2C2',
            '#1890FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96',
        ],
        disableAlpha:true   //禁用rgba
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.color && nextProps.color !== prevState.color) {
            return {
                color: nextProps.color
            }
        }
        return null
    }
    state = {
        displayColorPicker: false,
        color: ''
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.props.onChange(color.hex)
        this.setState({ color: color.hex })
    };

    render() {
        const styles = {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: this.state.color,
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0',
            },
        };

        return (
            <div style={{ lineHeight: '15px' }}>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {this.state.displayColorPicker ? <div style={styles.popover}>
                    <div style={styles.cover} onClick={this.handleClose} />
                    <SketchPicker {...this.props} color={this.state.color} onChange={this.handleChange} />
                </div> : null}
            </div>
        )
    }
}

export default ColorPicker