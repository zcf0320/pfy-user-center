import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import i18n from '@i18n/index';
import { customerService, getCouponCount, messageNum } from '@actions/user';
import { getScore } from '@actions/mall';
import { getHealthScore } from '@actions/healthManage';
import './index.scss';

const { ossHost } = utils.appConfig;
const partnerList = [
  `${ossHost}partner-taiping.png`,
  `${ossHost}partner-dadi.png`,
  `${ossHost}partner-sunshine.png`,
  `${ossHost}partner-pku.png`,
  `${ossHost}partner-china-life.png`,
  `${ossHost}partner-anxin.png`,
  `${ossHost}partner-pingan.png`,
  `${ossHost}partner-cpic.png`,
  `${ossHost}partner-zhongan.png`,
  `${ossHost}partner-api.png`
];

interface IState {
  userInfo: any;
  height: string;
  starCoin: number;
  coupon: number;
  score: number;
  messageCount: number;
}
const serviceList = [
  {
    id: 1,
    text: '我的服务',
    img: `${ossHost}user-service.png`,
    url: '/pages/user/service/list/index'
  },
  {
    id: 2,
    text: '我的保单',
    img: `${ossHost}user-policy.png`,
    url: '/Insurance/pages/manage/index'
  },
  {
    id: 3,
    text: '服务兑换',
    img: `${ossHost}user-exchange.png`,
    url: '/pages/user/service/exchange/index'
  },
  {
    id: 4,
    text: '每日任务',
    img: `${ossHost}user-task.png`,
    url: '/PointsMall/pages/task/index'
  }
];
class Setting extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: {},
      height: '',
      starCoin: 0,
      coupon: 0,
      score: 0,
      messageCount: 0
    };
  }

  componentDidMount () {
    if (Taro.getEnv() === 'WEAPP') {
      const rect = Taro.getMenuButtonBoundingClientRect();
      const { statusBarHeight } = Taro.getSystemInfoSync();
      this.setState({
        height: rect.bottom + statusBarHeight + 'px'
      });
    }
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;
    const { checkSession } = utils.Auth;
    const { token } = Taro.getStorageSync(userInfo) || {};

    if (token) {
      checkSession(true).then(res => {
        Taro.setStorageSync(userInfo, res);
        this.setState({
          userInfo: res
        });
      });
      messageNum().then((res: any) => {
        this.setState({
          messageCount: res
        });
      });
      getScore().then((res: any) => {
        this.setState({
          starCoin: res
        });
      });
      getHealthScore().then((res: any) => {
        this.setState({
          score: res.score
        });
      });
      getCouponCount().then((res: any) => {
        this.setState({
          coupon: res
        });
      });
    } else {
      this.setState({
        userInfo: {},
        messageCount: 0,
        starCoin: 0,
        score: 0
      });
    }
  }

  go (key) {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { token } = user;
    if (!token) {
      let url = '/pages/login/index';
      utils.appConfig.isH5 && (url = '/pages/h5/login/index');
      Taro.navigateTo({
        url
      });
      return;
    }
    if (key === 'language') {
      Taro.showLoading({
        title: i18n.chain.common.switchLanguage
      });
      if (Taro.getStorageSync('language')) {
        if (Taro.getStorageSync('language') === 'zh_CN') {
          i18n.locale('en');
          Taro.setStorageSync('language', 'en_US');
        } else {
          i18n.locale('zh');
          Taro.setStorageSync('language', 'zh_CN');
        }
      } else {
        i18n.locale('en');
        Taro.setStorageSync('language', 'en_US');
      }

      const app: any = Taro.getCurrentInstance().app;
      const items: any = app.config.tabBar.list;
      const { home, starMine, healthFile, my } = i18n.chain.tabBar;
      items[0].text = home;
      items[1].text = starMine;
      items[2].text = healthFile;
      items[3].text = my;
      Taro.setTabBarItem({
        index: 0,
        text: home
      });
      Taro.setTabBarItem({
        index: 1,
        text: starMine
      });
      Taro.setTabBarItem({
        index: 2,
        text: healthFile
      });
      Taro.setTabBarItem({
        index: 3,
        text: my
      });
      setTimeout(() => {
        Taro.hideLoading();
        Taro.reLaunch({
          url: '/pages/user/index/index'
        });
      }, 1000);
      return;
    }

    let url = '/setting/info/index';
    key === 'serviceCode' && (url = '/setting/serviceCode/index');
    key === 'proto' && (url = '/pages/protocal/index');
    key === 'address' &&
      (url = '/setting/addressManage/list/index?noSelect=true');
    key === 'auditRecords' && (url = '/setting/auditRecords/index');
    key === 'message' && (url = '/setting/message/index');
    key === 'leavingMessage' && (url = '/setting/leavingMessage/index');
    if (key === 'customerService') {
      if (Taro.getEnv() === 'WEB') {
        customerService()
          .then((res: any) => {
            window.location.href = res;
          })
          .catch(() => {
            //
          });
        return;
      } else {
        return;
      }
    }
    key === 'score' && (url = '/healthManage/score/index');
    if (key === 'star') {
      Taro.switchTab({
        url: '/pages/mall/index/index'
      });
      return;
    }
    Taro.navigateTo({
      url
    });
  }

  goLogin () {
    if (this.state.userInfo.token) {
      return;
    }
    let url = '/pages/login/index';
    utils.appConfig.isH5 && (url = '/pages/h5/login/index');
    Taro.navigateTo({
      url
    });
  }

  onShareAppMessage () {
    return {
      title: i18n.chain.common.title,
      imageUrl:
        'https://senro-tree-sleep-1301127519.cos.ap-nanjing.myqcloud.com/img/%E5%AF%B0%E5%AE%87logo.png',
      path: '/pages/user/setting/index/index'
    };
  }

  goService (url) {
    const { userInfo } = utils.appConfig;
    const { token } = Taro.getStorageSync(userInfo);
    if (!token) {
      let url = '/pages/login/index';
      utils.appConfig.isH5 && (url = '/pages/h5/login/index');
      Taro.navigateTo({
        url
      });
      return;
    }

    Taro.navigateTo({
      url
    });
  }

  render () {
    const { height, starCoin, coupon, score, messageCount } = this.state;
    return (
      <View>
        <View className='user-custom-bar' style={{ height: height }}>
          我的
        </View>

        <View className='page-setting'>
          <View className='user-info'>
            <View className='flex-between'>
              <View
                className={`left flex ${
                  this.state.userInfo.token ? 'al-login' : ''
                }`}
              >
                <View className='head flex'>
                  <Image
                    src={
                      this.state.userInfo.avatarUrl ||
                      `${ossHost}defaultHeader.png`
                    }
                    className='head-img'
                  ></Image>
                </View>
                <View>
                  <View
                    className='user-name'
                    onClick={() => {
                      this.goLogin();
                    }}
                  >
                    {this.state.userInfo.token
                      ? `${
                          this.state.userInfo.name
                            ? this.state.userInfo.name
                            : `GH${this.state.userInfo.mobile}`
                        }`
                      : '立即登录'}
                    {this.state.userInfo.token && (
                      <View
                        className={`id-card ${
                          i18n.getLocaleName() === 'zh' ? '' : 'en'
                        } ${
                          this.state.userInfo.hasIdCard
                            ? ''
                            : `no-id-card ${
                                i18n.getLocaleName() === 'zh' ? '' : 'en'
                              }`
                        }`}
                        onClick={() => {
                          if (!this.state.userInfo.hasIdCard) {
                            Taro.navigateTo({
                              url: '/pages/register/index?back=true'
                            });
                          }
                        }}
                      ></View>
                    )}
                  </View>

                  {this.state.userInfo.mobile
                    ? (
                    <View className='login flex'>
                      <View className='phone'>
                        {utils.hidePhone(this.state.userInfo.mobile)}
                      </View>
                    </View>
                      )
                    : (
                    <View className='login'>登录后可体验更多服务 {'>'}</View>
                      )}
                </View>
              </View>
              <View className='right'>
                <View className='message'>
                  <Image
                    className='message-icon'
                    src={`${ossHost}icon-message.png`}
                    onClick={this.go.bind(this, 'message')}
                  ></Image>
                  {messageCount !== 0 && <View className='red-tips'></View>}
                </View>

                {this.state.userInfo.token && (
                  <View
                    onClick={() => {
                      Taro.navigateTo({
                        url: '/StoreManage/IDCode/index'
                      });
                    }}
                  >
                    <Image
                      className='qrcode'
                      src={`${ossHost}qrcode.png`}
                    ></Image>
                  </View>
                )}
              </View>
            </View>
            <View className='flex-between'>
              <View className='column' onClick={this.go.bind(this, 'star')}>
                <View className='column-value'>{starCoin || '-'}</View>
                <View className='column-text'>星币</View>
              </View>
              <View
                className='column'
                onClick={this.go.bind(this, 'serviceCode')}
              >
                <View className='column-value'>{coupon || '-'}</View>
                <View className='column-text'>服务券(张)</View>
              </View>
              <View className='column' onClick={this.go.bind(this, 'score')}>
                <View className='column-value'>{score || '-'}</View>
                <View className='column-text'>健康评分</View>
              </View>
            </View>
          </View>

          <View className='user-service-list'>
            {serviceList.map(item => {
              return (
                <View
                  key={item.id}
                  className='user-service-item'
                  onClick={() => {
                    this.goService(item.url);
                  }}
                >
                  <Image src={item.img} className='img'></Image>
                  <View>{item.text}</View>
                </View>
              );
            })}
          </View>

          <View className='common'>
            <View className='common-list'>
              <View
                className='common-item'
                onClick={this.go.bind(this, 'info')}
              >
                <View className='common-text'>
                  <Image
                    className='common-item-icon'
                    src={`${ossHost}icon-setting.png`}
                  ></Image>
                  {i18n.chain.user.accountManagement}
                </View>
                <Image className='next' src={`${ossHost}next.png`}></Image>
              </View>

              <View
                className='common-item'
                onClick={this.go.bind(this, 'address')}
              >
                <View className='common-text'>
                  <Image
                    className='common-item-icon'
                    src={`${ossHost}icon-address.png`}
                  ></Image>
                  {i18n.chain.user.addressManagement}
                </View>
                <Image className='next' src={`${ossHost}next.png`}></Image>
              </View>

              <View
                className='common-item'
                onClick={this.go.bind(this, 'auditRecords')}
              >
                <View className='common-text'>
                  <Image
                    className='common-item-icon'
                    src={`${ossHost}icon-audit.png`}
                  ></Image>
                  {i18n.chain.user.auditRecord}
                </View>
                <Image className='next' src={`${ossHost}next.png`}></Image>
              </View>

              <View
                className='common-item'
                onClick={this.go.bind(this, 'proto')}
              >
                <View className='common-text'>
                  <Image
                    className='common-item-icon'
                    src={`${ossHost}icon-user-protocol.png`}
                  ></Image>
                  {i18n.chain.user.userAgreement}
                </View>
                <Image className='next' src={`${ossHost}next.png`}></Image>
              </View>

              <View
                className='common-item'
                onClick={this.go.bind(this, 'leavingMessage')}
              >
                <View className='common-text'>
                  <Image
                    className='common-item-icon'
                    src={`${ossHost}icon-leaving-message.png`}
                  ></Image>
                  {i18n.chain.user.messageBoard}
                </View>
                <Image className='next' src={`${ossHost}next.png`}></Image>
              </View>
              {process.env.TARO_ENV === 'h5'
                ? (
                <View
                  className='common-item ml-78'
                  onClick={this.go.bind(this, 'customerService')}
                >
                  <View className='common-text'>
                    <Image
                      className='common-item-icon'
                      src={`${ossHost}icon-contact.png`}
                    ></Image>
                    {i18n.chain.user.customerService}
                  </View>
                  <Image className='next' src={`${ossHost}next.png`}></Image>
                </View>
                  )
                : (
                <View className='common-item ml-78'>
                  <Button
                    className='contact-button'
                    openType='contact'
                  ></Button>

                  <View className='common-text'>
                    <Image
                      className='common-item-icon'
                      src={`${ossHost}icon-contact.png`}
                    ></Image>
                    {i18n.chain.user.customerService}
                  </View>
                  <Image className='next' src={`${ossHost}next.png`}></Image>
                </View>
                  )}
              {/*
              <View
                className='common-item'
                onClick={this.go.bind(this, 'language')}
              >
                <Image
                  className='common-item-icon'
                  src={`${utils.appConfig.ossHost}icon_list_V1.7.svg`}
                ></Image>
                <Text className='common-text'>{i18n.chain.user.language}</Text>
                  </View>
                */}
            </View>
          </View>

          <View className='friend'>
            <View className='friend-title'>
              <Text className='friend-title-top'>寰宇关爱合作伙伴</Text>
            </View>
            <View className='friend-list flex'>
              {partnerList.map((item, index) => {
                return (
                  <View className='friend-item flex' key={item}>
                    <Image
                      className={`img-${index}`}
                      src={item}
                      onClick={() => {
                        Taro.navigateTo({
                          url: '/Healthy/pages/menstruation/index'
                        });
                      }}
                    ></Image>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Setting;
