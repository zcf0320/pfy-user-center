import httpService from '@utils/request';

export const getTypes = data => {
  return httpService({
    url: 'health/column/all/types',
    method: 'GET',
    data
  });
};
export const getArticle = data => {
  return httpService({
    url: 'health/column/type/article',
    method: 'GET',
    data
  });
};
export const getHistoryList = () => {
  return httpService({
    url: 'health/column/history',
    method: 'GET'
  });
};
export const getArticleDetail = data => {
  return httpService({
    url: 'health/column/article/info',
    method: 'GET',
    data
  });
};
export const serviceRecordState = data => {
  return httpService({
    url: 'health/column/changeServiceRecordState',
    method: 'GET',
    data
  });
};
// 获取病
export const productType = data => {
  return httpService({
    url: 'medicine/product/type',
    method: 'GET',
    data
  });
};
// 获取药品
export const productList = data => {
  return httpService({
    url: 'medicine/product/list',
    method: 'GET',
    data
  });
};
export const productDetail = data => {
  return httpService({
    url: 'medicine/product/all/info',
    method: 'GET',
    data,
    needLogin: false
  });
};
export const orderList = data => {
  return httpService({
    url: 'medicine/order/list',
    method: 'GET',
    data
  });
};
export const orderDetail = data => {
  return httpService({
    url: 'medicine/order/info/list',
    method: 'GET',
    data
  });
};
// export const orderDetail = data => {
//     return httpService({
//         url: 'medicine/order/info',
//         method: 'GET',
//         data
//     });
// };
export const subInfo = data => {
  return httpService({
    url: 'medicine/order/create',
    method: 'POST',
    data
  });
};
export const serviceList = data => {
  return httpService({
    url: 'medicine/order/gerviceRecordsByProduct',
    method: 'GET',
    data
  });
};
// 校验商品库存
export const checkStock = data => {
  return httpService({
    url: 'medicine/order/check/stock',
    method: 'GET',
    data
  });
};
// 商城--获取所有疾病类别
export const allType = () => {
  return httpService({
    url: 'medicine/product/all/type',
    method: 'GET',
    needLogin: false
  });
};
// 商城--列出疾病类别下所有商品
export const typeAllList = data => {
  return httpService({
    url: 'medicine/product/all/list',
    method: 'GET',
    data,
    needLogin: false
  });
};
// 商城--用户是否拥有权益
export const hasServiceRecord = () => {
  return httpService({
    url: 'medicine/product/all/hasServiceRecord',
    method: 'GET'
  });
};
export const selectProductList = data => {
  return httpService({
    url: 'medicine/product/selectProductList',
    method: 'POST',
    data
  });
};

/**
 * 获取互联网医院链接
 * @param data
 * @returns
 */
export const submitInternetHospital = (data) => {
  return httpService({
    url: 'internet/hospital/internetHospitalEnter',
    method: 'POST',
    data
  });
};
/**
 * 轮询互联网医院对接响应状态
 * @param data
 * @returns
 */
export const getStatus = (data) => {
  return httpService({
    url: 'medicine/order/pollingMedicineOrder',
    method: 'POST',
    data
  });
};
export const cancelOrder = (serviceRecordId) => {
  return httpService({
    url: 'medicine/order/cancelMedicineOrder',
    method: 'POST',
    data: { serviceRecordId }
  });
};
