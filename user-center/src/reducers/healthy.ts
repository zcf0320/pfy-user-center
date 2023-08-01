import {
  SET_HEALTHY_FILE,
  SET_SHOW_NUMBER,
  GET_HEALTHY_FILE,
  GET_OLD_HEALTHY_FILE,
  INIT_OLD_HEALTHY_FILE
} from '@constants/healthy';
import { saveHealthFile } from '@actions/healthy';

const INITIAL_STATE = {
  showNumber: 0,
  healthyFile: {},
  oldHealthyFile: {}
};
const healthy = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_HEALTHY_FILE: {
      saveHealthFile(action.payload);
      return {
        ...state
      };
    }
    case GET_HEALTHY_FILE:
      return state.healthyFile;
    case GET_OLD_HEALTHY_FILE:
      return {
        ...state,
        oldHealthyFile: action.payload
      };
    case INIT_OLD_HEALTHY_FILE:
      return {
        ...state,
        oldHealthyFile: {}
      };
    case SET_SHOW_NUMBER:
      return {
        ...state,
        showNumber: action.payload
      };
    default:
      return state;
  }
};
export default healthy;
