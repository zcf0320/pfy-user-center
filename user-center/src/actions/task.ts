import httpService from '@utils/request';

// 获取任务列表
export const getList = () => {
  return httpService({
    url: 'score/task/list',
    method: 'GET',
    showLoading: false
  });
};
// 填写每日血压,血糖信息
export const addDailyHealth = data => {
  return httpService({
    url: 'score/task/addDailyHealth',
    method: 'POST',
    data
  });
};
// 抽奖--获取下标
export const getIndex = () => {
  return httpService({
    url: 'score/task/lotteryIndex',
    method: 'GET',
    showLoading: false
  });
};
