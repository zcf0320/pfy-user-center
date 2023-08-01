import {
  GET_SERVICE_DETAIL,
  GET_EVALUATE_DETAIL,
  GET_CONTINUE_LIST,
  GET_COMMODITY_EXCHANGE,
  GET_SELECT_ADDRESS
} from '../constants/service';

const INITIAL_STATE = {
  serviceDetail: {},
  evaluateDeatil: {},
  continueCommentList: [],
  commodityExchangeList: [],
  selectAdddress: {}
};

export default function service (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SERVICE_DETAIL:
      return {
        ...state,
        serviceDetail: action.payload
      };
    case GET_EVALUATE_DETAIL:
      return {
        ...state,
        evaluateDeatil: action.payload
      };
    case GET_CONTINUE_LIST:
      return {
        ...state,
        continueCommentList: action.payload
      };
    case GET_COMMODITY_EXCHANGE:
      return {
        ...state,
        commodityExchangeList: action.pageNum === 1 ? action.payload : state.commodityExchangeList.concat(action.payload)
      };
    case GET_SELECT_ADDRESS:
      return {
        ...state,
        selectAdddress: action.payload
      };
    default:
      return state;
  }
}
