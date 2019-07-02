import React, { Component } from 'react';
import { Rate, Progress } from 'antd'
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
        rankList: []        //1-5星的占比
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
            average: Number(average.toFixed(1)), //保留一位小数
            rankList
        })
    }
    /**
     * 评分
     */
    createScore = async (num) => {
        this.setState({
            userScore: num
        })
        const res = await json.post('/score/create', {
            score: num,
            userId: this.props.user.id
        })
        if (res.status === 0) {
            this.getScores()
        }
    }
    /**
     * 计算显示平均分的星星
     */
    handleScore = (score) => {
        score = score / 2
        const integer = Math.floor(score)   //取整数部分
        let decimal = score - integer    //取小数部分
        //不足0.5当半星，大于0.5当整星
        if (decimal > 0 && decimal <= 0.5) {
            decimal = 0.5
        } else if (decimal > 0.5) {
            decimal = 1
        }
        return integer + decimal
    }
    render() {
        const { isScored, userScore, scores, average, rankList } = this.state
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
            <div>
                <div className='info'>
                    <div className='average-num'>{average}</div>
                    <div>
                        <div><Rate disabled defaultValue={this.handleScore(average)} allowHalf /></div>
                        <div className='people-num'>{scores.length}人评价</div>
                    </div>
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