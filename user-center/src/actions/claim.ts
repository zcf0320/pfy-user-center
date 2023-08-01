import httpService from '@utils/request';
// 获取审核需要的材料列表
export const getMaterialsList = data => {
  return httpService({
    url: 'check/needMaterials',
    method: 'GET',
    data
  });
};
// 提交审核
export const checkSubmit = data => {
  return httpService({
    url: 'check/submit',
    method: 'POST',
    data
  });
};
// 提交审核
export const cancelSubmit = data => {
  return httpService({
    url: 'check/cancel',
    method: 'POST',
    data
  });
};
// 获取审核失败的原因列表
export const getReason = data => {
  return httpService({
    url: 'check/listFailReason',
    method: 'GET',
    data
  });
};
export const getClaimReason = data => {
  return httpService({
    url: 'insurance/claim/listFailReason',
    method: 'GET',
    data
  });
};
