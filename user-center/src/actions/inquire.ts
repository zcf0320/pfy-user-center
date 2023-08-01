import httpService from '@utils/request';

// 获取症状列表
export const getDiagnoseList = () => {
  return httpService({
    url: 'online/diagnose/listAll',
    method: 'GET'
  });
};

// 确认提交选择的疾病
export const commitDisease = data => {
  return httpService({
    url: 'online/diagnose/commitDisease',
    method: 'GET',
    data
  });
};

// 回答问题
export const answer = data => {
  return httpService({
    url: 'online/diagnose/answer',
    method: 'POST',
    data
  });
};

// 问诊评论
export const comment = data => {
  return httpService({
    url: 'online/diagnose/comment',
    method: 'POST',
    data
  });
};

// 获取用户可选择的按钮
export const getUserSelectItem = data => {
  return httpService({
    url: 'online/diagnose/getUserSelectItem',
    method: 'GET',
    data
  });
};
// 获取问诊记录
export const getRecordInfo = data => {
  return httpService({
    url: 'online/diagnose/getRecordInfo',
    method: 'GET',
    data
  });
};
// 模糊搜索疾病
export const searchDisease = data => {
  return httpService({
    url: 'online/diagnose/searchDisease',
    method: 'GET',
    data,
    showLoading: false
  });
};
// 获取是否有人工
export const getManualLaborServiceRecordIds = () => {
  return httpService({
    url: 'online/diagnose/getManualLaborServiceRecordIds',
    method: 'GET'
  });
};
// 获取医生的状态
export const checkManualLaborState = data => {
  return httpService({
    url: 'online/diagnose/checkManualLaborState',
    method: 'GET',
    data
  });
};
// 创建电话问诊
export const createMobile = data => {
  return httpService({
    url: 'mobile/diagnose/create',
    method: 'POST',
    data
  });
};
export const onlyCheckManualLaborState = data => {
  return httpService({
    url: 'online/diagnose/onlyCheckManualLaborState',
    method: 'GET',
    data
  });
};
export const getPhoneResult = data => {
  return httpService({
    url: 'mobile/diagnose/getResult',
    method: 'GET',
    data
  });
};
export const mobileComment = data => {
  return httpService({
    url: 'mobile/diagnose/comment',
    method: 'POST',
    data
  });
};
export const getDetail = data => {
  return httpService({
    url: 'online/diagnose/getDiseaseDetail',
    method: 'GET',
    data
  });
};
