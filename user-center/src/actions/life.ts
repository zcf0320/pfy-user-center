import httpService from '@utils/request';

export default {
  getDailyInfo (data: { serviceRecordId: string }) {
    return httpService({
      url: 'escort/getDailyInfo',
      method: 'GET',
      data
    });
  }
};
