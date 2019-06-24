import React, { Component } from 'react';
import AnimatedBook from '../../components/AnimatedBook'
import { Card } from 'antd'

class Collection extends Component {
    state = {}
    render() {
        return (
            <div>
                <Card bordered={false}>

                    <div style={styles.box}>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                        <AnimatedBook cover={'封面'} content={"内容"} style={{marginBottom:100}}/>
                    </div>
                </Card>
            </div>
        );
    }
}

const styles = {
    box: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }
}


export default Collection;