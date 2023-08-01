import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import utils from '@utils/index';
import { weixinPhone, lastLoginTime, brandAndOSType } from '@actions/common';
import ProtoModal from '@components/protoModal';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  login: Function;
}
interface IState {
  code: string;
  showAuth: boolean;
  showAgree: boolean;
}
// @connect(state => state.common, {...actions})
class Login extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      code: '',
      showAuth: true,
      showAgree: false
    };
  }

  componentWillUnmount () {
    const { showAgree } = this.state;
    if (showAgree) {
      const { userInfo, xAccessToken } = utils.appConfig;
      Taro.removeStorageSync(userInfo);
      Taro.removeStorageSync(xAccessToken);
    }
  }

  componentDidShow () {
    const vm = this;
    this.setState({
      showAuth: !utils.Auth.checkAuth()
    });
    Taro.login({
      success (res) {
        const { code } = res;
        vm.setState({
          code
        });
      }
    });
    const { xAccessToken } = utils.appConfig;
    if (Taro.getStorageSync(xAccessToken)) {
      Taro.switchTab({
        url: '/pages/user/index/index'
      });
    }
  }

  getUserInfo () {
    // 校验是否授权
    const { checkSession } = utils.Auth;
    const { weixinUserInfo } = utils.appConfig;
    // if( checkAuth() ) {
    //     this.goRegister()
    //     return
    // }

    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        Taro.setStorageSync(weixinUserInfo, res);
        checkSession(true).then(result => {
          this.setState({
            showAuth: false
          });
          const { token, hasIdCard, hasAgreeNotification } = result;
          const { userInfo, xAccessToken } = utils.appConfig;
          if (hasAgreeNotification) {
            Taro.setStorageSync(userInfo, result);

            token && Taro.setStorageSync(xAccessToken, token);
            if (token) {
              lastLoginTime();
              const { brand, system } = Taro.getSystemInfoSync();
              brandAndOSType({
                brand,
                osType: system
              });
              if (hasIdCard) {
                Taro.navigateBack({
                  delta: 1
                });
              } else {
                Taro.navigateTo({
                  url: '/pages/register/index'
                });
              }
            }
          } else {
            token &&
              this.setState({
                showAgree: true
              });
          }
        });
      }
    });
  }

  goLogin () {
    Taro.navigateTo({
      url: '/pages/h5/login/index'
    });
  }

  getPhone (e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { iv, encryptedData } = e.detail;
      const { code } = this.state;
      const params = {
        code,
        iv,
        encryptedData,
        appid: utils.appConfig.appid
      };
      weixinPhone(params).then((res: any) => {
        const { token, hasIdCard, hasAgreeNotification } = res;
        const { userInfo, xAccessToken } = utils.appConfig;
        Taro.setStorageSync(userInfo, res);
        token && Taro.setStorageSync(xAccessToken, token);
        if (hasAgreeNotification) {
          // 更新用户信息 后跳转个人中心
          Taro.setStorageSync(userInfo, res);
          token && Taro.setStorageSync(xAccessToken, token);
          if (token) {
            if (hasIdCard) {
              Taro.navigateBack({
                delta: 1
              });
            } else {
              Taro.navigateTo({
                url: '/pages/register/index'
              });
            }
          }
        } else {
          this.setState({
            showAgree: true
          });
        }
      });
    } else {
      Taro.showToast({
        title: '获取手机号失败',
        icon: 'none',
        duration: 3000
      });
    }
  }

  goProto = index => {
    Taro.navigateTo({
      url: `/pages/protocal/all/index?index=${index}`
    });
  };

  getCode () {
    const vm = this;
    Taro.login({
      success (res) {
        const { code } = res;
        vm.setState({
          code,
          showAgree: false
        });
      }
    });
  }

  render () {
    const { showAuth, showAgree } = this.state;
    return (
      <View className='page-login flex'>
        {showAgree
          ? (
          <ProtoModal
            close={() => {
              this.getCode();
            }}
            agree={() => {
              utils.Auth.checkSession(true).then(res => {
                const { token, hasIdCard } = res;
                const { userInfo, xAccessToken } = utils.appConfig;
                Taro.setStorageSync(userInfo, res);
                token && Taro.setStorageSync(xAccessToken, token);
                if (token) {
                  if (hasIdCard) {
                    Taro.navigateBack({
                      delta: 1
                    });
                  } else {
                    Taro.navigateTo({
                      url: '/pages/register/index?isJump=true'
                    });
                  }
                }
              });
            }}
          />
            )
          : null}
        {showAuth && (
          <Button
            onClick={this.getUserInfo.bind(this)}
            className='auth'
          ></Button>
        )}

        <Image
          src={`${utils.appConfig.ossHost}login_bg.png`}
          className='login-bg'
        ></Image>
        <Button
          className='wx-login flex'
          open-type='getPhoneNumber'
          onGetPhoneNumber={e => {
            this.getPhone(e);
          }}
        >
          <Image src={`${ossHost}images/wechat.png`} className='wechat'></Image>
          <Text>微信登录</Text>
        </Button>
        <View className='login-phone flex' onClick={this.goLogin.bind(this)}>
          手机号验证码登录
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
export default Login;
