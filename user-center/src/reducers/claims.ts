import {
  SET_INFORMATION,
  GET_CLAIM_SETTLEMENT,
  GET_CLAIM_DETAIL,
  GET_CLAIM_LIST
} from '../constants/claims';

const INITIAL_STATE = {
  information: {
    guaranteeResponsibility: undefined,
    mobile: '',
    bankName: '',
    bankCardNumber: '',
    validCode: '',
    medicalRecord: '',
    prescription: '',
    invoice: '',
    otherMaterials: ''
  },
  claimSettlementOptions: [],
  claimList: [],
  claimDetail: {}
};

export default function claims (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_INFORMATION:
      return Object.assign({}, state, { information: Object.assign({}, state.information, action.payload) });
    case GET_CLAIM_SETTLEMENT:
      return Object.assign({}, state, { claimSettlementOptions: action.payload });
    case GET_CLAIM_LIST:
      return {
        ...state,
        claimList: action.pageNum === 1 ? action.payload : state.claimList.concat(action.payload)
      };
    case GET_CLAIM_DETAIL:
      return {
        ...state,
        claimDetail: action.payload
      };
    default:
      return state;
  }
}
