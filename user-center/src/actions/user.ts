import httpService from '@utils/request';

// 健高
export const healthHight = data => {
  return httpService({
    url: 'onlineService/healthy/height',
    method: 'POST',
    data
  });
};
// 在线服务列表
export const onLineServiceList = data => {
  return httpService({
    url: 'onlineService/record',
    method: 'GET',
    data
  });
};
export const getDcService = data => {
  return httpService({
    url: 'dongcai/service/record',
    data
  });
};
// 服务列表
export const getServiceList = data => {
  return httpService({
    url: 'service/record',
    method: 'GET',
    data
  });
};
// 购药权益
export const getDrugServiceList = data => {
  return httpService({
    url: 'medicine/order/listServiceRecord',
    method: 'GET',
    data
  });
};

// 服务兑换
export const serviceExchange = data => {
  return httpService({
    url: 'service/user',
    method: 'GET',
    data
  });
};

export const getExchangeRecord = data => {
  return httpService({
    url: 'service/record',
    method: 'GET',
    data
  });
};
// 修改手机号
export const editPhone = data => {
  return httpService({
    url: 'third/user/mobile',
    method: 'PUT',
    data
  });
};
// 修改密码
export const editPassword = data => {
  return httpService({
    url: 'third/user/password',
    method: 'PUT',
    data
  });
};
// 获取报告信息
export const getReportInfo = data => {
  return httpService({
    url: 'report',
    method: 'GET',
    data
  });
};
// 上传报告
export const postReportInfo = data => {
  return httpService({
    url: 'report/upload',
    method: 'POST',
    data
  });
};
// 获取服务的城市
export const getServiceInfoById = data => {
  return httpService({
    url: 'reserve/provider/siteByServiceInfoId',
    method: 'GET',
    data
  });
};
export const getServiceInfo = data => {
  return httpService({
    url: 'reserve/provider/site',
    method: 'GET',
    data
  });
};

// 保存服务
export const add = data => {
  return httpService({
    url: 'reserve/add',
    method: 'POST',
    data
  });
};
// 获取记录详情
export const getAppointment = data => {
  return httpService({
    url: 'reserve/get',
    method: 'GET',
    data
  });
};
// 获取记录列表
export const getRecordList = data => {
  return httpService({
    url: 'reserve/record',
    method: 'GET',
    data
  });
};
export const saveHealthFile = data => {
  return httpService({
    url: 'third/user/update/healthyFile',
    method: 'POST',
    data
  });
};
export const getHealthFile = () => {
  return httpService({
    url: 'third/user/healthyFile',
    method: 'GET'
  });
};
// 获取收货地址列表
export const getAddressList = () => {
  return httpService({
    url: 'third/user/address',
    method: 'GET'
  });
};
// 新增收货地址
export const addAddress = data => {
  return httpService({
    url: 'third/user/address',
    method: 'POST',
    data
  });
};
// 设置默认地址
export const setDefaultAddress = data => {
  return httpService({
    url: 'third/user/default/address',
    method: 'GET',
    data,
    showLoading: false
  });
};
export const delAddress = data => {
  return httpService({
    url: 'third/user/delete/address',
    method: 'GET',
    data
  });
};
// 申诉账号校验姓名和身份证号是否匹配
export const checkInfo = data => {
  return httpService({
    url: 'third/user/appeal',
    method: 'POST',
    data
  });
};
// 申诉账号校验身份证号图片是否合法
export const checkIdCardImg = data => {
  return httpService({
    url: 'third/user/checkIdCardImg',
    method: 'POST',
    data
  });
};
// 申诉账号账号申诉成功后更新手机号
export const updateUserInfo = data => {
  return httpService({
    url: 'third/user/appealSuccess',
    method: 'POST',
    data
  });
};
// 获取用户审核记录
export const getAuditRecords = data => {
  return httpService({
    url: 'check/list',
    method: 'GET',
    data
  });
};
export const getMessageList = () => {
  return httpService({
    url: 'message/list',
    method: 'GET'
  });
};
export const readMessage = data => {
  return httpService({
    url: 'message/readMessage',
    method: 'GET',
    data
  });
};
export const messageNum = () => {
  return httpService({
    url: 'message/unReadMessageCount',
    method: 'GET'
  });
};
// 用户新增留言
export const addLeavingMessage = data => {
  return httpService({
    url: 'user/leavingMessage/addUserLeavingMessage',
    method: 'POST',
    data
  });
};
// 用户留言列表
export const getLeavingMessageList = () => {
  return httpService({
    url: 'user/leavingMessage/getUserLeavingMessage',
    method: 'GET'
  });
};
// 客服中心
export const customerService = () => {
  return httpService({
    url: 'tencent/cloud/client/get/userSig/url',
    method: 'GET'
  });
};

/**
 * 系统消息
 * @param data
 * @returns
 */
export const getSysMessages = data => {
  return httpService({
    url: 'message/page',
    method: 'GET',
    data
  });
};

export const logout = remark => {
  return httpService({
    url: 'third/user/logout',
    method: 'GET',
    data: { remark }
  });
};

/**
 * 获取券码数量
 * @returns
 */
export const getCouponCount = () => {
  return httpService({
    url: 'presentation/queryPresentationNum',
    method: 'GET'
  });
};
