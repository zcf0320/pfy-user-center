import Taro from '@tarojs/taro';
import httpService from '@utils/request';
import utils from '../utils';

const { appConfig } = utils || {};

export const auth = data => {
  return httpService({
    url: 'wx/user/login',
    method: 'POST',
    data
  });
};
// 东财登录
export const dcLogin = data => {
  return httpService({
    url: 'dongcai/idCard/login',
    method: 'POST',
    data
  });
};

// 完善信息
export const register = data => {
  return httpService({
    url: 'third/user/completion',
    method: 'POST',
    data
  });
};
export const login = data => {
  return httpService({
    url: 'third/user/mobile/login',
    method: 'POST',
    data
  });
};
// 更新工作信息
export const postWorkInfo = data => {
  return httpService({
    url: 'third/user/update/workInfo',
    method: 'POST',
    data
  });
};
// 发送验证码
export const sendMessage = data => {
  return httpService({
    url: 'third/smscode',
    method: 'GET',
    data,
    showLoading: false
  });
};
// 上传图片
export const upload = data => {
  const header = {
    contentType: 'multipart/form-data; boundary=ABCD'
  };
  const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
  token && (header.token = token);
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${appConfig.BASE_URL}uploadPic?module=${data.module}`,
      filePath: data.filePath,
      name: 'multipartFile',
      header,
      formData: {
        user: 'test'
      },
      success (res) {
        const { status, message } = JSON.parse(res.data);
        if (status) {
          resolve(res.data);
        } else {
          Taro.showToast({
            title:
              '由于当前系统版本限制，无法成功上传图片，请您打开微信搜索【寰宇关爱】小程序登录使用此功能',
            icon: 'none',
            duration: 5000
          });
          reject(message);
        }
      },
      fail (err) {
        reject(err);
      }
    });
  });
};
export const uploadPicWithEncode = data => {
  const header = {
    contentType: 'multipart/form-data; boundary=ABCD'
  };
  const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
  token && (header.token = token);
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${appConfig.BASE_URL}uploadPicWithEncode?module=${data.module}`,
      filePath: data.filePath,
      name: 'multipartFile',
      header,
      formData: {
        user: 'test'
      },
      success (res) {
        const { status, message } = JSON.parse(res.data);
        if (status) {
          resolve(res.data);
        } else {
          Taro.showToast({
            title: message,
            icon: 'none',
            duration: 5000
          });
          reject(message);
        }
      },
      fail (err) {
        reject(err);
      }
    });
  });
};
// 根据经纬度获取地址
export const getAddress = data => {
  return httpService({
    url: 'getAddress',
    method: 'GET',
    data,
    showLoading: false
  });
};
// 获取配置
export const getConfig = data => {
  return httpService({
    url: 'comment/getOptions',
    method: 'GET',
    data
  });
};
// 获取所有的省市
export const getAllProvice = () => {
  return httpService({
    url: 'all/provincesAndCities',
    method: 'GET'
  });
};
// 微信获取手机号
export const weixinPhone = data => {
  return httpService({
    url: 'third/user/phone',
    method: 'POST',
    data
  });
};
// 搜索疾病
export const searchDisease = data => {
  return httpService({
    url: 'medicine/order/searchDisease',
    method: 'GET',
    data
  });
};
export const searchSurgery = data => {
  return httpService({
    url: 'surgery/search',
    method: 'GET',
    data
  });
};
export const getDiseaseInfo = data => {
  return httpService({
    url: 'online/diagnose/getDiseaseInfoByServiceRecordId',
    method: 'GET',
    data
  });
};
export const getDiagnoseList = data => {
  return httpService({
    url: 'online/diagnose/list',
    method: 'GET',
    data
  });
};
export const getUserSelectItem = () => {
  return httpService({
    url: 'online/diagnose/checkRights',
    method: 'GET'
  });
};
// 签到
export const sign = () => {
  return httpService({
    url: 'score/task/sign',
    method: 'GET'
  });
};
// 获取签到
export const getSign = () => {
  return httpService({
    url: 'score/task/getSignResult',
    method: 'GET'
  });
};
// 获取首页的咨询问章
export const homePage = () => {
  return httpService({
    url: 'publish/content/homePage/list',
    method: 'GET'
  });
};
// 获取3个固定展示商品
export const homePageList = () => {
  return httpService({
    url: 'mall/homePage/list',
    method: 'GET'
  });
};
// 获取首页的各项服务
export const serviceRights = () => {
  return httpService({
    url: 'homePage/serviceRights',
    method: 'GET'
  });
};
export const receiveGift = data => {
  return httpService({
    url: 'homePage/receiveGift',
    method: 'GET',
    data
  });
};
export const getHaveReceive = () => {
  return httpService({
    url: 'homePage/getHaveReceive',
    method: 'GET'
  });
};
export const getIdCard = () => {
  return httpService({
    url: 'third/user/getIdCard',
    method: 'GET'
  });
};
export const getJob = () => {
  return httpService({
    url: 'third/user/list/job',
    method: 'GET'
  });
};
// 根据pdf得id获取图片列表
export const getUserPdfImgList = data => {
  return httpService({
    url: 'insuranceProduct/getUserNotificationImgList',
    method: 'GET',
    data,
    needLogin: false
  });
};
// 搜索科室
export const searchDepartment = data => {
  return httpService({
    url: 'insurance/claim/searchDepartment',
    method: 'GET',
    data
  });
};
// 搜索医院
export const searchHospital = data => {
  return httpService({
    url: 'insurance/claim/searchHospital',
    method: 'GET',
    data
  });
};
// 搜索药品
export const searchDrug = data => {
  return httpService({
    url: 'insurance/claim/searchDrug',
    method: 'GET',
    data
  });
};
// 搜索项目
export const searchProgram = data => {
  return httpService({
    url: 'insurance/claim/searchCheckItemName',
    method: 'GET',
    data
  });
};
export const agreeNotification = () => {
  return httpService({
    url: 'third/user/agreeNotification/1',
    method: 'GET'
  });
};
export const getMinIntervalDay = data => {
  return httpService({
    url: 'check/getMinIntervalDay',
    method: 'GET',
    data
  });
};
export const getValidDate = data => {
  return httpService({
    url: 'service/getValidDateNumber',
    method: 'GET',
    data
  });
};
export const brandAndOSType = data => {
  return httpService({
    url: 'userBehavior/brandAndOSType',
    method: 'GET',
    data
  });
};
export const lastLoginTime = () => {
  return httpService({
    url: 'userBehavior/lastLoginTime',
    method: 'GET'
  });
};
export const agreeNotificationTimeList = () => {
  return httpService({
    url: 'third/user/agreeNotificationTimeList',
    method: 'GET'
  });
};
export const getUserProtocol = (id: any) => {
  return httpService({
    url: `third/user/find/user/protocol/${id}`,
    method: 'GET',
    needLogin: false
  });
};
export const protocolList = () => {
  return httpService({
    url: 'third/user/findAll/protocol',
    method: 'GET'
  });
};
export const protocolLog = () => {
  return httpService({
    url: 'third/user/findAll/protocol/log',
    method: 'GET'
  });
};
/**
 * 首页获取轮播图
 * @returns
 */
export const getBanner = data => {
  return httpService({
    url: 'mall/rotation/img',
    method: 'GET',
    data,
    needLogin: false
  });
};

export const updatePhoneSms = data => {
  return httpService({
    url: 'third/smsUpdatePhonecode',
    method: 'GET',
    data,
    showLoading: false
  });
};
/**
 * 获取用户动态图标
 * @param data
 * @returns
 */
export const getDynamicImg = data => {
  return httpService({
    url: 'mall/dynamic/img',
    method: 'GET',
    data
  });
};
