import httpService from '@utils/request';

// 获取商品详情
export const getList = () => {
  return httpService({
    url: 'medicationPlan/list',
    method: 'GET',
    needLogin: false
  });
};
export const createPlan = data => {
  return httpService({
    url: 'medicationPlan/create',
    method: 'POST',
    data
  });
};
export const getTimeList = data => {
  return httpService({
    url: 'medicationPlan/getDetailByDate',
    method: 'GET',
    data
  });
};
export const removePlan = data => {
  return httpService({
    url: 'medicationPlan/delete',
    method: 'GET',
    data
  });
};
export const read = data => {
  return httpService({
    url: 'medicationPlan/complete',
    method: 'GET',
    data
  });
};
export const getDrugHistory = () => {
  return httpService({
    url: 'medicationPlan/drugHistory',
    method: 'GET'
  });
};
