import httpService from '@utils/request';

// 获取文章类型
export const getType = () => {
  return httpService({
    url: 'publish/content/types',
    method: 'GET'
  });
};
// 获取文章列表
export const getList = data => {
  return httpService({
    url: 'publish/content/list',
    method: 'GET',
    data
  });
};
// 获取文章详情
export const getDetail = data => {
  return httpService({
    url: 'publish/content/detail',
    method: 'GET',
    data
  });
};
// 分享健康资讯
export const shareHealth = data => {
  return httpService({
    url: 'score/task/shareHealthInformation',
    method: 'POST',
    data
  });
};
