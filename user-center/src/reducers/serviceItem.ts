import {
  GET_SERVICE_RECORD,
  GET_PRODUCT_SPECIFICATION,
  GET_PHYSICAL_GOOD,
  GET_PHYSICALGOOD_INFO,
  GET_MATERIA_LIST,
  GET_PROJECT_LIST,
  SAVE_INFO,
  SET_UNION_LIST,
  SET_VALUE_LIST
} from '../constants/serviceItem';

const INITIAL_STATE = {
  productSpecifications: [],
  physicalGoodsInfo: {},
  materialList: [],
  projectList: [],
  saveInfo: {},
  unionList: [],
  valueList: []
};

export default function serviceItem (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SERVICE_RECORD:
      return {
        ...state
      };
    case GET_PRODUCT_SPECIFICATION:
      return {
        ...state,
        productSpecifications: action.payload
      };
    case GET_PHYSICAL_GOOD:
      return {
        ...state
      };
    case GET_PHYSICALGOOD_INFO:
      return {
        ...state,
        physicalGoodsInfo: action.payload
      };
    case GET_MATERIA_LIST:
      return {
        ...state,
        materialList: action.payload
      };
    case GET_PROJECT_LIST:
      return Object.assign({}, { ...state }, { projectList: action.payload });
    case SAVE_INFO:
      return Object.assign({}, { ...state }, { saveInfo: action.payload });
    case SET_UNION_LIST:
      return Object.assign({}, { ...state }, { unionList: action.payload });
    case SET_VALUE_LIST:
      return Object.assign({}, { ...state }, { valueList: action.payload });
    default:
      return state;
  }
}
