import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image, Input } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import { connect } from 'react-redux';
import {
  sendMessage,
  login,
  lastLoginTime,
  brandAndOSType
} from '@actions/common';
import ProtoModal from '@components/protoModal';

import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  sendMessage: (object) => any;
  login: (object) => any;
}
interface IState {
  mobile: string;
  validCode: string;
  agree: boolean;
  showAgree: boolean;

  isSend: boolean;
  codeText: string;
}
let time = 60;
let setCode;
@connect(
  state => state.common,
  () => ({
    sendMessage (params) {
      return sendMessage(params);
    },
    login (params) {
      return login(params);
    }
  })
)
class H5Login extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      mobile: '',
      validCode: '',
      agree: false,
      showAgree: false,

      isSend: false,
      codeText: i18n.chain.loginPage.getCode
    };
  }

  // 组件销毁清除定时器
  componentWillUnmount () {
    clearInterval(setCode);
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { token, hasAgreeNotification } = user;
    if (token) {
      if (hasAgreeNotification) {
        Taro.navigateBack();
      } else {
        this.setState({
          showAgree: true
        });
      }
    }
  }

  config: Config = {
    navigationBarTitleText: i18n.chain.loginPage.login
  };

  // 去注册
  goRegister () {
    Taro.navigateTo({
      url: '/pages/register/index?isOver=true'
    });
  }

  // 发送短信
  sendMessage () {
    const vm = this;
    const { mobile, isSend } = this.state;
    const isMobile = utils.checkPhone(mobile);
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
            codeText: i18n.chain.loginPage.reacquire,
            isSend: false
          });
        } else {
          time--;
          vm.setState({
            codeText: `${time}s`
          });
        }
      }, 1000);
    });
  }

  handleInput = (key, value) => {
    switch (key) {
      case 'mobile':
        this.setState({ mobile: value.detail.value });
        break;
      case 'validCode':
        this.setState({ validCode: value.detail.value });
        break;
      default:
        break;
    }
  };

  clear (key) {
    switch (key) {
      case 'mobile':
        this.setState({
          mobile: ''
        });
        break;
      case 'validCode':
        this.setState({
          validCode: ''
        });
        break;
      default:
        break;
    }
  }

  login () {
    const { router } = getCurrentInstance();
    const { mobile, validCode } = this.state;
    if (!validCode || !mobile) {
      return;
    }
    const params: {
      mobile: string;
      validCode: string;
      extraParams?: Object;
    } = {
      mobile,
      validCode
    };
    if (router?.params && router.params.param) {
      params.extraParams = {
        param: encodeURIComponent(router.params.param)
      };
    }
    this.props
      .login(params)
      .then(res => {
        const { userInfo, xAccessToken } = utils.appConfig;
        // 更新用户信息 后跳转个人中心
        const { token, hasIdCard, hasAgreeNotification } = res;
        Taro.setStorageSync(userInfo, res);
        token && Taro.setStorageSync(xAccessToken, token);
        lastLoginTime();
        const { brand, system } = Taro.getSystemInfoSync();
        brandAndOSType({
          brand,
          osType: system
        });

        if (hasAgreeNotification) {
          if (hasIdCard) {
            Taro.navigateBack({
              delta: 1
            });
          } else {
            Taro.redirectTo({
              url: '/pages/register/index'
            });
          }
        } else {
          this.setState({
            showAgree: true
          });
        }
      })
      .catch(() => {});
  }

  // 同意协议
  agree = () => {
    this.setState({
      agree: !this.state.agree
    });
  };

  // 申诉账号
  applealNum = () => {
    Taro.navigateTo({
      url: '/account/appeal/index'
    });
  };

  go (type) {
    let url = '';
    type === 'user' && (url = '/pages/protocal/user/index');
    type === 'auth' && (url = '/pages/protocal/auth/index');
    Taro.navigateTo({
      url
    });
  }

  goProto = index => {
    Taro.navigateTo({
      url: `/pages/protocal/all/index?index=${index}`
    });
  };

  render () {
    const { mobile, validCode, showAgree } = this.state;
    return (
      <View className='page-h5-login flex'>
        {/* <Image src='' className='bg-image'></Image> */}
        {showAgree
          ? (
          <ProtoModal
            close={() => {
              this.setState({
                showAgree: false
              });
            }}
            agree={() => {
              utils.Auth.checkSession(true).then(res => {
                const { userInfo, xAccessToken } = utils.appConfig;
                const { token, hasIdCard } = res;
                Taro.setStorageSync(userInfo, res);
                token && Taro.setStorageSync(xAccessToken, token);
                if (hasIdCard) {
                  Taro.navigateBack();
                } else {
                  Taro.navigateTo({
                    url: '/pages/register/index'
                  });
                }
              });
            }}
          ></ProtoModal>
            )
          : null}
        <Image
          src={`${utils.appConfig.ossHost}logo.png`}
          className='logo'
        ></Image>
        <View className='login-modal'>
          <View className='item flex'>
            <View className='left flex'>
              <Image
                className='label'
                src={`${ossHost}images/user.png`}
              ></Image>
              <Input
                className='input'
                type='text'
                maxlength={11}
                value={this.state.mobile}
                placeholder={i18n.chain.loginPage.inputPhone}
                onInput={this.handleInput.bind(this, 'mobile')}
                placeholderClass='placeholder'
              ></Input>
            </View>
            {this.state.mobile
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
            <View className='left flex code'>
              <Image
                className='label'
                src={`${ossHost}images/password.png`}
              ></Image>
              <Input
                className='input'
                type='number'
                value={this.state.validCode}
                placeholder={i18n.chain.loginPage.code}
                maxlength={6}
                onInput={this.handleInput.bind(this, 'validCode')}
                placeholderClass='placeholder'
              ></Input>
              {this.state.validCode
                ? (
                <Image
                  src={`${ossHost}images/close.png`}
                  className='right'
                  onClick={this.clear.bind(this, 'validCode')}
                />
                  )
                : null}
            </View>

            <View
              className={`send-message ${this.state.isSend ? 'disable' : ''}`}
              onClick={this.sendMessage.bind(this)}
            >
              {this.state.codeText}
            </View>
          </View>
        </View>
        <View className='appeal'>
          {i18n.chain.loginPage.notCode}
          <Text className='btn' onClick={this.applealNum.bind(this)}>
            {i18n.chain.loginPage.accountAppeal}
          </Text>
        </View>
        <View
          className={`login ${!mobile || !validCode ? 'disable' : ''}`}
          onClick={this.login.bind(this)}
        >
          {i18n.chain.loginPage.login}
        </View>
        <View className='proto-list'>
          <Text
            onClick={() => {
              this.goProto(1);
            }}
          >
            《隐私权保护声明》、
          </Text>

          <Text
            onClick={() => {
              this.goProto(3);
            }}
          >
            《寰宇关爱用户注册及使用协议》
          </Text>
        </View>
      </View>
    );
  }
}
export default H5Login;
