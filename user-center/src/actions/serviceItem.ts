import httpService from '@utils/request';

// 获取口腔二维码
export const getServiceRecord = data => {
  return httpService({
    url: 'onlineService/consumeServiceRecord',
    method: 'GET',
    data
  });
};
// 获取商品规格
export const getProductSpecifications = data => {
  return httpService({
    url: 'physicalGoods/productSpecifications',
    method: 'GET',
    data
  });
};
// 兑换实体商品
export const getPhysicalGoods = data => {
  return httpService({
    url: 'physicalGoods/create',
    method: 'POST',
    data
  });
};
// 获取实物商品兑换详情
export const getPhysicalGoodsInfo = data => {
  return httpService({
    url: 'physicalGoods/info',
    method: 'GET',
    data
  });
};
export const getNeedMaterials = (data: { serviceRecordId: string }) => {
  return httpService({
    url: 'second/treatment/needMaterials',
    method: 'GET',
    data
  });
};
export const saveMaterials = data => {
  return httpService({
    url: 'second/treatment/create',
    method: 'POST',
    data
  });
};
export const userSecond = data => {
  return httpService({
    url: 'second/treatment/use',
    method: 'POST',
    data
  });
};
export const getTreatmentList = data => {
  return httpService({
    url: 'second/treatment/list',
    method: 'GET',
    data
  });
};
export const getReport = data => {
  return httpService({
    url: 'second/treatment/getReport',
    method: 'GET',
    data
  });
};
export const getProjectList = () => {
  return httpService({
    url: 'checkup/listProject',
    method: 'GET'
  });
};
export const commit = data => {
  return httpService({
    url: 'checkup/commitImg',
    method: 'POST',
    data
  });
};
export const gePhysicaltReport = data => {
  return httpService({
    url: 'checkup/getReport',
    method: 'GET',
    data
  });
};
export const commitData = data => {
  return httpService({
    url: 'checkup/commitData',
    method: 'POST',
    data
  });
};
