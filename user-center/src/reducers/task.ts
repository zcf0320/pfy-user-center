import { GET_TASK_LIST, ADD_DAILY_HEALTH, GET_INDEX } from '../constants/task';

const INITIAL_STATE = {
  taskList: [],
  healthRes: {},
  curIndex: -1
};

export default function mall (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_TASK_LIST:
      return {
        ...state,
        taskList: action.payload
      };
    case ADD_DAILY_HEALTH:
      return {
        ...state,
        healthRes: action.payload
      };
    case GET_INDEX:
      return {
        ...state,
        curIndex: action.payload.index
      };
    default:
      return state;
  }
}
