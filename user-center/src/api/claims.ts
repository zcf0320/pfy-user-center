import httpService from '@utils/request';

// 获取赔偿责任可选项
export const getClaimSettlement = () => {
  return httpService({
    url: 'claimSettlement/option',
    method: 'GET',
    showLoading: false
  });
};

// 校验手机号和验证码
export const checkMobileAndValidCode = data => {
  return httpService({
    url: 'check/mobileAndValidCode',
    method: 'POST',
    data,
    showLoading: false
  });
};

// 提交审核
export const submitReview = data => {
  return httpService({
    url: 'claimSettlement/add',
    method: 'POST',
    data
  });
};
// 获取理赔详情
export const getClaimsDetail = data => {
  return httpService({
    url: 'claimSettlement/getDetail',
    method: 'GET',
    data
  });
};
// 获取理赔列表
export const getClaimsList = data => {
  return httpService({
    url: 'claimSettlement/list',
    method: 'GET',
    data
  });
};
/**
 * 获取理赔资料详情
 * @param claimRecordId
 * @returns
 */
export const getClaimsInfo = (claimRecordId:string) => {
  return httpService({
    url: 'insurance/claim/getClaimInfos',
    method: 'GET',
    data: { claimRecordId }
  });
};
