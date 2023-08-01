import Taro from '@tarojs/taro';
import { View, Image, Text, Input } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, register } from '@actions/common';
import i18n from '@i18n/index';
import utils from '@utils/index';
import Page from '@components/page';
import AuthModal from '@components/AuthModal';
import './index.scss';

const { ossHost } = utils.appConfig;
interface Info {
  name: string;
  idCard: string;
  mobile: string;
  validCode: string;
}
interface IState extends Info {
  warnInfo: Info;
  isPhone: boolean;
  isSend: boolean;
  codeText: string;
  focus: {
    name: boolean;
    idCard: boolean;
    mobile: boolean;
    validCode: boolean;
  };
  clear: {
    name: boolean;
    idCard: boolean;
    mobile: boolean;
    validCode: boolean;
  };
  showModal: boolean;
}
interface IProps {
  register: Function;
  getUserInfo: Function;
  sendMessage: Function;
}
// 倒计时的60s
let time = 60;
@connect(
  state => state.common,
  () => ({
    sendMessage (params) {
      return sendMessage(params);
    },
    register (params) {
      return register(params);
    }
  })
)
class Register extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      idCard: '',
      mobile: '',
      validCode: '',
      isSend: false,
      codeText: '获取验证码',
      isPhone: true,
      warnInfo: {
        name: '',
        idCard: '',
        mobile: '',
        validCode: ''
      },
      focus: {
        name: false,
        idCard: false,
        mobile: false,
        validCode: false
      },
      clear: {
        name: false,
        idCard: false,
        mobile: false,
        validCode: false
      },
      showModal: false
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.loginPage.perfectInformation });
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { token, hasIdCard } = user;
    if (token) {
      if (hasIdCard) {
        Taro.navigateBack();
      }
    }
  }

  handleInput = (key, value) => {
    if (!this.state.clear[key]) {
      switch (key) {
        case 'name':
          this.setState({ name: value.detail.value });
          break;
        case 'idCard':
          this.setState({ idCard: value.detail.value });
          break;
        case 'mobile':
          this.setState({ mobile: value.detail.value });
          break;
        case 'validCode':
          this.setState({ validCode: value.detail.value });
          break;
        default:
          break;
      }
    }
  };

  handleFocus (key) {
    const focus = this.state.focus;
    const warnInfo = this.state.warnInfo;
    const clear = this.state.clear;
    switch (key) {
      case 'name':
        this.setState({
          focus: Object.assign({}, focus, { name: true }),
          warnInfo: Object.assign({}, warnInfo, { name: '' }),
          clear: Object.assign({}, clear, { name: false })
        });
        break;
      case 'idCard':
        this.setState({
          focus: Object.assign({}, focus, { idCard: true }),
          warnInfo: Object.assign({}, warnInfo, { idCard: '' }),
          clear: Object.assign({}, clear, { idCard: false })
        });
        break;
      case 'mobile':
        this.setState({
          focus: Object.assign({}, focus, { mobile: true }),
          warnInfo: Object.assign({}, warnInfo, { mobile: '' }),
          clear: Object.assign({}, clear, { mobile: false })
        });
        break;
      case 'validCode':
        this.setState({
          focus: Object.assign({}, focus, { validCode: true }),
          warnInfo: Object.assign({}, warnInfo, { validCode: '' }),
          clear: Object.assign({}, clear, { validCode: false })
        });
        break;
      default:
        break;
    }
  }

  handleBlur (key) {
    const focus = this.state.focus;
    const clear = this.state.clear;
    switch (key) {
      case 'name':
        this.setState({
          focus: Object.assign({}, focus, { name: false }),
          clear: Object.assign({}, clear, { name: true })
        });
        break;
      case 'idCard':
        this.setState({
          focus: Object.assign({}, focus, { idCard: false })
        });
        break;
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
      case 'name':
        this.setState({
          name: '',
          clear: Object.assign({}, clear, { name: true })
        });
        break;
      case 'idCard':
        this.setState({
          idCard: '',
          clear: Object.assign({}, clear, { idCard: true })
        });
        break;
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

  // 发送短信
  sendMessage () {
    const vm = this;
    const { mobile } = this.state;
    const isMobile = utils.checkPhone(mobile);
    if (time !== 60 || !isMobile) {
      !isMobile &&
        this.setState({
          warnInfo: {
            ...this.state.warnInfo,
            mobile: i18n.chain.user.enterCorrectMobile
          }
        });
      return;
    }
    this.setState({
      isSend: true,
      warnInfo: {
        ...this.state.warnInfo,
        mobile: ''
      }
    });
    this.props.sendMessage({ mobile }).then(() => {
      const setCode = setInterval(() => {
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

  idDisable () {
    const { name, idCard, mobile, validCode, isPhone } = this.state;
    let result = false;
    if (!name || !idCard) {
      result = true;
    }
    if (!isPhone) {
      result = result || !mobile || !validCode;
    }
    return result;
  }

  // 注册
  register = () => {
    const { name, idCard, mobile, validCode, isPhone } = this.state;
    const warnInfo: any = {};
    if (this.idDisable()) {
      return;
    }
    // 校验身份证号是否合法
    if (idCard) {
      !utils.checkIdCard(idCard) && (warnInfo.idCard = i18n.chain.loginPage.idNumberError);
    }
    // 校验手机号是否合法
    if (mobile) {
      !utils.checkPhone(mobile) && (warnInfo.mobile = i18n.chain.user.wrongMobile);
    }

    this.setState({
      warnInfo
    });
    // 判断错误对象是否为空
    const keys = Object.keys(warnInfo);
    if (!keys.length) {
      const params = {
        name,
        idCard
      } as any;
      if (!isPhone) {
        params.mobile = mobile;
        params.validCode = validCode;
      }
      // 注册
      this.props.register(params).then(res => {
        const { userInfo, xAccessToken } = utils.appConfig;
        // 更新用户信息 后跳转个人中心
        Taro.setStorageSync(userInfo, res);
        const { token } = res;
        token && Taro.setStorageSync(xAccessToken, token);
        Taro.showToast({
          title: '认证成功!您的健康奖励已发放,请至【我的服务】列表查看',
          icon: 'none',
          duration: 3000,
          complete: () => {
            Taro.navigateBack();
          }
        });
      });
    }
  };

  jump = () => {
    // Taro.reLaunch({
    //   url: '/pages/user/index/index'
    // });
    this.setState({
      showModal: true
    });
  };

  cancel = () => {
    this.setState(
      {
        showModal: false
      },
      () => {
        Taro.navigateBack();
      }
    );
  };

  goProto = index => {
    Taro.navigateTo({
      url: `/pages/protocal/all/index?index=${index}`
    });
  };

  render () {
    const { showModal } = this.state;
    return (
      <Page showBack title={i18n.chain.loginPage.perfectInformation}>
        <View className='page-register flex '>
          <View className='register-item m-t-16'>
            <View className='register-item-content flex'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.userInfo.realName}</View>
                <Input
                  className='input'
                  placeholderClass='placeholder'
                  placeholder={i18n.chain.loginPage.enterRealName}
                  value={this.state.name}
                  onInput={this.handleInput.bind(this, 'name')}
                  onFocus={this.handleFocus.bind(this, 'name')}
                  onBlur={this.handleBlur.bind(this, 'name')}
                ></Input>
              </View>
              <View className='right'>
                {this.state.clear.name
                  ? (
                  <Image
                    src={`${ossHost}images/close.png`}
                    className='close'
                    onClick={this.clear.bind(this, 'name')}
                  ></Image>
                    )
                  : (
                  <Text className='right'>{this.state.warnInfo.name}</Text>
                    )}
              </View>
            </View>
          </View>
          <View className='register-item no-border'>
            <View className='register-item-content flex'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.userInfo.idCard}</View>
                <Input
                  className='input'
                  placeholderClass='placeholder'
                  type='idcard'
                  maxlength={18}
                  value={this.state.idCard}
                  placeholder={i18n.chain.loginPage.enterIdNumber}
                  onInput={this.handleInput.bind(this, 'idCard')}
                  onFocus={this.handleFocus.bind(this, 'idCard')}
                  onBlur={this.handleBlur.bind(this, 'idCard')}
                ></Input>
              </View>
              <View className='right'>
                {this.state.clear.idCard
                  ? (
                  <Image
                    src={`${ossHost}images/close.png`}
                    className='close'
                    onClick={this.clear.bind(this, 'idCard')}
                  ></Image>
                    )
                  : (
                  <Text className='right'>{this.state.warnInfo.idCard}</Text>
                    )}
              </View>
            </View>
          </View>
          {!this.state.isPhone
            ? (
            <View>
              <View className='register-item m-t-16'>
                <View className='register-item-content flex'>
                  <View className='left flex'>
                    <View className='label'>手机号</View>
                    <Input
                      className='input'
                      type='number'
                      placeholderClass='placeholder'
                      maxlength={11}
                      placeholder='请输入您的手机号'
                      value={this.state.mobile}
                      onFocus={this.handleFocus.bind(this, 'mobile')}
                      onBlur={this.handleBlur.bind(this, 'mobile')}
                      onInput={this.handleInput.bind(this, 'mobile')}
                    ></Input>
                  </View>
                  <View className='right'>
                    {this.state.focus.mobile
                      ? (
                      <Image
                        src={`${ossHost}images/close.png`}
                        className='close'
                        onClick={this.clear.bind(this, 'mobile')}
                      ></Image>
                        )
                      : (
                      <Text className='right'>
                        {this.state.warnInfo.mobile}
                      </Text>
                        )}
                  </View>
                </View>
              </View>
              <View className='register-item no-border'>
                <View className='register-item-content flex'>
                  <View className='left flex'>
                    <View className='label'>验证码</View>
                    <Input
                      className='input code'
                      type='number'
                      placeholderClass='placeholder'
                      placeholder='请输入验证码'
                      value={this.state.validCode}
                      onFocus={this.handleFocus.bind(this, 'validCode')}
                      onBlur={this.handleBlur.bind(this, 'validCode')}
                      onInput={this.handleInput.bind(this, 'validCode')}
                    ></Input>
                  </View>
                  <View className='right flex'>
                    {this.state.focus.validCode
                      ? (
                      <Image
                        src={`${ossHost}images/close.png`}
                        className='close'
                        onClick={this.clear.bind(this, 'validCode')}
                      ></Image>
                        )
                      : (
                      <Text className='right'>
                        {this.state.warnInfo.validCode}
                      </Text>
                        )}
                    <Text>{this.state.warnInfo.validCode}</Text>
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
            </View>
              )
            : null}
          <Text className='tips'>
            {i18n.chain.loginPage.registerTips}
          </Text>
          <View
            className={`register ${this.idDisable() ? 'disable' : ''}`}
            onClick={this.register.bind(this)}
          >
            {i18n.chain.button.confirm}
          </View>

          <View
            className='jump'
            onClick={() => {
              this.jump();
            }}
          >
            {i18n.chain.button.skip}
          </View>
          {showModal && (
            <AuthModal
              onConfirm={() => {
                this.setState({
                  showModal: false
                });
              }}
              onCancel={() => {
                this.cancel();
              }}
            ></AuthModal>
          )}
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
      </Page>
    );
  }
}
export default Register;
