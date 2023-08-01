import appConfig from './appConfig';
import Auth from './auth';
import * as StrTool from './strTool';
import * as time from './time';
import * as Location from './location';
import * as ObjectUtils from './ObjectUtils';
import * as Common from './common';

interface Utils {
  appConfig: any;
  Auth: any;
  timeFormat: Function;
  getWebViewTitle: Function;
  checkPhone: Function;
  checkMail: Function;
  checkIdCard: Function;
  hidePhone: Function;
  getProviceId: Function;
  testInt: Function;
  testNumber: Function;
  getLocation: Function;
  getAgeByIdCard: Function;
  getSexByIdCard: Function;
  getZeroTime: Function;

  // debounce: Function
  orderStatus: Function;
  chatTimeTransform: Function;
  isEmptyObject: Function;
  extendObjects: Function;
  createAccompanyDate: Function;
  hasSafeArea: Function;
  isSameWeek: Function;
  isToday: Function;
  getUrlParams: Function;
}
const utils: Utils = Object.assign(
  { appConfig },
  { Auth },
  StrTool,
  time,
  Location,
  ObjectUtils,
  Common
);
export default utils;
