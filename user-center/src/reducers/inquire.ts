import {
  GET_DIAGNOSE_LIST,
  CHANGE_RECORD_LIST,
  SET_SERVICE_RECORD_ID,
  SET_CHAT_INFO
} from '@constants/inquire';

/**
 * localType为对话操作类型
 * 1 开始问诊, 2 继续问诊, 3 看记录, 4 去选择, 5 选择回答, 6 结果, 7 待评价, 8 评价完成 9 结束用语
 */

const INITIAL_STATE = {
  diagnoseList: [],
  recordList: [],
  serviceRecordId: '',
  chatInfo: ''
};

export default function inquire (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_RECORD_LIST:
      return Object.assign({}, { ...state }, { recordList: action.payload });
    case GET_DIAGNOSE_LIST:
      return Object.assign({}, { ...state }, { diagnoseList: action.pageNum === 1 ? action.payload : state.diagnoseList.concat(action.payload) });
    case SET_SERVICE_RECORD_ID:
      return Object.assign({}, { ...state }, { serviceRecordId: action.payload });
    case SET_CHAT_INFO:
      return Object.assign({}, { ...state }, { chatInfo: action.payload });
    default:
      return state;
  }
}
