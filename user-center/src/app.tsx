import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { brandAndOSType, lastLoginTime } from '@actions/common';
import {
  SET_TOKEN,
  SET_USER_INFO,
  SET_WEIXIN_USERINFO
} from '@constants/common';
import configStore from './store';
import appConfig from './utils/appConfig';
import i18n from './i18n';
import './app.scss';

if (process.env.TARO_ENV === 'weapp') {
  require('./utils/ald-stat.js');
}

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
//   require('nerv-devtools');
// }

const store = configStore();

class App extends Component<any> {
  componentDidMount () {
    const { router } = getCurrentInstance();
    const { xAccessToken, userInfo, weixinUserInfo } = appConfig;

    // 判断是从东财进来的url
    if (router?.params && router.params.utm_company === 'B00003') {
      Taro.redirectTo({
        url: '/pages/user/index/index'
      });
    } else {
      // todo something
    }
    const token = Taro.getStorageSync(xAccessToken) || '';
    const user = Taro.getStorageSync(userInfo) || {};
    const weixinUser = Taro.getStorageSync(weixinUserInfo) || {};

    const { brand, system } = Taro.getSystemInfoSync();

    if (token) {
      brandAndOSType({
        brand,
        osType: system
      })
        .then(() => {})
        .catch(() => {});
      lastLoginTime()
        .then(() => {})
        .catch(() => {});
    }
    store.dispatch({
      type: SET_TOKEN,
      payload: token
    });
    store.dispatch({
      type: SET_USER_INFO,
      payload: user
    });
    store.dispatch({
      type: SET_WEIXIN_USERINFO,
      payload: weixinUser
    });
  }

  onLaunch () {
    const app: any = Taro.getCurrentInstance().app;
    const items: any = app.config.tabBar.list;
    if (Taro.getStorageSync('language')) {
      if (Taro.getStorageSync('language') === 'zh_CN') {
        i18n.locale('zh');
      } else {
        i18n.locale('en');
      }
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
    }
  }

  componentDidShow () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
export default App;
