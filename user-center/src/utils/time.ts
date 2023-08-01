import dayjs from 'dayjs';

export const timeFormat = (time, formate = 'y-m-d h:m:s') => {
  let res = '';
  // if (time){
  // 强制时间戳为13尾，获取时间单值
  `${time}`.length === 10 && (time = Number(time) * 1000);
  const date = new Date(Number(time));
  const year: any = date.getFullYear();
  let month: any = date.getMonth() + 1;
  month = month >= 10 ? month : `0${month}`;
  let day: any = date.getDate();
  day = day >= 10 ? day : `0${day}`;
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  let secnds: any = date.getSeconds();
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  secnds = secnds >= 10 ? secnds : `0${secnds}`;
  // 替换年月日
  const formateArr = formate.split(' ');
  res = formateArr[0].split('y').join(year);
  res = res.split('m').join(month);
  res = res.split('d').join(day);

  // 替换时分秒
  if (formateArr[1]) {
    res += ` ${formateArr[1].split('h').join(hours)}`;
    res = res.split('m').join(minutes);
    res = res.split('s').join(secnds);
  }
  !year && (res = res.substr(1));
  // }
  return res;
};
// 获取0点时间的时间戳
export const getZeroTime = time => {
  if (!time) {
    return;
  }
  const date = new Date(time);
  const year: any = date.getFullYear();
  let month: any = date.getMonth() + 1;
  month = month >= 10 ? month : `0${month}`;
  let day: any = date.getDate();
  day = day >= 10 ? day : `0${day}`;
  return new Date(`${year}/${month}/${day} 00:00:00`).getTime();
};
export const chatTimeTransform = chatTime => {
  const currentTime = new Date().getTime();
  // 距离现在时间间隔
  const time = currentTime - chatTime;
  if (time < 24 * 60 * 60 * 1000) {
    return dayjs(chatTime).format('HH:mm');
  } else if (time >= 24 * 60 * 60 * 1000 && time < 48 * 60 * 60 * 1000) {
    return `昨天 ${dayjs(chatTime).format('HH:mm')}`;
  } else if (time >= 48 * 60 * 60 * 1000 && time < 7 * 24 * 60 * 60 * 1000) {
    return dayjs(chatTime).format('dddd HH:mm');
  } else {
    return dayjs(chatTime).format('YYYY-MM-DD HH:mm');
  }
};
// export const getUnix = (time) => {
//     const initTime = '1970/01/01 08:00:00';
// };
export const isSameWeek = time => {
  const nowDate = new Date();
  const week = nowDate.getDay();
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;
  const day = nowDate.getDate();
  const nowZeroTime = new Date(`${year}/${month}/${day} 00:00:00`).getTime();
  const startTime = nowZeroTime - (week - 1) * (3600 * 24 * 1000);
  const endTime = nowZeroTime + (7 - week + 1) * (3600 * 24 * 1000);

  if (time <= endTime && time >= startTime) {
    return true;
  } else {
    return false;
  }
};
export const isToday = time => {
  return !!(new Date(time).toDateString() === new Date().toDateString());
};
