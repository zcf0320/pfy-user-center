import {
  GET_ARTICLE,
  GET_HISTORY,
  GET_TYPES,
  SET_TYPES,
  SET_PRODUCT_TYPE,
  GET_PRODUCT_LIST,
  GET_PRODUCT_DETAIL,
  GET_ORDER_LIST,
  GET_ORDER_DETAIL,
  SET_VISIT_INFO,
  SET_RECOMMEND_LIST,
  SET_GROUP_LIST,
  SELECT_LIST,
  RESET_LIST,
  SET_BUY_NUMBER,
  SET_IMPORT_LIST
} from '@constants/minApp';

const INITIAL_STATE = {
  // 专栏类别
  typeList: [],
  articleList: [],
  historyList: [],
  productType: [],
  productList: [],
  productDetail: {},
  orderList: [],
  orderDetail: [],
  // 就诊信息
  visitInfo: {},
  groupVOList: [] as any,
  recommendList: [] as any,
  selectRecommendList: [] as any,
  selectGroupList: [] as any,
  buyNum: 1
};
export default function minApp (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_TYPES:
      return {
        ...state,
        typeList: action.payload
      };
    case SET_TYPES: {
      return {
        ...state,
        typeList: action.payload
      };
    }
    case GET_ARTICLE: {
      return {
        ...state,
        articleList:
          action.pageNum === 1
            ? action.payload
            : state.articleList.concat(action.payload)
      };
    }
    case GET_HISTORY: {
      return {
        ...state,
        historyList: action.payload
      };
    }
    case SET_PRODUCT_TYPE: {
      // 默认选择第一个
      return {
        ...state,
        productType: action.payload
      };
    }
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        productList:
          action.pageNum === 1
            ? action.payload
            : state.productList.concat(action.payload)
      };
    }
    case GET_PRODUCT_DETAIL: {
      return {
        ...state,
        productDetail: action.payload
      };
    }
    case GET_ORDER_LIST: {
      return {
        ...state,
        orderList:
          action.pageNum === 1
            ? action.payload
            : state.orderList.concat(action.payload)
      };
    }
    case GET_ORDER_DETAIL: {
      return {
        ...state,
        orderDetail: action.payload
      };
    }
    case SET_VISIT_INFO: {
      return {
        ...state,
        visitInfo: action.payload
      };
    }
    case SET_RECOMMEND_LIST: {
      return {
        ...state,
        recommendList: action.payload
      };
    }
    case SET_GROUP_LIST: {
      return {
        ...state,
        groupVOList: action.payload
      };
    }
    case SELECT_LIST: {
      const { cIndex, rIndex } = action.payload;

      if (cIndex !== undefined) {
        // 遍历推荐
        const { type } = state.groupVOList[cIndex];
        const select = state.groupVOList[cIndex].productVOList[rIndex].select;
        // const { id } = state.groupVOList[cIndex].productVOList[rIndex];
        state.groupVOList[cIndex].productVOList.forEach(item => {
          item.disable = !select;
        });
        state.groupVOList[cIndex].productVOList[rIndex].disable = false;

        state.recommendList.forEach(item => {
          if (item.type === type) {
            item.disable = !select;
          }
        });
        state.groupVOList[cIndex].productVOList[rIndex].select = !select;
      } else {
        // 遍历类
        const select = state.recommendList[rIndex].select;

        const { id, type } = state.recommendList[rIndex];
        state.recommendList[rIndex].select = !select;
        state.recommendList.forEach(item => {
          if (item.type === type && item.id !== id) {
            item.disable = !select;
          }
        });
        state.groupVOList.forEach(item => {
          if (item.type === type) {
            item.productVOList.forEach(pItem => {
              pItem.disable = !select;
            });
          }
        });
      }
      if (cIndex !== undefined) {
        const { id } = state.groupVOList[cIndex].productVOList[rIndex];
        const inIndex = state.selectGroupList.indexOf(id);
        if (inIndex > -1) {
          state.selectGroupList.splice(inIndex, 1);
        } else {
          state.selectGroupList.push(id);
        }
      } else {
        const { id } = state.recommendList[rIndex];
        const inIndex = state.selectRecommendList.indexOf(id);
        if (inIndex > -1) {
          state.selectRecommendList.splice(inIndex, 1);
        } else {
          state.selectRecommendList.push(id);
        }
      }
      const selectList = Object.assign(
        {},
        { selectGroupList: state.selectGroupList },
        { selectRecommendList: state.selectRecommendList }
      );
      const list = Object.assign(
        {},
        { groupVOList: state.groupVOList },
        { recommendList: state.recommendList }
      );
      return {
        ...state,
        list,
        selectList
      };
    }
    case SET_IMPORT_LIST:
      action.payload.forEach(item => {
        if (item.select) {
          state.groupVOList.forEach(gItem => {
            if (gItem.type === item.type) {
              gItem.productVOList.forEach(pItem => {
                pItem.disable = true;
              });
            }
          });
          state.selectRecommendList.push(item.id);
        }
      });
      return {
        ...state,
        recommendList: action.payload,
        selectRecommendList: state.selectRecommendList,
        groupVOList: state.groupVOList
      };
    case SET_BUY_NUMBER:
      return {
        ...state,
        buyNum: action.payload
      };
    case RESET_LIST:
      return {
        ...state,
        selectRecommendList: [],
        selectGroupList: []
      };
    default:
      return state;
  }
}
