import httpService from '@utils/request';

// 获取服务券码列表
export const getList = data => {
  return httpService({
    url: 'presentation/serviceRightList',
    method: 'POST',
    data
  });
};
// 领取服务券
export const receivePrensent = id => {
  return httpService({
    url: `presentation/receivePrensent/${id}`,
    method: 'GET'
  });
};
