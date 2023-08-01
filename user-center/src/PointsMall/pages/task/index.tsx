import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { getList } from '@actions/task';
import { connect } from 'react-redux';
import { GET_TASK_LIST } from '@constants/task';
import { GET_USER_SCORE } from '@constants/mall';
import { getScore } from '@actions/mall';
import Page from '@components/page';
import AuthModal from '@components/AuthModal';
import './index.scss';

interface IProps {
  getList: Function;
  addDailyHealth: Function;
  taskList: Array<any>;
  healthRes: any;
  userScore: number;
  getScore: Function;
  getSignList: Function;
}

interface IState {
  showModal: boolean;
}

@connect(
  state => Object.assign({}, state.task, state.mall),
  dispatch => ({
    getList () {
      getList().then(res => {
        dispatch({
          type: GET_TASK_LIST,
          payload: res
        });
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
class MallTask extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidShow () {
    const { xAccessToken } = utils.appConfig;
    const token = Taro.getStorageSync(xAccessToken);
    if (token) {
      this.props.getList();
      this.props.getScore();
    }
  }

  open (item: any) {
    const { userInfo } = utils.appConfig;
    const { hasIdCard } = Taro.getStorageSync(userInfo);

    switch (item.taskId) {
      case '1':
        // 签到
        Taro.switchTab({
          url: '/pages/mall/index/index'
        });
        break;
      case '2':
        // 百科
        Taro.navigateTo({
          url: '/article/index/index'
        });
        break;
      case '3':
        // 血压
        if (hasIdCard) {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}record/recordDetail&code=BLOOD_PRESSURE`
          });
        } else {
          this.setState({
            showModal: true
          });
        }
        break;
      case '4':
        // 血糖
        if (hasIdCard) {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}record/recordDetail&code=BLOOD_GLUCOSE`
          });
        } else {
          this.setState({
            showModal: true
          });
        }
        break;
      case '5':
        Taro.navigateTo({
          url: '/PointsMall/pages/lottery/index'
        });
        break;
      case '6':
        // 百科
        Taro.navigateTo({
          url: '/article/index/index'
        });
        break;
      case '7':
        // 填写健康档案
        // 是否实名
        if (hasIdCard) {
          Taro.switchTab({
            url: '/Healthy/pages/index'
          });
        } else {
          this.setState({
            showModal: true
          });
        }
        break;
      case '8':
        Taro.navigateTo({
          url: '/setting/workInfo/index'
        });
        break;
      default:
        break;
    }
  }

  render () {
    const { showModal } = this.state;
    const { taskList, userScore } = this.props;
    return (
      <Page showBack title={i18n.chain.bannerComponent.dailyTasks}>
        <View className='mall-task'>
          <View
            className='head'
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/mall/records/index'
              });
            }}
          >
            <View className='flex content'>
              <View className='flex left'>
                <View className='yellow'>
                  {i18n.chain.starMinePage.doTask}{' '}
                  {i18n.chain.starMinePage.earnStar}
                </View>
                <View className='socre'>
                  {i18n.chain.starMinePage.myStar}:
                  <Text className='num'>{userScore}</Text>
                  <Text className='fen'>
                    {i18n.chain.starMinePage.individual}
                  </Text>
                  <View className='topoint'></View>
                </View>
              </View>
              {/* <View
                className="right flex"
                onClick={() => {
                  Taro.switchTab({
                    url: "/pages/mall/index/index"
                  });
                }}
              >
                <View>去使用</View>
                <View className="use"></View>
              </View> */}
            </View>
          </View>

          <View className='list'>
            <View className='good-title'>
              {i18n.chain.starMinePage.earnStar}
              <View className='line'></View>
              <View
                className='lucky'
                onClick={() => {
                  Taro.navigateTo({
                    url: '/PointsMall/pages/lottery/index'
                  });
                }}
              >
                {i18n.chain.starMinePage.starCoinLuckyDraw}
              </View>
            </View>
            {taskList.map((item: any, index) => (
              <View
                className={`task flex ${index === 0 ? '' : 'shadow'}`}
                key={item.taskId}
              >
                <View className='left flex'>
                  <Image className='img' src={item.icon} />
                  <View className='box-list'>
                    <View className='text'>
                      {item.content}
                      {(item.taskId === '2' || item.taskId === '6') && (
                        <Text>
                          （{item.dailyCount}/{item.dailyCompletionCount}）
                        </Text>
                      )}
                    </View>
                    <View className='btm flex'>
                      <View className='icon'></View>
                      <View className='num'>{item.introduction}</View>
                    </View>
                  </View>
                </View>
                {item.allCompletionCount && (
                  <View
                    className={`right ${
                      item.allCompletionCount !== item.allCount ? 'red' : 'gray'
                    }`}
                    onClick={() => {
                      if (item.allCompletionCount === item.allCount) {
                        return;
                      }
                      this.open(item);
                    }}
                  >
                    {i18n.chain.starMinePage.go}
                    {item.buttonName}
                  </View>
                )}
                {item.dailyCompletionCount && (
                  <View
                    className={`right ${
                      item.dailyCompletionCount !== item.dailyCount
                        ? 'red'
                        : 'gray'
                    }`}
                    onClick={() => {
                      if (item.dailyCompletionCount === item.dailyCount) {
                        return;
                      }
                      this.open(item);
                    }}
                  >
                    {i18n.chain.starMinePage.go}
                    {item.buttonName}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {showModal && (
          <AuthModal
            onConfirm={() => {
              this.setState({
                showModal: false
              });
              Taro.navigateTo({
                url: '/pages/register/index'
              });
            }}
            onCancel={() => {
              this.setState({
                showModal: false
              });
            }}
          ></AuthModal>
        )}
      </Page>
    );
  }
}
export default MallTask;
