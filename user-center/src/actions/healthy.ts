import httpService from '@utils/request';

export const saveHealthFile = data => {
  return httpService({
    url: 'healthFile/save',
    method: 'POST',
    data
  });
};
export const getHealthFile = () => {
  return httpService({
    url: 'healthFile/getAllFiles',
    method: 'GET'
  });
};
export const getOneDayFile = data => {
  return httpService({
    url: 'healthFile/getByCreateDate',
    method: 'GET',
    data
  });
};
export const getUserPortraitList = () => {
  return httpService({
    url: 'userPortrait/listAll',
    method: 'GET'
  });
};
export const createUserPortrait = data => {
  return httpService({
    url: 'userPortrait/create',
    method: 'POST',
    data
  });
};
export const getUserPortrait = () => {
  return httpService({
    url: 'userPortrait/getUserPortrait',
    method: 'GET'
  });
};
export const getSportList = () => {
  return httpService({
    url: 'uc-diabetes-management/get/sport',
    method: 'GET'
  });
};
export const getFoodListByCid = id => {
  return httpService({
    url: `uc-diabetes-management/get/food/by/classifyId/${id}`,
    method: 'GET'
  });
};
export const getFoodListByName = name => {
  return httpService({
    url: `uc-diabetes-management/get/food/by/name/${name}`,
    method: 'GET'
  });
};
export const getFoodListByPid = id => {
  return httpService({
    url: `uc-diabetes-management/get/food/by/id/${id}`,
    method: 'GET'
  });
};
export const setTodaySymptom = data => {
  return httpService({
    url: 'uc-diabetes-management/save/today/symptom',
    method: 'POST',
    data
  });
};
export const getTodaySymptom = data => {
  return httpService({
    url: 'uc-diabetes-management/get/someday/symptom',
    method: 'POST',
    data
  });
};

/**
 * 查询健康档案材料
 * @param data
 * @returns
 */
export const getHealthMaterial = data => {
  return httpService({
    url: 'healthFile/material/selectHealthMaterial',
    method: 'GET',
    data
  });
};
export const uploadHealthMaterial = data => {
  return httpService({
    url: 'healthFile/material/uploadHealthMaterial',
    method: 'POST',
    data
  });
};
/**
 * 获取健康档案详情
 * @param data
 * @returns
 */

export const getHealthFileDetailRecord = (data: any) => {
  return httpService({
    url: 'score/task/selectHealthFileDetailRecord',
    method: 'GET',
    data
  });
};

export const closeHealthyDialog = () => {
  return httpService({
    url: 'service/skipDialogue',
    method: 'POST'
  });
};

/**
 * 获取推荐健康打卡
 * @returns
 */
export const gerRecommendCard = () => {
  return httpService({
    url: 'healthFile/queryHealthRecommendCard',
    method: 'GET'
  });
};

/**
 * 获取健康打卡
 * @returns
 */
export const getHealthyCard = () => {
  return httpService({
    url: 'healthFile/queryHealthRemainingCard',
    method: 'GET'
  });
};
/**
 * 获取用户家庭列表
 * @returns
 */
export const getUserFamilyList = async () => {
  return httpService({
    url: 'uc-user-family/queryUserFamilyList',
    method: 'GET'
  });
};
/**
 * 通过加密id获取用户信息
 * @returns
 */
export const getUserNameById = async (data: any) => {
  return httpService({
    url: 'uc-user-family/getUserNameById',
    method: 'GET',
    data,
    needLogin: false
  });
};
/**
 * 获取用户分享链接信息
 * @returns
 */
export const getShareInformation = () => {
  return httpService({
    url: 'uc-user-family/getShareInformation',
    method: 'GET'
  });
};
/**
 * 接受邀请
 * @returns
 */
export const getAcceptInvitation = async (data: any) => {
  return httpService({
    url: 'uc-user-family/acceptInvitation',
    method: 'POST',
    data
  });
};
/**
 * 获取家庭健康打卡
 */
export const getFamilyHealthyCard = (fuserId: string) => {
  return httpService({
    url: 'uc-user-family/queryFamilyHealthCard',
    data: { fuserId },
    method: 'GET'
  });
};
/**
 * 获取家庭健康档案信息
 */
export const getFamilyHealthyFiles = (fuserId: string) => {
  return httpService({
    url: 'uc-user-family/getAllFiles',
    data: { fuserId },
    method: 'GET'
  });
};
/**
 * 家庭账号解绑
 */
export const unbindFamilyAccount = (data: any) => {
  return httpService({
    url: 'uc-user-family/unbindFamilyAccount',
    data,
    method: 'POST'
  });
};
