import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { getIndex } from '@actions/task';
import { getScore } from '@actions/mall';
import { connect } from 'react-redux';
import { GET_INDEX } from '@constants/task';
import { GET_USER_SCORE } from '@constants/mall';
import Page from '@components/page';
import RowItem from '../../components/rowItem';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getIndex: Function;
  getScore: Function;
  userScore: number;
  curIndex: any;
}

interface IState {
  list: any;
  // awardContentList: any
  activedId: number;
  // awardContent: string
  prizeId: string | number;
  actTimes: number;
  isRolling: boolean;
  isRollingOver: boolean;
  clickCounts: number;
  speed: number;
  times: number;
  index: number;
}
let timer;
@connect(
  state => Object.assign({}, state.task, state.mall),
  dispatch => ({
    async getIndex () {
      await getIndex().then(res => {
        dispatch({
          type: GET_INDEX,
          payload: res
        });
        return Promise.resolve();
      });
    },
    getScore () {
      getScore().then(res => {
        dispatch({
          type: GET_USER_SCORE,
          payload: res
        });
      });
    }
  })
)
class Lottery extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      // 九宫格内容list
      list: [0, 1, 2, 3, 4, 5, 6, 7],
      // awardContentList: [
      //   '谢谢参与',
      //   '5星币',
      //   '阳光健康-心脏病检测问卷',
      //   '100星币',
      //   '实物奖品-1000元购药券',
      //   '500星币',
      //   'AI问诊权益无限次',
      //   '50星币'
      // ],
      // 被选中的格子的ID
      activedId: -1,
      // 中奖ID
      prizeId: '',
      // 获得prizeId之后计算出的动画次数
      times: 0,
      // 当前动画次数
      actTimes: 0,
      // 是否正在抽奖
      isRolling: false,
      // 是否抽过奖了
      isRollingOver: false,
      // 抽奖次数统计
      clickCounts: 0,
      // 获奖内容
      // awardContent: '',
      speed: 300,
      index: 0
    };
  }

  componentDidShow () {
    this.props.getScore();
  }

  handleBegin = () => {
    // this.state.isRolling为false的时候才能开始抽，不然会重复抽取，造成无法预知的后果
    if (!this.state.isRolling) {
      // 点击抽奖之后，我个人做法是将于九宫格有关的状态都还原默认
      this.setState(
        {
          activedId: -1,
          prizeId: '',
          times: 0,
          actTimes: 0,
          isRolling: true
        },
        () => {
          // 状态还原之后才能开始真正的抽奖
          this.props
            .getIndex()
            .then(() => {
              this.handlePlay();
              this.props.getScore();
            })
            .catch(() => {});
        }
      );
    }
  };

  intervalFun = count => {
    timer = setInterval(() => {
      count = this.intervalContent(count, timer);
      if (count === 8) {
        clearInterval(timer);
        this.setState({
          speed: 70
        });
        this.intervalFun(count);
      } else if (count === 12) {
        clearInterval(timer);
        this.setState({
          speed: 300
        });
        this.intervalFun(count);
      }
    }, this.state.speed);
  };

  intervalContent = (count: any, beginSlow: any) => {
    let num: any;
    if (
      this.state.activedId === this.state.prizeId &&
      this.state.actTimes > this.state.times
    ) {
      // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
      clearInterval(beginSlow);
      // console.log(this.state.awardContentList[this.state.activedId])
      // console.log("this.state.activedId",this.state.activedId)
      // const content=this.state.awardContentList[this.state.activedId];
      this.setState({
        clickCounts: this.state.clickCounts + 1
        // awardContent: content
      });
      setTimeout(() => {
        // 2秒后弹框提示
        this.setState({
          isRolling: false,
          isRollingOver: true
        });
      }, 2000);
      return;
    }

    // 以下是动画执行时对id的判断
    if (this.state.activedId === -1) {
      num = 0;
      this.setState({
        activedId: num
      });
    } else {
      num = this.state.activedId;
      if (num >= 7) {
        num = 0;
        this.setState({
          activedId: num
        });
      } else {
        num = num + 1;
        this.setState({
          activedId: num
        });
      }
    }

    this.setState({
      actTimes: this.state.actTimes + 1
    });
    return count + 1;
  };

  handlePlay () {
    if (!this.state.isRollingOver) {
      // 随机获取一个中奖ID
      const prize = this.props.curIndex;
      this.setState({
        prizeId: prize,
        activedId: 0,
        index: prize
      });
      // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
      // let times = this.state.list.length * Math.floor(Math.random() * 5 + 4)
      const times = this.state.list.length * 4; // 如果对应的遍数改变了，那对应的后边的次数值也需要改变
      // let times = this.state.list.length
      this.setState({
        times: times
      });
      // 抽奖正式开始↓↓
      // console.log("this.state.actTimes",this.state.actTimes)
      const count = 0;

      this.intervalFun(count);
    } else {
      this.setState({
        isRollingOver: true,
        clickCounts: this.state.clickCounts + 1,
        isRolling: false
      });
    }
  }

  closeMask = () => {
    this.setState({
      isRollingOver: false
    });
  };

  render () {
    const { userScore } = this.props;
    const { list, activedId, isRollingOver, index } = this.state;
    return (
      <Page showBack title={i18n.chain.starMinePage.starCoinLuckyDraw}>
        {isRollingOver && (
          <View className='lottery-mask'>
            <View className='lottery-madal'>
              <View className={`${index === 0 ? 'thanks' : 'reword'}`}>
                {index === 0
                  ? (
                  <View className='feedback'>
                    <View className='black'>很遗憾您本次未中奖</View>
                    <View className='red'>谢谢参与</View>
                  </View>
                    )
                  : (
                  <View className='feedback'>
                    <View className='text mb32'>
                      <Text className='congratulation'>恭喜您抽中</Text>
                      <Text className='pink'>
                        {index === 1 && '7星币'}
                        {index === 2 && 'AI问诊'}
                        {index === 3 && '100星币'}
                        {index === 4 && '阳光问卷'}
                        {index === 5 && '10星币'}
                        {index === 6 && '1000元购物券'}
                        {index === 7 && '20星币'}
                      </Text>
                    </View>
                    <View className='black2'>奖励已发放至您的账户</View>
                  </View>
                    )}
              </View>
              <View className='close' onClick={this.closeMask}></View>
            </View>
          </View>
        )}
        <View
          className={`lottery-bg ${
            i18n.getLocaleName() === 'zh' ? '' : 'lottery-bg-en'
          }`}
        >
          <View className='lottery-container'>
            <View className='score'>
              {i18n.chain.starMinePage.currentStarCoin}
              {userScore}
            </View>
            <View className='lottery-box'>
              <View className='centerTR'>
                <RowItem content={list[0]} activedId={activedId} />
                <RowItem content={list[1]} activedId={activedId} />
                <RowItem content={list[2]} activedId={activedId} />
              </View>
              <View className='centerTR'>
                <RowItem content={list[7]} activedId={activedId} />
                <RowItem
                  handleBegin={this.handleBegin}
                  isStartPlay
                  imgUrl={
                    i18n.getLocaleName() === 'zh' ? `${ossHost}lottery_go.png` : `${ossHost}lottery_go_en.png`
                  }
                />
                <RowItem content={list[3]} activedId={activedId} />
              </View>
              <View className='centerTR'>
                <RowItem content={list[6]} activedId={activedId} />
                <RowItem content={list[5]} activedId={activedId} />
                <RowItem content={list[4]} activedId={activedId} />
              </View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}

export default Lottery;
