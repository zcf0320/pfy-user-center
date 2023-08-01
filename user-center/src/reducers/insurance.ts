import {
  GET_CONFIG_SHIP,
  GET_CONFIG_JOB,
  GET_CONFIG_ALLOWANCE,
  GET_PROVICE_LIST,
  SET_PROVICE_PICK_ARR,
  GET_QUESTIONNAIRE_LIST,
  SET_SUB_INFO,
  GET_INSURE_RECORD,
  GET_INSURE_DETAIL,
  GET_MANAGE_LIST,
  GET_MANAGE_DETAIL,

  GET_INSURANCE_INFO,
  SET_INSURANCE_INFO,
  ADD_PERSON,
  SET_TWO_LEVEL_PROFESSION_LIST,
  SET_PROSON_INSURANCE_INFO,
  SET_QUESTION_LIST
} from '@constants/insurance';
import professionList from './professionList';

const insuranceItem = {
  age: '-',
  idCard: '',
  job: '-',
  name: '',
  sex: '-'
};
const INITIAL_STATE = {
  configShip: [],
  configJob: [],
  configAllowance: [],
  proviceList: [] as any,
  provicePickArr: [],
  questionnaireList: [],
  subInfo: {},
  insureRecord: [],
  insureDetail: {},
  manageList: [],
  manageDetail: {},
  insuranceDetail: {},
  insuranceInfo: {
    // 默认公司证件类型
    type: 1,
    qualificationDocumentsImg: [],
    insuredInfos: [
      insuranceItem
    ]
  },
  personInsuranceInfo: {

    policyHolderCertificateType: 1,
    insuredCertificateType: 1,
    numberOfInsured: 1,
    relationship: 1
  },
  questionList: [],
  // 选择的一级职业
  selectOneLevelIndex: 0,
  // 一级职业列表
  oneLevelProfessionList: professionList.root,
  // 二级的职业列表
  twoLevelProfessionList: []

};

export default function insurance (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CONFIG_SHIP:
      return {
        ...state,
        configShip: action.payload
      };
    case GET_CONFIG_JOB:
      return {
        ...state,
        configJob: action.payload
      };
    case GET_CONFIG_ALLOWANCE:
      return {
        ...state,
        configAllowance: action.payload
      };
    case GET_PROVICE_LIST:
      action.payload.forEach((item) => {
        item.label = item.provinceName;
        item.cities.length && item.cities.forEach((cItem) => {
          cItem.label = cItem.cityName;
        });
      });
      return {
        ...state,
        proviceList: action.payload
      };
    case SET_PROVICE_PICK_ARR:
      return {
        ...state,
        provicePickArr: [[...state.proviceList], [...state.proviceList[action.payload].cities]]
      };
    case GET_QUESTIONNAIRE_LIST:
      return {
        ...state,
        questionnaireList: action.payload
      };
    case SET_SUB_INFO: {
      return {
        ...state,
        subInfo: action.payload
      };
    }
    case GET_INSURE_RECORD: {
      return {
        ...state,
        insureRecord: action.pageNum === 1 ? action.payload : state.insureRecord.concat(action.payload)
      };
    }
    case GET_INSURE_DETAIL: {
      return {
        ...state,
        insureDetail: action.payload
      };
    }
    case GET_MANAGE_LIST: {
      return {
        ...state,
        manageList: action.payload
      };
    }
    case GET_MANAGE_DETAIL: {
      return {
        ...state,
        manageDetail: action.payload
      };
    }
    case SET_INSURANCE_INFO: {
      return {
        ...state,
        insuranceInfo: Object.assign({}, state.insuranceInfo, action.payload)
      };
    }
    case ADD_PERSON: {
      state.insuranceInfo.insuredInfos.push(insuranceItem);
      // let insuredInfos = state.insuranceInfo.ins
      return {
        ...state,
        insuranceInfo: Object.assign({}, state.insuranceInfo)
      };
    }
    // 设置二级职业
    case SET_TWO_LEVEL_PROFESSION_LIST: {
      return {
        ...state,
        twoLevelProfessionList: action.payload
      };
    }
    case GET_INSURANCE_INFO: {
      return {
        ...state,
        insuranceDetail: action.payload
      };
    }
    case SET_PROSON_INSURANCE_INFO: {
      return Object.assign({}, { ...state }, {
        personInsuranceInfo: Object.assign({}, { ...state.personInsuranceInfo }, action.payload)
      });
    }
    case SET_QUESTION_LIST: {
      return {
        ...state,
        questionList: [...action.payload]
      };
    }
    default:
      return state;
  }
}
