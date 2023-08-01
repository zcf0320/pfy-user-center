import httpService from '@utils/request';

export const getPlanList = () => {
  return httpService({
    url: 'health/plan/listAll',
    method: 'GET'
  });
};
export const getPlanInfo = data => {
  return httpService({
    url: 'health/plan/info',
    method: 'GET',
    data
  });
};
export const receiveGift = data => {
  return httpService({
    url: 'health/plan/receiveGift',
    method: 'GET',
    data
  });
};
export const getMyPlanList = data => {
  return httpService({
    url: 'health/plan/myPlan/list',
    method: 'GET',
    data
  });
};
export const getRecommenInfoByVersion = data => {
  return httpService({
    url: 'health/plan/getRecommenInfoByVersion',
    method: 'GET',
    data
  });
};
export const getHealthScore = () => {
  return httpService({
    url: 'healthScore/lastScore',
    method: 'GET'
  });
};
export const updateHealthScore = () => {
  return httpService({
    url: 'healthScore/updateHealthScore',
    method: 'GET'
  });
};
