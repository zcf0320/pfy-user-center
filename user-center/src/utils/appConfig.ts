import Taro from '@tarojs/taro';

interface AppConfig {
  // api 路由
  BASE_URL: string;
  // 小程序发布的版本
  mpVersion: string;
  WSS_URL: string;
  // 缓存的用户信息key
  userInfo: string;
  // 微信的用户信息
  weixinUserInfo: string;
  xAccessToken: string;
  isDc: string;
  appid: string;
  isH5: boolean;
  isWeapp: boolean;
  codeMap: any;
  env: string;
  SERVICE_URL: string;
  // oss 图片地址
  ossHost: string;
  windowHeight: number;
  windowWidth: number;
  H5_URL: string;
  txMapKey: string;
}
let BASE_URL = 'https://service-back.g-hcare.com/user-center/';
let SERVICE_URL = 'https://service.dev.g-hcare.com/questionnaire/#/';
let WSS_URL = 'wss://manage-huanyu.g-hcare.com/chat/';
let H5_URL = 'https://service.g-hcare.com/#/';
switch (process.env.BUILD_ENV) {
  case 'prod':
    SERVICE_URL = 'https://service.g-hcare.com/questionnaire/#/';
    H5_URL = 'https://service.g-hcare.com/#/';
    BASE_URL = 'https://service-back.g-hcare.com/user-center/';
    WSS_URL = 'wss://businessback.g-hcare.com/inquiries/chat/';
    break;
  case 'test':
    SERVICE_URL = 'https://service-test.g-hcare.com/questionnaire/#/';
    // SERVICE_URL = 'http://localhost:3000/questionnaire/#/';
    BASE_URL = 'https://service-huanyu.g-hcare.com/user-center/';
    // BASE_URL = 'http://service-dev-local.huanyu.g-hcare.com/user-center/';

    WSS_URL = 'wss://senro-tree-huanyu.g-hcare.com/inquiries/chat/';
    H5_URL = 'https://service-test.g-hcare.com/#/';
    // WSS_URL = 'ws://172.16.1.19:8092/scm/chat/'
    break;
  case 'dev':
    SERVICE_URL = 'http://service-dev.huanyu.g-hcare.com/questionnaire/#/';
    // SERVICE_URL = 'http://localhost:3000/questionnaire/#/';
    // BASE_URL = 'http://172.16.2.34:8083/user-center/';
    BASE_URL = 'http://service-dev-local.huanyu.g-hcare.com/user-center/';
    WSS_URL = 'ws://172.16.1.18:8079/inquiries/chat/';
    H5_URL = 'http://service-dev.huanyu.g-hcare.com/#/';
    break;
  case 'demo':
    SERVICE_URL = 'https://service-demo.g-hcare.com/questionnaire/#/';
    BASE_URL = 'https://service-demoback.g-hcare.com/user-center/';
    H5_URL = 'https://service-demo.g-hcare.com/#/';
    WSS_URL = 'wss://business-demoback.g-hcare.com/inquiries/chat/';
    break;
  default:
    SERVICE_URL = 'https://service.g-hcare.com/questionnaire/#/';
    BASE_URL = 'https://service-back.g-hcare.com/user-center/';
}
const codeMap = {
  // 膳食
  '92acb0': 1,
  // 糖尿病
  tTHDVx: 2,
  // 心脏病
  kjbUlp: 3,
  // 高血压
  vJxKld: 4,
  // 健高
  sKmIIv: 5,
  // 预约需要审核
  Aqvlzr: 6,
  // 预约不需要审核
  bAiQoe: 7,
  // 兑换供应商券码 虚拟商品
  XpbFvr: 8,
  // 商品兑换
  eyUtlP: 9,
  // 健康专栏
  EEJaIa: 10,
  // 购药系统
  JSAlkb: 11,
  // 图文问诊
  OnDiag: 12,
  // 人工问诊
  LFaixA: 13,
  // 电话问诊
  nYQSrM: 14,
  // 七日陪护
  iDweCl: 15,
  // 口腔二维码问诊
  VvdNrn: 16,
  // 二次诊疗
  sOyWFb: 17,
  // 老花镜
  LHJpdd: 18,
  // 五一劳动节
  gfoTjw: 19,
  // 药房网
  HyGaJY: 20,
  // 体检
  IaHGGZ: 21,
  // 糖百万
  TnBGLA: 22,
  // 抑郁问卷
  yyzpWj: 23,
  // 焦虑问卷
  JLZPwj: 24,
  // 医加壹
  yjytwwz: 25,
  // 淼滴
  miaodiReserve: 26,
  bgjReserve: 27,
  HSAlYb: 28, // 医加壹健康服务
  '0616D3': 29,
  skinTest: 30,
  alzheimer: 31,
  ZJjzGy: 32, // 九洲互联网购药
  RSstop: 33,
  reserveCode: 34,
  sleepManage: 35,
  thyroidManage: 36,
  dhxUwz: 37,
  BoRTUK: 38
};

const appConfig: AppConfig = {
  // api路径
  BASE_URL,
  // 第三方路径
  SERVICE_URL,
  // webscoket
  WSS_URL,
  H5_URL,
  mpVersion: '1.0.0',
  userInfo: 'user_info',
  weixinUserInfo: 'weixin_user_info',
  xAccessToken: 'token',
  appid: 'wx19d37243a4864945',
  isH5: !!(process.env.TARO_ENV === 'h5'),
  isWeapp: !!(process.env.TARO_ENV === 'weapp'),
  isDc: 'is_dc',
  env: process.env.BUILD_ENV,
  windowHeight: Taro.getSystemInfoSync().windowHeight,
  windowWidth: Taro.getSystemInfoSync().windowWidth,
  ossHost:
    'https://user-center-images-1301127519.cos.ap-shanghai.myqcloud.com/',
  codeMap,
  txMapKey: 'IZIBZ-ROGKU-6QQVU-2FUIF-DAB23-AMBIW'
};
export default appConfig;
