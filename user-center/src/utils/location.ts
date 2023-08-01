import Taro from '@tarojs/taro';
import appConfig from './appConfig';
import httpService from './request';

interface Result {
  latitude?: number;
  longitude?: number;
}
// 获取经纬度
export const getLocation = async () => {
  const { isH5, isWeapp } = appConfig;
  const result: Result = {};
  // return new Promise((resolve, reject) => {
  if (isWeapp) {
    await Taro.getLocation({
      type: 'wgs84',
      success: res => {
        const { latitude, longitude } = res;
        result.latitude = latitude;
        result.longitude = longitude;
      },
      fail: error => {
        console.log(error);
      }
    });
  }
  if (isH5) {
    try {
      await navigator.geolocation.getCurrentPosition(ev => {
        const { latitude, longitude } = ev.coords;
        result.latitude = latitude;
        result.longitude = longitude;
      });
    } catch (error) {
      console.log(error);
      // console.log(error)
    }
  }
  return result;
  // })
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
// 根据经纬度获取proviceId 和cityId
export const getProviceId = async () => {
  const { latitude, longitude } = await getLocation();
  let result = {} as any;
  if (latitude && longitude) {
    const res = await getAddress({
      latitude,
      longitude
    });
    result = res;
  }
  return result;
};
