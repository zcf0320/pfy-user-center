import Taro from '@tarojs/taro';

export function checkPhone (phone) {
  if (!/^1[3456789]\d{9}$/.test(phone)) {
    return false;
  } else {
    return true;
  }
}
// 校验邮箱
export function checkMail (mail) {
  if (!/^([a-zA-Z\d])(\w|\\-)+@[a-zA-Z\d_-]+\.[a-zA-Z]{2,4}$/.test(mail)) {
    return false;
  } else {
    return true;
  }
}
// 校验身份证
export function checkIdCard (idCard) {
  if (
    !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
      idCard
    )
  ) {
    return false;
  } else {
    return true;
  }
}
export function hidePhone (phone) {
  if (!phone) {
    return;
  }
  return phone.substring(0, 3) + '****' + phone.substr(phone.length - 4);
}
export function decimal (value: number): string {
  let text = String(value);
  const textArr = text.split('.');
  if (textArr.length === 1) {
    text = text + '.00';
  }
  if (textArr.length > 1) {
    if (textArr[1].length < 2) {
      text = text + '0';
    }
  }
  return text;
}
export function getWebViewTitle (type) {
  let title = '寰宇关爱';
  type === 1 && (title = '膳食营养与健康测评');
  type === 2 && (title = '糖尿病健康测试');
  type === 3 && (title = '心脏病健康测试');
  type === 4 && (title = '高血压健康测试');
  type === 5 && (title = '健康身高管理');
  type === 38 && (title = 'HRA健康方式风险评估');
  return title;
}
// export function debounce(fn,wait){
//     let timer;
//     return function(){
//          const args = arguments,that = this;
//          timer && clearTimeout(timer);
//          timer = setTimeout(function(){fn.apply(that,args);},wait);
//     };
// }
// 校验最多两位
export function testNumber (val) {
  if (!val) {
    return;
  }
  val = Number(val);
  if (/^\d+(\.\d{1,2})?$/.test(val)) {
    return true;
  } else {
    return false;
  }
}
// 校验是否为整数
export function testInt (val) {
  if (!val) {
    return;
  }
  val = Number(val);
  if (/^[1-9]\d*$/.test(val)) {
    return true;
  } else {
    return false;
  }
}
// 通过身份证号获取年龄
export function getAgeByIdCard (identify) {
  const UUserCard = identify;
  if (UUserCard !== null && UUserCard !== '') {
    // 获取年龄
    const myDate = new Date();
    const month = myDate.getMonth() + 1;
    const day = myDate.getDate();
    let age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (
      UUserCard.substring(10, 12) < month ||
      (UUserCard.substring(10, 12) === month &&
        UUserCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    return age;
  }
}
// 通过身份证获取性别
export function getSexByIdCard (idCard) {
  let sexStr = '';
  if (parseInt(idCard.slice(-2, -1)) % 2 === 1) {
    sexStr = '男';
  } else {
    sexStr = '女';
  }
  return sexStr;
}
// 通过身份证获取出身日期
export function getBirthByIdCard (idCard) {
  let birthday = '';
  if (idCard !== null && idCard !== '' && idCard.length === 18) {
    birthday = idCard.slice(6, 14);
    birthday = birthday.replace(/(.{4})(.{2})/, '$1/$2/');
    // 通过正则表达式来指定输出格式为:1990/01/01
  }
  return birthday;
}

export const getUrlParams = (name: string, url?: string) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return '';
  }
  if (!results[2]) {
    return '';
  }
  return results[2];
};
export const orderStatus = orderState => {
  let text = '';
  orderState === 1 && (text = '待确认');
  orderState === 2 && (text = '待发货');
  orderState === 3 && (text = '已发货');
  orderState === 4 && (text = '已完成');
  orderState === 5 && (text = '已取消');
  orderState === 6 && (text = '进行中');
  return text;
};
export const hasSafeArea = () => {
  let result = false;
  const { model } = Taro.getSystemInfoSync();
  if (
    model === 'iPhone X' ||
    model.indexOf('iPhone11') > -1 ||
    model.indexOf('iPhone12') > -1 ||
    model.indexOf('iPhone13') > -1
  ) {
    result = true;
  }
  return result;
};
