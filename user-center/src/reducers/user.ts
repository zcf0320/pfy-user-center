import utils from '@utils/index';
import {
  GET_MAIN_SERVICE_LIST,
  GET_SERVICE_LIST,
  GET_EXCHANGEG_RECORD,
  GET_PROVICE_LIST,
  SET_PROVICE_PICK_ARR,
  GET_SITE_LIST,
  GET_APPOINTMENT_INFO,
  GET_APPOINTMENT_RECORD_LIST,
  SET_MAIN_SERVICE_LIST_NULL,
  GET_SERVICE_INFO,
  GET_ONLINE_SERVICE,
  GET_DC_SERVICE,
  GET_BLOOD_TYPE,
  GET_ADDRESS_LIST,
  GET_ALLPROVICE_LIST,
  SET_ALLPROVICE_PICK_ARR,
  SET_DEFAULT_ADDRESS,
  EDIT_ADDRESS_INFO,
  ACCOUNT_APPEAL_UPDATE,
  GET_AUDIT_RECORDS,
  SET_DISTRICTS,
  GET_ALL_UPDOORCITY_LIST,
  GET_SELECT_UPDOORCITY_LIST
} from '../constants/user';

const INITIAL_STATE = {
  mainServiceList: [],
  isLoadAll: false,
  isSend: false,
  serviceList: [],
  exchangeRecordList: []as any,
  proviceList: [] as any,
  provicePickArr: [],
  siteList: [],
  appointmentInfo: {},
  appointmentRecordList: [],
  serviceInfo: {},
  onLineList: [],
  dcServiceList: [],
  bloodType: [],
  addressList: [],
  allProviceList: [] as any,
  allProvicePickArr: [] as any,
  editAddressInfo: {},
  accountAppealInfo: {},
  auditRecords: [],
  upDoorCityList: [] as any,
  upDoorCitySelectList: []
};
export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_DC_SERVICE:
      return {
        ...state,
        dcServiceList: action.payload
      };
    case GET_MAIN_SERVICE_LIST:
      return {
        ...state,
        mainServiceList: action.payload,
        isLoadAll: true,
        isSend: true
      };
    case GET_SERVICE_INFO:
      return {
        ...state,
        serviceInfo: action.payload
      };
    case SET_MAIN_SERVICE_LIST_NULL:
      return {
        ...state,
        mainServiceList: [],
        isLoadAll: false
      };
    case GET_ONLINE_SERVICE:
      return {
        ...state,
        onLineList:
          action.pageNum === 1
            ? action.payload
            : state.onLineList.concat(action.payload)
      };
    case GET_SERVICE_LIST:
      return {
        ...state,
        serviceList:
          action.pageNum === 1
            ? action.payload
            : state.serviceList.concat(action.payload)
      };
    case GET_EXCHANGEG_RECORD: {
      const resultArr: Array<any> = [];
      const timeArr: Array<string> = [];
      // 获取分类的月份
      action.payload.length &&
        action.payload.forEach(item => {
          const time: string = utils.timeFormat(item.createTime, 'y年m月');
          // 已经存在的时间
          if (timeArr.indexOf(time) === -1) {
            timeArr.push(time);
          }
        });
      interface ITimeObj {
        time: string;
        records: Array<any>;
      }
      timeArr.length &&
        timeArr.forEach(tItem => {
          const timeObj: ITimeObj = {
            time: tItem,
            records: []
          };
          action.payload.length &&
            action.payload.forEach(item => {
              const time: string = utils.timeFormat(item.createTime, 'y年m月');
              if (time === tItem) {
                timeObj.records.push(item);
              }
            });
          resultArr.push(timeObj);
        });
      // 非第一页
      if (action.pageNum !== 1 && resultArr.length) {
        // 判断原有的数据是否有现有的时间
        const { exchangeRecordList } = state;
        const lastData: any = exchangeRecordList[exchangeRecordList.length - 1];
        const fristData = resultArr[0];
        if (lastData.time === fristData.time) {
          state.exchangeRecordList[
            exchangeRecordList.length - 1
          ].records = state.exchangeRecordList[
            exchangeRecordList.length - 1
          ].records.concat(fristData.records);
        }
        resultArr.shift();
      }
      // 进行分类
      return {
        ...state,
        exchangeRecordList:
          action.pageNum === 1
            ? resultArr
            : state.exchangeRecordList.concat(resultArr)
      };
    }
    case GET_PROVICE_LIST:
      action.payload.forEach(item => {
        item.label = item.provinceName;
        item.cities.length &&
          item.cities.forEach(cItem => {
            cItem.label = cItem.cityName;
          });
      });
      return {
        ...state,
        proviceList: action.payload
      };
    case SET_PROVICE_PICK_ARR:

      return {
        ...state,
        provicePickArr: [
          [...state.proviceList],
          [...state.proviceList[action.payload].cities]
        ]
      };

    case GET_SITE_LIST:
      return {
        ...state,
        siteList: action.payload
      };
    case GET_ALL_UPDOORCITY_LIST:
      action.payload.forEach(item => {
        item.label = item.provName;
        item.cityList.length &&
          item.cityList.forEach(cItem => {
            cItem.label = cItem.cityName;
          });
      });
      if (action.payload[0]) {
        return {
          ...state,
          upDoorCityList: action.payload,
          upDoorCitySelectList: [
            [...action.payload],
            [...action.payload[0].cityList]
          ]
        };
      } else {
        return {
          ...state,
          upDoorCityList: action.payload,
          upDoorCitySelectList: [[...action.payload], []]
        };
      }
    case GET_SELECT_UPDOORCITY_LIST:
      return {
        ...state,
        upDoorCitySelectList: [
          [...state.upDoorCityList],
          [...state.upDoorCityList[action.payload].cityList]
        ]
      };
    case GET_APPOINTMENT_INFO:
      return {
        ...state,
        appointmentInfo: action.payload
      };
    case GET_APPOINTMENT_RECORD_LIST:
      return {
        ...state,
        appointmentRecordList:
          action.pageNum === 1
            ? action.payload
            : state.appointmentRecordList.concat(action.payload)
      };
    case GET_BLOOD_TYPE:
      return {
        ...state,
        bloodType: action.payload
      };
    case GET_ADDRESS_LIST:
      return Object.assign({}, state, { addressList: action.payload });

    case GET_ALLPROVICE_LIST:
      return {
        ...state,
        allProviceList: action.payload
      };
    case SET_DEFAULT_ADDRESS:
      state.addressList.forEach((item: any, index) => {
        item.isDefault = false;
        index === action.payload && (item.isDefault = true);
      });
      return {
        ...state,
        addressList: [...state.addressList]
      };
    case SET_ALLPROVICE_PICK_ARR:
      return {
        ...state,
        allProvicePickArr: [
          [...state.allProviceList],
          [...state.allProviceList[action.payload].cities]
        ]
      };
    case SET_DISTRICTS:
      return {
        ...state,
        allProvicePickArr: [
          [...state.allProvicePickArr[0]],
          [...state.allProvicePickArr[1]],
          [...state.allProvicePickArr[1][action.payload].districts]
        ]
      };
    case EDIT_ADDRESS_INFO:
      return {
        ...state,
        editAddressInfo: action.payload
      };
    case ACCOUNT_APPEAL_UPDATE:
      return {
        ...state,
        accountAppealInfo: action.payload
      };
    case GET_AUDIT_RECORDS:
      return {
        ...state,
        auditRecords:
          action.pageNum === 1
            ? action.payload
            : state.auditRecords.concat(action.payload)
      };
    default:
      return state;
  }
}
