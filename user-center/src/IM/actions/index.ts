import { SET_CHAT_INFO } from '@constants/inquire';
import { SET_MODAL } from '@constants/common';

export const ACTION_TYPE: any = {
  CHANGE_RECORD_LIST: 'CHANGE_RECORD_LIST',
  SET_SERVICE_RECORD_ID: 'SET_SERVICE_RECORD_ID'
};

// 问诊记录更改
export const changeRecordList = (payload) => {
  return {
    type: ACTION_TYPE.CHANGE_RECORD_LIST,
    payload
  };
};
// 问诊记录更改
export const setServiceRecordId = (payload) => {
  return {
    type: ACTION_TYPE.SET_SERVICE_RECORD_ID,
    payload
  };
};
export const setChatInfo = (payload) => {
  return {
    type: SET_CHAT_INFO,
    payload
  };
};
export const setModal = (payload) => {
  return {
    type: SET_MODAL,
    payload
  };
};
