import { GET_LIST, SAVE_POST_DATA } from '@constants/medicationReminder';

const INITIAL_STATE = {
  list: [],
  postData: {
    daysNumber: 0,
    medicationDetailList: [{
      dosageUnit: '',
      medicationFrequency: '',
      medicineName: '',
      singleAmount: ''
    }],
    startDate: 0,
    reminderTime: [''],
    foodName: ''
  }
};

export default function medicationReminder (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        list: action.payload
      };
    case SAVE_POST_DATA: {
      return {
        ...state,
        postData: Object.assign({}, action.payload)
      };
    }
    default:
      return state;
  }
}
