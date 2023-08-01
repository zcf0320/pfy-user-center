import Taro from '@tarojs/taro';
import i18n from '@i18n/index';
import appConfig from './appConfig';

type requestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface IHttpParams {
  url: string;
  method?: requestMethod;
  header?: Record<string, any>;
  data?: any;
  dataType?: string;
  showLoading?: boolean;
  needLogin?: boolean;
}

const {
  BASE_URL,
  mpVersion,
  xAccessToken,
  userInfo,
  weixinUserInfo
} = appConfig;
// 请求白名单 不用token
const whiteList = [
  'third/user/login',
  'health/plan/listAll',
  'health/column/article/info',
  'mall/homePage/list',
  'publish/content/homePage/list',
  'personal/insure/calcu',
  'reserve/get',
  'all/provincesAndCities',
  'third/user/phone',
  'insuranceProduct/plan/info',
  'comment/getOptions',
  'third/smscode',
  'third/user/mobile/login',
  'third/user/completion',
  'mall/list',
  'dongcai/idCard/login',
  'publish/content/types',
  'publish/content/list',
  'publish/content/detail',
  'mall/get',
  'insuranceProduct/info',
  'group/insure/info',
  'group/insure/create',
  'group/insure/queryJob',
  'personal/insure/create',
  'third/user/appeal',
  'third/user/checkIdCardImg',
  'third/user/appealSuccess',
  'mall/hot'
];
const httpService = async (params: IHttpParams) => {
  const {
    url,
    method = 'GET',
    data,
    showLoading = true,
    needLogin = true
  } = params;
  const token = Taro.getStorageSync(xAccessToken) || '';
  if (!token && needLogin) {
    if (whiteList.indexOf(url) === -1) {
      return;
    }
  }
  if (showLoading) {
    Taro.showLoading &&
      Taro.showLoading({
        title: i18n.chain.common.loading,
        mask: true
      });
  }
  // let header = {'Content-Type': 'application/json'}
  const sysInfo: any = Taro.getSystemInfoSync() || {};
  const { system, version, model, SDKVersion } = sysInfo;
  const header = {
    system: system || '',
    version: version || '',
    model: model || '',
    SDKVersion: SDKVersion || '',
    'mp-version': mpVersion,
    'Content-Type': 'application/json',
    lang: Taro.getStorageSync('language')
  } as any;
  // let header = (<any>Object).assign(params.header || { "Content-Type": "application/json" }, sysInfo)
  // header = (<any>Object).assign(params.header || { "content-type": "json" }, sysInfo)
  token && (header.token = token);
  // header['mp-version'] = mpVersion

  return new Promise((resolve, reject) => {
    Taro.request({
      timeout: 5000,
      url: BASE_URL + url,
      header,
      data,
      method
    })
      .then(res => {
        showLoading && Taro.hideLoading();
        const { code, data, status, message } = res.data;
        if (status) {
          if (code === 40004) {
            reject(res.data);
            return;
          }
          resolve(data);
        } else {
          Taro.showToast({
            title: message || i18n.chain.common.networkError,
            icon: 'none'
          });
          if (code === 40001) {
            Taro.removeStorageSync(userInfo);
            Taro.removeStorageSync(weixinUserInfo);
            Taro.removeStorageSync(xAccessToken);
            setTimeout(() => {
              Taro.reLaunch({
                url: '/pages/user/index/index'
              });
            }, 1000);
          }
          reject(res.data);
        }
      })
      .catch(err => {
        Taro.hideLoading();
        Taro.showToast({
          title: i18n.chain.common.networkError,
          icon: 'none'
        });
        reject(err);
      });
  });
};
export default httpService;
