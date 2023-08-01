import dayjs from 'dayjs';

/**
 * 生成陪护时间
 * params
 *     startDate: 开始时间
 *     endDate:   结束时间
 *     completeDayNumbers: 已完成列表
 * return
 *     陪护时间列表
 */
export const createAccompanyDate = (startDate: string, endDate: string, completeDayNumbers: number[]) => {
  const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000) + 1;
  const dateList = [] as any;
  for (let i = 0; i < days; i++) {
    dateList.push({
      startDate,
      endDate,
      time: dayjs(dayjs(startDate).add(i, 'd')).format('MM.DD'),
      complete: !!completeDayNumbers.includes(i + 1),
      index: i + 1
    });
  }
  return dateList;
};
/**
 * 陪护进度
 * params
 *     startDate: 开始时间
 * return
 *     进度条百分比
 */
export const accompanyProgress = (startDate: string, endDate: string) => {
  const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000);
  const progress = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000));
  return (progress / days) * 100 > 100 ? 100 : (progress / days) * 100;
};
