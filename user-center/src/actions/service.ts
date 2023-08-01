import httpService from '@utils/request';

// 评价选项
export const getOptions = data => {
  return httpService({
    url: 'comment/getOptions',
    method: 'GET',
    data
  });
};
// 添加评价
export const add = data => {
  return httpService({
    url: 'comment/add',
    method: 'POST',
    data
  });
};
// 获取剩余评价
export const getContinueCommentList = () => {
  return httpService({
    url: 'comment/getContinueCommentList',
    method: 'GET'
  });
};
// 获取评价详情
export const getEvaluate = data => {
  return httpService({
    url: 'comment/get',
    method: 'GET',
    data
  });
};
// 获取服务详情
export const getServiceDetail = data => {
  return httpService({
    url: 'service/getServiceInfoByServiceInfoId',
    method: 'GET',
    data
  });
};
// 直接兑换
export const addCouponCode = data => {
  return httpService({
    url: 'onlineService/create/couponCode',
    method: 'POST',
    data
  });
};
// 获取兑换详情
export const getCouponCode = data => {
  return httpService({
    url: 'onlineService/get/couponCode',
    method: 'GET',
    data
  });
};
// 获取商品兑换列表
export const getPhysicalGoodsRecords = data => {
  return httpService({
    url: 'physicalGoods/records',
    method: 'GET',
    data
  });
};
export const getVirtualRecord = data => {
  return httpService({
    url: 'virtual/goods/record',
    method: 'GET',
    data
  });
};
// 兑换商品
export const physicalGoodsCreate = data => {
  return httpService({
    url: 'physicalGoods/create',
    method: 'POST',
    data
  });
};
export const physicalGoodsInfo = data => {
  return httpService({
    url: 'physicalGoods/info',
    method: 'GET',
    data
  });
};
export const addService = data => {
  return httpService({
    url: 'service/addFromPackageConfig',
    method: 'POST',
    data
  });
};
export const needSelect = () => {
  return httpService({
    url: 'service/needSelect',
    method: 'GET'
  });
};
export const getDiagnoseInfo = data => {
  return httpService({
    url: 'online/diagnose/getDiagnoseInfo',
    method: 'GET',
    data
  });
};
export const disabetsJump = data => {
  return httpService({
    url: `uc-diabetes-management/check/jump/to/where/${data}`,
    method: 'GET'
  });
};

/**
 * 获取医加壹h5地址
 * @param serviceRecordId
 * @returns
 */
export const getYjyUrl = (serviceRecordId: string) => {
  return httpService({
    url: `service/getYJYUrl/${serviceRecordId}`,
    method: 'GET'
  });
};

/**
 * 获取详情
 * @param serviceRecordId
 * @returns
 */
export const getYjyDetail = (serviceRecordId: string) => {
  return httpService({
    url: `service/getYJYDetail/${serviceRecordId}`,
    method: 'GET'
  });
};

export const getReserveConfig = (id: string) => {
  return httpService({
    url: `reserve/getReserveConfig?id=${id}`,
    method: 'GET'
  });
};
/**
 * 获取第三方应用token
 * @param serviceType
 * @param viewType 0 未使用 1 已使用
 * @returns
 */
export const getThirdToken = (serviceType:number, viewType:number) => {
  return httpService({
    url: `third/user/sleep/getHealthManagementUrl?serviceType=${serviceType}&viewType=${viewType}`,
    method: 'GET'
  });
};

/**
 * 通过recommendId获取服务
 * @param id recommendId
 * @returns
 */
export const getServiceInfo = (id) => {
  return httpService({
    url: `service/generateRecommendService?id=${id}`,
    method: 'GET'
  }
  );
};
/**
 * 九洲用
 * 获取订单序列号
 */
export const getSerialNum = (serviceRecordId) => {
  return httpService({
    url: `medicine/order/getSerialNumber?serviceRecordId=${serviceRecordId}`,
    method: 'GET'
  });
};
/**
 * 预约服务组 根据服务记录ID获取服务城市和网点
 * @param serviceRecordId
 * @returns
 */
export const getProvinceCitySite = (serviceRecordId) => {
  return httpService({
    url: `reserve/reverse/citySite?serviceRecordId=${serviceRecordId}`,
    method: 'GET'
  });
};

/**
 * 预约服务组 修改预约serviceinfoid
 * @param serviceInfoId
 * @param serviceRecordId
 * @returns
 */
export const updateServiceInfoId = (serviceInfoId, serviceRecordId) => {
  return httpService({
    url: 'reserve/reverse/updateRecordService',
    data: {
      serviceInfoId, serviceRecordId
    },
    method: 'GET'
  });
};

export const getSiteInfo = (siteId) => {
  return httpService({
    url: 'reserve/reverse/getServiceSite',
    data: {
      siteId
    },
    method: 'GET'
  });
};
