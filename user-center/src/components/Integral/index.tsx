import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import { sign } from '@actions/common';
import { GET_SIGN_LIST } from '@constants/common';
import i18n from '@i18n/index';
import './index.scss';

interface IProps {
  setSignList: Function;
  signList: Array<any>;
  close: Function;
  showIntegral: boolean;
}
interface IState {
  changeState: boolean;
}

@connect(
  state => {
    return Object.assign({}, state.user, state.common);
  },
  dispatch => ({
    setSignList (data) {
      dispatch({
        type: GET_SIGN_LIST,
        payload: data
      });
    }
  })
)
class Integral extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      changeState: false
    };
  }

  componentDidMount () {
    if (this.props.showIntegral) {
      setTimeout(() => {
        this.setState({
          changeState: true
        });
      }, 500);
    }
  }

  getDayNum = () => {
    const { signList } = this.props;
    const signArr = signList.filter(item => {
      return item === 1;
    });
    return signArr.length;
  };

  sign = () => {
    const { signList } = this.props;
    const day = new Date().getDay() - 1;
    if (signList[day]) {
      return;
    }
    sign().then(() => {
      signList[day] = 1;
      this.props.setSignList([...signList]);
      Taro.showToast({
        title: i18n.chain.integralComponent.checkSucceeded,
        icon: 'none',
        duration: 1000
      });
      setTimeout(() => {
        this.props.close();
      }, 1000);
    });
  };

  render () {
    const WEEKLIST = [
      i18n.chain.integralComponent.monday,
      i18n.chain.integralComponent.tuesday,
      i18n.chain.integralComponent.wednesday,
      i18n.chain.integralComponent.thursday,
      i18n.chain.integralComponent.friday,
      i18n.chain.integralComponent.saturday,
      i18n.chain.integralComponent.sunday
    ];
    const { signList } = this.props;
    return (
      <View className='component-integral flex'>
        <View
          className={`integral-content flex ${
            this.state.changeState ? 'show' : ''
          }`}
        >
          <View className='modal flex'>
            <View className='week flex'>
              {signList && signList.length
                ? signList.map((item, index) => {
                  return (
                      <View className='week-item flex' key={WEEKLIST[index]}>
                        <View
                          className={`item-content flex ${
                            item ? 'active' : ''
                          }`}
                        >
                          {index === 6
                            ? (
                            <View className='week-last'>
                              <View className='add-score'></View>
                              <View className='start big'></View>
                              <View className='start sm'></View>
                            </View>
                              )
                            : (
                            <View className='start'></View>
                              )}
                          {item
                            ? null
                            : (
                            <View className='integral-score'>+3</View>
                              )}
                        </View>
                        <View className={`name ${item ? 'active' : ''}`}>
                          {WEEKLIST[index]}
                        </View>
                      </View>
                  );
                })
                : null}
            </View>
            <View
              className={`sign flex ${
                signList[new Date().getDay() - 1] ? 'disable' : ''
              }`}
              onClick={() => {
                this.sign();
              }}
            >
              {signList[new Date().getDay() - 1]
                ? i18n.chain.integralComponent.signedToday
                : i18n.chain.integralComponent.signNow}
            </View>
            <View className='text'>{i18n.chain.integralComponent.signWeek}</View>
          </View>
          <View
            className='close'
            onClick={() => {
              this.props.close();
            }}
          ></View>
        </View>
      </View>
    );
  }
}
export default Integral;
