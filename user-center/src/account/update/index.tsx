import Taro from '@tarojs/taro';
import { View, Image, Input } from '@tarojs/components';
import { Component } from 'react';
import { IStoreProps } from '@reducers/interface';
import utils from '@utils/index';
import { connect } from 'react-redux';
import { sendMessage } from '@actions/common';
import { updateUserInfo } from '@actions/user';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  reducers: any;
  updateUserInfo: Function;
  sendMessage: (object) => any;
}
interface IState {
  mobile: string;
  validCode: string;
  focus: {
    mobile: boolean;
    validCode: boolean;
  };
  clear: {
    mobile: boolean;
    validCode: boolean;
  };
  isSend: boolean;
  codeText: string;
}
type PropsType = IStoreProps & IProps;
let time = 60;
let setCode;
@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: {
          accountAppealInfo: state.user.accountAppealInfo
        }
      }
    );
  },
  () => ({
    sendMessage (params) {
      return sendMessage(params);
    }
  })
)
class UpdateInfo extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      mobile: '',
      validCode: '',
      focus: {
        mobile: false,
        validCode: false
      },
      clear: {
        mobile: false,
        validCode: false
      },
      isSend: false,
      codeText: '获取验证码'
    };
  }

  // 组件销毁清除定时器
  componentWillUnmount () {
    clearInterval(setCode);
  }

  // 发送短信
  sendMessage () {
    const vm = this;
    const { mobile, isSend } = this.state;
    const isMobile = utils.checkPhone(mobile);
    if (!isMobile && mobile) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
    }
    if (!isMobile || isSend) {
      return;
    }
    this.setState({
      isSend: true
    });
    time = 60;
    this.props.sendMessage({ mobile }).then(() => {
      setCode = setInterval(() => {
        if (!time) {
          time = 60;
          setCode && clearInterval(setCode);
          vm.setState({
            codeText: '重新获取',
            isSend: false
          });
        } else {
          time--;
          vm.setState({
            codeText: `${time}s`,
            isSend: true
          });
        }
      }, 1000);
    });
  }

  handleInput = (key, value) => {
    if (key === 'mobile') {
      this.setState({ mobile: value.detail.value });
    }
    if (key === 'validCode') {
      this.setState({ validCode: value.detail.value });
    }
  };

  handleFocus (key) {
    const focus = this.state.focus;
    const clear = this.state.clear;
    switch (key) {
      case 'mobile':
        this.setState({
          focus: Object.assign({}, focus, { mobile: true }),
          clear: Object.assign({}, clear, { mobile: false })
        });
        break;
      case 'validCode':
        this.setState({
          focus: Object.assign({}, focus, { validCode: true }),
          clear: Object.assign({}, clear, { validCode: false })
        });
        break;
      default:
        break;
    }
  }

  handleBlur (key) {
    const focus = this.state.focus;

    switch (key) {
      case 'mobile':
        this.setState({
          focus: Object.assign({}, focus, { mobile: false })
        });
        break;
      case 'validCode':
        this.setState({
          focus: Object.assign({}, focus, { validCode: false })
        });
        break;
      default:
        break;
    }
  }

  clear (key) {
    const clear = this.state.clear;
    switch (key) {
      case 'mobile':
        this.setState({
          mobile: '',
          clear: Object.assign({}, clear, { mobile: true })
        });
        break;
      case 'validCode':
        this.setState({
          validCode: '',
          clear: Object.assign({}, clear, { validCode: true })
        });
        break;
      default:
        break;
    }
  }

  updateInfo () {
    const { mobile, validCode } = this.state;
    if (!validCode || !mobile) {
      return;
    }
    const { accountAppealInfo } = this.props.reducers;
    const params = utils.extendObjects({}, accountAppealInfo);
    params.oldMobile = accountAppealInfo.mobile;
    params.mobile = mobile;
    params.mobile = mobile;
    params.validCode = validCode;
    updateUserInfo(params).then(() => {
      Taro.showModal({
        title: '',
        content: '是否用新手机号登录？',
        cancelText: '取消',
        confirmText: '确定',
        cancelColor: '#999999',
        confirmColor: '#FE9A51',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateBack({
              delta: 3
            });
          } else {
            Taro.reLaunch({ url: '/pages/user/index/index' });
          }
        }
      });
    });
  }

  render () {
    const { mobile, validCode } = this.state;
    return (
      <Page showBack title='完善信息'>
        <View className='page-update'>
          <View className='login-modal'>
            <View className='item flex'>
              <View className='left flex'>
                <View className='labelName'>新手机号</View>
                <Input
                  className='input'
                  type='text'
                  value={this.state.mobile}
                  placeholder='请输入新手机号'
                  onFocus={this.handleFocus.bind(this, 'mobile')}
                  onBlur={this.handleBlur.bind(this, 'mobile')}
                  onInput={this.handleInput.bind(this, 'mobile')}
                  placeholderClass='placeholder'
                ></Input>
              </View>
              {this.state.focus.mobile
                ? (
                <Image
                  src={`${ossHost}images/close.png`}
                  className='right'
                  onClick={this.clear.bind(this, 'mobile')}
                />
                  )
                : null}
            </View>
            <View className='item flex no-border'>
              <View className='left flex'>
                <View className='labelName'>验证码</View>
                <Input
                  className='input'
                  type='text'
                  value={this.state.validCode}
                  placeholder='验证码'
                  onFocus={this.handleFocus.bind(this, 'validCode')}
                  onBlur={this.handleBlur.bind(this, 'validCode')}
                  onInput={this.handleInput.bind(this, 'validCode')}
                  placeholderClass='placeholder'
                ></Input>
                <View
                  className={`send-message ${
                    this.state.isSend ? 'disable' : ''
                  }`}
                  onClick={this.sendMessage.bind(this)}
                >
                  {this.state.codeText}
                </View>
              </View>
            </View>
          </View>
          <View
            className={`login ${!mobile || !validCode ? 'disable' : ''}`}
            onClick={this.updateInfo.bind(this)}
          >
            确认修改
          </View>
        </View>
      </Page>
    );
  }
}
export default UpdateInfo;
