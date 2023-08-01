import Taro from '@tarojs/taro';
import {
  SET_USER_INFO,
  SET_TOKEN,
  SET_WEIXIN_USERINFO,
  IS_SHOW_LOGIN,
  GET_SIGN_LIST,
  GET_QUESTIONNAURE_LIST,
  SET_MODAL,
  INIT_MODAL
} from '@constants/common';
import i18n from '@i18n/index';

export interface ModalData {
  show?: boolean;
  title?: string;
  content?: string;
  subTitle?: string;
  showCancel?: boolean;
  cancelText?: string;
  cancelActive?: boolean;
  confirmActive?: boolean;
  showConfirm?: boolean;
  confirmText?: string;
  confirmColor?: string;
  cancelColor?: string;
  clickCancel?: () => void;
  clickConfirm?: () => void;
}
const initCustomModal: ModalData = {
  show: false,
  title: i18n.chain.common.tips,
  content: '',
  subTitle: '',
  showCancel: true,
  cancelText: i18n.chain.button.cancel,
  // cancelActive: false,
  // confirmActive: true,
  cancelColor: '#dcdddc',
  confirmColor:
    'linear-gradient(102deg, #f87a56 0%, #ff5d50 43%, #ff5d50 100%)',
  showConfirm: true,
  confirmText: i18n.chain.button.determine,
  clickCancel: () => {
    // do something
  },
  clickConfirm: () => {
    // do something
  }
};
const INITIAL_STATE = {
  userInfo: {},
  showLogin: false,
  token: Taro.getStorageSync('token') || '',
  weixinUserInfo: {},
  signList: [],
  questionnaireList: [],
  customModal: initCustomModal
};

export default function common (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case SET_WEIXIN_USERINFO:
      return {
        ...state,
        weixinUserInfo: action.payload
      };
    case IS_SHOW_LOGIN:
      return {
        ...state,
        showLogin: action.payload
      };
    case GET_SIGN_LIST:
      return {
        ...state,
        signList: action.payload
      };
    case GET_QUESTIONNAURE_LIST:
      return {
        ...state,
        questionnaireList: action.payload
      };
    case SET_MODAL:
      return {
        ...state,
        customModal: Object.assign({}, state.customModal, action.payload)
      };
    case INIT_MODAL:
      return {
        ...state,
        customModal: initCustomModal
      };
    default:
      return state;
  }
}
