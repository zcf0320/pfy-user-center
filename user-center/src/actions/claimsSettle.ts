import httpService from '@utils/request';
// 可申请理赔的保险产品列表
export const insuranceClaimList = () => {
  return httpService({
    url: 'insurance/claim/insuranceClaimList',
    method: 'GET'
  });
};
// 保障权益的介绍
export const getInsuranceRightsInfo = data => {
  return httpService({
    url: 'insurance/claim/getInsuranceRightsInfo',
    method: 'GET',
    data
  });
};
// 用户理赔记录
export const insuranceClaimRecordList = () => {
  return httpService({
    url: 'insurance/claim/insuranceClaimRecordList',
    method: 'GET'
  });
};
// 审核需要的材料列表
export const needMaterials = data => {
  return httpService({
    url: 'insurance/claim/needMaterials',
    method: 'GET',
    data
  });
};
// 提交保险理赔审核
export const createExam = data => {
  return httpService({
    url: 'insurance/claim/create',
    method: 'POST',
    data
  });
};
export const selectDisease = data => {
  return httpService({
    url: 'check/selectDisease',
    method: 'GET',
    data
  });
};
export const getRightClaimConfig = data => {
  return httpService({
    url: 'insurance/claim/getRightClaimConfig',
    method: 'GET',
    data
  });
};
export const getServiceInfoClaimConfig = data => {
  return httpService({
    url: 'insurance/claim/getServiceInfoClaimConfig',
    method: 'GET',
    data
  });
};
export const getOriginalReqStr = data => {
  return httpService({
    url: 'check/getOriginalReqStr',
    method: 'GET',
    data
  });
};
export const getValidDate = data => {
  return httpService({
    url: 'service/getValidDate',
    method: 'GET',
    data
  });
};
export const commitElectronicSignature = data => {
  return httpService({
    url: 'insuranceProduct/commitElectronicSignature',
    method: 'GET',
    data
  });
};
export const getProtocol = data => {
  return httpService({
    url: 'insuranceProduct/servinceInfo/protocol',
    method: 'GET',
    data
  });
};

/**
 * 获取理赔通知书
 * @param claimRecordId
 * @returns
 */
export const getNoticeUrl = claimRecordId => {
  return httpService({
    url: 'insurance/claim/getNoticeUrl',
    method: 'GET',
    data: { claimRecordId }
  });
};
/**
 * 获取理赔记录结果
 * @param claimRecordId
 * @returns
 */
export const getClaimRecordResult = (claimRecordId:string) => {
  return httpService({
    url: '/check/getClaimRecord',
    method: 'GET',
    data: { claimRecordId }
  });
};
/**
 * 获取授权验证内容
 * @param data {insuranceProductId,rightsId}
 * @returns
 */
export const getAuthContent = (data:{insuranceProductId:string, rightsId:string, serviceRecordId:string}) => {
  return httpService({
    url: '/insurance/claim/getClaimAuthorization',
    method: 'GET',
    data
  });
};
