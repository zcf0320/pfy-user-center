import utils from '@utils/index';
import {
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_LIST,
  GET_USER_SCORE,
  GET_RECORDS_LIST,
  GET_MAIN_PRODUCT_LIST,
  RESET_USER_SCREORE,
  SET_DIS_BUY
} from '../constants/mall';

const INITIAL_STATE = {
  productDetail: {},
  // 列表是否加载完毕
  productList: [],
  mainProductList: [],
  // 用户积分
  userScore: '-',
  recordsList: [] as any,
  // 禁止买卖
  disableBuy: false
};
interface ITimeObj {
  time: string;
  records: Array<any>;
}

export default function mall (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_PRODUCT_DETAIL:
      return {
        ...state,
        disableBuy: !!(state.userScore >= action.payload.score),
        productDetail: action.payload
      };
    case GET_MAIN_PRODUCT_LIST: {
      const productList = action.payload;
      productList.length < 4 &&
        productList.push({ productId: null, serviceItemName: '敬请期待' });
      return {
        ...state,
        mainProductList: action.payload
      };
    }
    case GET_PRODUCT_LIST:
      return {
        ...state,
        productList:
          action.pageNum === 1
            ? action.payload
            : state.productList.concat(action.payload)
      };
    case GET_USER_SCORE:
      return {
        ...state,
        userScore: action.payload
      };
    case RESET_USER_SCREORE:
      return {
        ...state,
        userScore: '-'
      };
    case GET_RECORDS_LIST: {
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
        const { recordsList } = state;
        const lastData: any = recordsList[recordsList.length - 1];
        const fristData = resultArr[0];
        if (lastData.time === fristData.time) {
          state.recordsList[recordsList.length - 1].records = state.recordsList[
            recordsList.length - 1
          ].records.concat(fristData.records);
        }
        resultArr.shift();
      }
      // 进行分类
      return {
        ...state,
        recordsList:
          action.pageNum === 1
            ? resultArr
            : state.recordsList.concat(resultArr)
      };
    }
    case SET_DIS_BUY:
      return {
        ...state,
        disableBuy: action.payload
      };
    default:
      return state;
  }
}
