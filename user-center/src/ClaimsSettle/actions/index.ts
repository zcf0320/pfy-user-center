import {
  DELETE_IMG,
  ADD_IMG,
  SET_SIGN_URL,
  SET_OLD_LIST,
  GET_FORM,
  UNION_HEALTH_INFO,
  SET_LIST,
  SET_CONFIG,
  CHANGE_TYPE,
  DELETE_ITEM,
  ADD_ITEM,
  CHANGE_FORM,
  CONCAT_MATERIALS,
  INIT_FORM,
  SAVE_SIGN_URL
} from '@constants/claimsSettle';
import { SET_MODAL } from '@constants/common';
// 删除图片
export const deleteImg = (payload: any) => {
  return {
    type: DELETE_IMG,
    payload
  };
};
// 添加图片
export const addImg = (payload: any) => {
  return {
    type: ADD_IMG,
    payload
  };
};
// 改变类型
export const changeType = (payload: any) => {
  return {
    type: CHANGE_TYPE,
    payload
  };
};
// 删除明细
export const deleteItem = (mold, payload: number) => {
  return {
    type: DELETE_ITEM,
    mold,
    payload
  };
};
// 新增明细
export const addItem = mold => {
  return {
    type: ADD_ITEM,
    mold
  };
};
// 改变时间
export const changeTime = payload => {
  return {
    type: CHANGE_FORM,
    payload
  };
};
// 删除弹窗
export const setModal = payload => {
  return {
    type: SET_MODAL,
    payload
  };
};
// 获取材料
export const setMaterials = payload => {
  return {
    type: CONCAT_MATERIALS,
    payload
  };
};

export const setOldList = payload => {
  return {
    type: SET_OLD_LIST,
    payload
  };
};
// init表单
export const initForm = () => {
  return {
    type: INIT_FORM
  };
};
export const setConfig = payload => {
  return {
    type: SET_CONFIG,
    payload
  };
};
export const setOldData = payload => {
  return {
    type: GET_FORM,
    payload
  };
};
export const setList = (mold, index, payload) => {
  return {
    type: SET_LIST,
    mold,
    index,
    payload
  };
};
export const setSignUrl = url => {
  return {
    type: SET_SIGN_URL,
    payload: url
  };
};
export const setSaveSignUrl = data => {
  return {
    type: SAVE_SIGN_URL,
    payload: data
  };
};
export const unionHealthInfo = data => {
  return {
    type: UNION_HEALTH_INFO,
    payload: data
  };
};
