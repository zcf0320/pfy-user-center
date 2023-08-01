import Taro from '@tarojs/taro';
import appConfig from './appConfig';
import httpService from './request';
import configStore from '../store';

// const store = configStore()
export default class Auth {
  // 微信的code
  wxCode: string;
  // 检查是否授权
  static checkAuth = (): boolean => {
    const { weixinUserInfo } = appConfig;
    return !!Taro.getStorageSync(weixinUserInfo);
  };

  // 是否登录过
  static isLogin = (): boolean => {
    const store = configStore();
    return !!store.getState().common.token;
  };

  /**
   * 检查微信登录状态
   * @param isUpdateUserInfo 是否需要更新用户信息
   * 检查微信登录信息
   * 如果登录过期：清空用户数据，重新登录
   * 没过期：如果没有用户数据还是走登录逻辑，如果有用户数据，第一次会更新用户信息
   * 如果用户操作，并且需要更新用户信息的时候isUpdateUserInfo 给true就行了
   */
  static checkSession = (isUpdateUserInfo = false) => {
    const { userInfo } = appConfig;
    const vm = new Auth();
    return new Promise(resolve => {
      const { isH5, isWeapp } = appConfig;
      isWeapp &&
        Taro.checkSession({
          // 微信登录未过期
          async success () {
            if (Taro.getStorageSync(userInfo)) {
              if (isUpdateUserInfo) {
                const user = await vm.getUserInfo();
                resolve(user);
              }
            } else {
              // 如果没有用户信息，重新获取用户信息
              const loginInfo = await vm.login();

              resolve(loginInfo);
            }
          },
          // 微信登录过期，清空数据重新登录
          async fail () {
            const loginInfo = await vm.login();
            resolve(loginInfo);
          }
        });
      if (isH5) {
        vm.getUserInfo().then(res => {
          resolve(res);
        }).catch(() => {

        });
      }
    });
  };

  login = () => {
    const vm = this;
    return new Promise(resolve => {
      const isAuth = Auth.checkAuth();
      Taro.login({
        async success (res: { code: string; errMsg: string }) {
          const { code } = res;
          if (code) {
            // 根据code获取用户信息
            vm.wxCode = code;
            console.log(code);

            /**
             * 如果已经授权了的，获取微信用户信息之后在获取用户信息
             */

            if (isAuth) {
              const userInfo = await vm.getWxUserInfo();
              resolve(userInfo);
            } else {
              const userInfo = await vm.getWxUserInfo();
              resolve(userInfo);
            }
            // 显示页面的授权model
            // !isAuth && Taro.getSetting && Taro.getSetting({
            //     async success(res) {
            //         console.log(res)
            //         if (res.authSetting['scope.userInfo']) {
            //             console.log('23')

            //         }
            //     }
            // })
          }
        },
        fail (err: { errMsg: string }) {
          const { errMsg } = err;
          Taro.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          });
          console.log(errMsg);
        }
      });
    });
  };

  /**
   * 获取微信用户信息存入storage中
   * 之后再获取用户信息
   */
  getWxUserInfo = () => {
    return new Promise(resolve => {
      this.getUserInfo().then(res => {
        resolve(res);
      });
    });
  };

  getUserInfo = async () => {
    const { userInfo, xAccessToken, weixinUserInfo, appid } = appConfig;
    let params: any = {};
    const weixinUser = Taro.getStorageSync(weixinUserInfo);
    const { encryptedData, iv, rawData, signature } = weixinUser;
    if (this.wxCode) {
      params = {
        code: this.wxCode,
        encryptedData,
        iv,
        rawData,
        signature,
        appid
      };
    }
    const res: any = await httpService({
      url: this.wxCode ? 'third/user/login' : 'third/user/info',
      data: params,
      method: this.wxCode ? 'POST' : 'GET',
      showLoading: !!this.wxCode
    });
    // const { hasAgreeNotification } = res
    if (this.wxCode) {
      Taro.setStorageSync(userInfo, res);
      const { token } = res;
      token && Taro.setStorageSync(xAccessToken, token);
      // lastLoginTime()
    }
    this.wxCode &&
      Taro.showToast({
        title: '授权成功~',
        icon: 'success'
      });
    return res;
  };

  // 登录或者获取用户信息失败的model
  loginFailModel = content => {
    Taro.showModal({
      title: '提示',
      content,
      showCancel: true,
      confirmText: '重试',
      success (res) {
        const { confirm } = res;
        if (!confirm) {
          return;
        }
        this.login();
      }

    });
  };
}
