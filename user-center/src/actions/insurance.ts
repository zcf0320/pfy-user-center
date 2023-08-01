import httpService from '@utils/request';

// 获取配置
export const getConfig = data => {
  return httpService({
    url: 'comment/getOptions',
    method: 'GET',
    data
  });
};
// 创建保单
export const addInsurance = data => {
  return httpService({
    url: 'insure/add',
    method: 'POST',
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
// 获取问券
export const getQuestion = data => {
  return httpService({
    url: 'questionnaire/getByCode',
    method: 'GET',
    data
  });
};
// 获取保单列表
export const getInsureRecord = data => {
  return httpService({
    url: 'insure/record',
    method: 'GET',
    data
  });
};
// 获取投保结果
export const getResult = data => {
  return httpService({
    url: 'insure/checkResult',
    method: 'GET',
    data
  });
};
export const getManageList = data => {
  return httpService({
    url: 'insuranceProduct/listPolicy',
    method: 'GET',
    data
  });
};
export const getManageDetail = data => {
  return httpService({
    url: 'insuranceProduct/getPolicyDetail',
    method: 'GET',
    data
  });
};
// 获取保单增值服务或者我的理赔(type:0,1)
export const valueAddedServiceList = data => {
  return httpService({
    url: 'insuranceProduct/get/valueAddedServiceList',
    method: 'GET',
    data
  });
};
// 获取理赔记录
export const getClaimRecord = data => {
  return httpService({
    url: 'insuranceProduct/get/claim/record',
    method: 'GET',
    data
  });
};
export const getProductInfo = data => {
  return httpService({
    url: '/insure/product/info',
    method: 'GET',
    data
  });
};
export const getInsuranceInfo = data => {
  return httpService({
    url: 'insuranceProduct/info',
    method: 'GET',
    data
  });
};
export const personalInsuranceCreate = data => {
  return httpService({
    url: 'personal/insure/create',
    method: 'POST',
    data
  });
};
export const groupInsuranceCreate = data => {
  return httpService({
    url: 'group/insure/create',
    method: 'POST',
    data
  });
};
export const queryJob = data => {
  return httpService({
    url: 'group/insure/queryJob',
    method: 'GET',
    data
  });
};
export const getInsuranceResult = data => {
  return httpService({
    url: 'group/insure/info',
    method: 'GET',
    data
  });
};
export const getPlanInfo = data => {
  return httpService({
    url: 'insuranceProduct/plan/info',
    method: 'GET',
    data
  });
};
// 计算个险的保费
export const countPrice = data => {
  return httpService({
    url: 'personal/insure/calcu',
    method: 'POST',
    data,
    needLogin: false
  });
};
export const getQuestionList = data => {
  return httpService({
    url: 'insuranceProduct/question/info',
    method: 'Get',
    data,
    needLogin: false
  });
};
