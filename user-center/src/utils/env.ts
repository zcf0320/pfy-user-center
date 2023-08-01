export const isH5 = () => {
  return !!(process.env.TARO_ENV === 'h5');
};
export const isWeapp = () => {
  return !!(process.env.TARO_ENV === 'weapp');
};
