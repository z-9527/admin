import React, { Component } from 'react';
import { Rate, Progress, Icon, Modal } from 'antd'
import { json } from '../../utils/ajax'
import { connect } from 'react-redux'

const store = connect(
    (state) => ({ user: state.user })
)

@store
class Score extends Component {
    state = {
        isScored: false,    //是否已经评过分
        scores: [],          //所有评分列表
        userScore: 4,         //当前用户的评分值（默认4星）
        average: 0,         //平均分
        rankList: [],        //1-5星的占比
        visible: true,
    }
    componentDidMount() {
        this.getScores()
    }
    /**
     * 获取评分列表
     */
    getScores = async () => {
        const res = await json.get('/score/list')
        const list = res.data || []
        const total = list.reduce((total, current) => {
            return total + current.score
        }, 0)
        const average = total * 2 / list.length
        let rankList = []
        // 因为有四舍五入的处理，所以我想最后一个数用100相减，但是js的浮点数计算是不准确的（0.1+0.3!=0.3），就没多此一举了
        for (let i = 0; i < 5; i++) {
            const num = list.filter(item => item.score === 5 - i).length / list.length
            rankList[i] = Number((num * 100).toFixed(1))    //注意toFixed方法返回的是字符串
        }
        this.setState({
            isScored: !!list.find(item => item.userId === this.props.user.id),
            scores: list,
            average: average.toFixed(1), //保留一位小数,这里不要用Number否则7.0会显示7
            rankList
        })
    }
    /**
     * 评分
     */
    createScore = async (num) => {
        Modal.confirm({
            title: '提示',
            content: <div>确定当前评分 <Rate disabled defaultValue={num} /></div>,
            onOk: async () => {
                const res = await json.post('/score/create', {
                    score: num,
                    userId: this.props.user.id
                })
                if (res.status === 0) {
                    this.getScores()
                    this.setState({
                        userScore: num
                    })
                }
            }
        })
    }
    /**
     * 计算显示平均分的星星，满分10分，一分为半星，大于0小于0.5不算星，大于等于0.5小于1算半星
     */
    handleScore = (score) => {
        score = Number(score)
        const integer = Math.floor(score)   //取整数部分
        let decimal = score - integer    //取小数部分
        if (decimal >= 0.5) {
            decimal = 1
        } else {
            decimal = 0
        }
        return (integer + decimal) / 2
    }
    render() {
        const { isScored, userScore, scores, average, rankList, visible } = this.state
        const desc = ['有bug', '再接再厉', '有待提高', '不错', '666']

        const NotScore = () => (
            <div>
                <Rate
                    tooltips={desc}
                    value={userScore}
                    allowClear={false}
                    onChange={this.createScore} />
                <span style={{ color: '#888' }}>{desc[userScore - 1]}</span>
            </div>
        )
        const ScoreInfo = () => (
            <div style={{ display: visible ? 'block' : 'none' }}>
                <div className='info'>
                    <div className='average-num'>{average}</div>
                    <div>
                        <div><Rate disabled defaultValue={this.handleScore(average)} allowHalf /></div>
                        <div className='people-num'>{scores.length}人评价</div>
                    </div>
                    <div className='close-box' onClick={() => this.setState({ visible: false })}><Icon type="close" /></div>
                </div>
                <div>
                    {rankList.map((item, index) => (
                        <div key={index} className='star-item'>
                            <div className='star-label'>{5 - index}星</div>
                            <Progress percent={item} status={'active'} strokeLinecap='square' strokeWidth={10} strokeColor={'var(--primaryColor)'} />
                        </div>
                    ))}
                </div>
            </div>
        )
        return (
            <div>{isScored ? <ScoreInfo /> : <NotScore />}</div>
        );
    }
}


export default Score;