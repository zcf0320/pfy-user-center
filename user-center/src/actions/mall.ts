import httpService from '@utils/request';

// 获取商品详情
export const getProductDetail = data => {
  return httpService({
    url: 'mall/get',
    method: 'GET',
    data
  });
};
// 获取商品列表
export const getProductList = data => {
  return httpService({
    url: 'mall/list',
    method: 'GET',
    data
  });
};
// 用户积分
export const getScore = () => {
  return httpService({
    url: 'user/score',
    method: 'GET',
    showLoading: false
  });
};
// 购买
export const buyProduct = data => {
  return httpService({
    url: 'mall/buy',
    method: 'GET',
    data
  });
};
export const getRecordsList = data => {
  return httpService({
    url: 'user/score/record',
    method: 'GET',
    data
  });
};

/**
 * 获取热门商品
 * @returns
 */
export const getHotProduct = () => {
  return httpService({
    url: 'mall/hot',
    method: 'GET'
  });
};
