import {
  GET_FORM,
  SET_CONFIG,
  SET_SIGN_URL,
  UNION_HEALTH_INFO,
  SAVE_SIGN_URL,
  SET_OLD_LIST,
  SET_LIST,
  SET_FORM,
  DELETE_IMG,
  ADD_IMG,
  CHANGE_TYPE,
  ADD_ITEM,
  DELETE_ITEM,
  CHANGE_FORM,
  CONCAT_MATERIALS,
  INIT_FORM
} from '../constants/claimsSettle';

const INITIAL_STATE = {
  config: {},
  drugList: [
    {
      num: '', // 数量
      specifications: '', // 规格：仅适用于药品
      typeName: '药品', // 类型名称
      unitPrice: '', // 单价
      name: '',
      isChecked: '药品',
      key: Number(
        Math.random()
          .toString()
          .substr(3, 5) + Date.now()
      ).toString(36)
    }
  ],
  testList: [
    {
      num: '', // 数量
      typeName: '检验/检查', // 类型名称
      unitPrice: '', // 单价
      name: '',
      isChecked: '检验/检查',
      key: Number(
        Math.random()
          .toString()
          .substr(3, 5) + Date.now()
      ).toString(36)
    }
  ],
  form: {
    settlementDetailsList: [
      {
        num: '', // 数量
        specifications: '', // 规格：仅适用于药品
        typeName: '', // 类型名称
        unitPrice: '', // 单价
        isChecked: '药品',
        name: '',
        key: Number(
          Math.random()
            .toString()
            .substr(3, 5) + Date.now()
        ).toString(36)
      }
    ],
    hospitalTreatmentInfo: {
      diseaseNameList: [], // 疾病
      insuredIdCard: '',
      patientName: '', // 就诊人姓名
      treatmentDepartment: '', // 就诊科室名称
      treatmentHospital: '', // 就诊医院名称
      treatmentTime: null, // 就诊时间
      userPaid: '' // 自费金额
    },
    userBaseInfo: {
      insuredEmail: '',
      insuredMobile: '',
      insuredName: '',
      insuredIdCard: ''
    },
    insuranceProductId: '',
    insuranceRightsId: '',
    materialList: [] as any,
    healthInfo: {
      allergyHistory: '',
      drugAllergy: '',
      medicines: ''
    }
  },
  signUrl: '',
  saveSignUrl: []
};

export default function claimsSettle (state = INITIAL_STATE, action) {
  let form = state.form;
  let { drugList, testList } = state;
  const { materialList, settlementDetailsList } = form;
  switch (action.type) {
    case SET_CONFIG: {
      const obj = {};
      action.payload &&
        action.payload.length &&
        action.payload.forEach(item => {
          obj[item.typeCode] = {
            codeLists: item.codeLists
          };
        });
      return {
        ...state,
        config: obj
      };
    }

    case GET_FORM:
      form = action.payload;
      return Object.assign({}, { ...state }, { form });
    case SET_FORM:
      return Object.assign({}, state, {
        form: Object.assign({}, state.form, action.payload)
      });
    case DELETE_IMG:
      materialList[action.payload.parent].files.splice(action.payload.child, 1);
      return Object.assign({}, { ...state }, { form });
    case ADD_IMG:
      materialList[action.payload.index].files.push(action.payload.data);
      return Object.assign({}, { ...state }, { form });
    case CHANGE_TYPE: {
      let i: string;
      for (i in settlementDetailsList) {
        if (action.payload.index === i) {
          settlementDetailsList[i].isChecked = action.payload.isChecked;
          settlementDetailsList[i].num = '';
          settlementDetailsList[i].specifications = '';
          settlementDetailsList[i].typeName = '';
          settlementDetailsList[i].unitPrice = '';
          settlementDetailsList[i].name = '';
        }
      }
      return {
        ...state,
        form: form
      }; }
    case SET_OLD_LIST: {
      const oldDrugList = [] as any;
      const oldTestList = [] as any;
      action.payload.forEach(item => {
        if (item.typeName === '药品') {
          oldDrugList.push({
            ...item,
            isChecked: '药品',
            key: Number(
              Math.random()
                .toString()
                .substr(3, 5) + Date.now()
            ).toString(36)
          });
        }
        if (item.typeName === '检验/检查') {
          oldTestList.push({
            ...item,
            isChecked: '检验/检查',
            key: Number(
              Math.random()
                .toString()
                .substr(3, 5) + Date.now()
            ).toString(36)
          });
        }
      });
      return {
        ...state,
        drugList: oldDrugList,
        testList: oldTestList
      };
    }
    case ADD_ITEM:
      if (action.mold === '1') {
        drugList.push({
          num: '', // 数量
          specifications: '', // 规格：仅适用于药品
          typeName: '药品', // 类型名称
          unitPrice: '', // 单价
          name: '',
          isChecked: '药品',
          key: Number(
            Math.random()
              .toString()
              .substr(3, 5) + Date.now()
          ).toString(36)
        });
      }
      if (action.mold === '2') {
        testList.push({
          num: '', // 数量
          typeName: '检验/检查', // 类型名称
          unitPrice: '', // 单价
          name: '',
          isChecked: '检验/检查',
          key: Number(
            Math.random()
              .toString()
              .substr(3, 5) + Date.now()
          ).toString(36)
        });
      }
      // settlementDetailsList.push({
      //     num: "",//数量
      //     specifications: "",//规格：仅适用于药品
      //     typeName: "",//类型名称
      //     unitPrice: "",//单价
      //     isChecked:'药品',
      //     name:'',
      // })
      return {
        ...state,
        drugList,
        testList
      };
    case DELETE_ITEM: {
      let list = [] as any;
      if (action.mold === 1) {
        list = drugList;
      } else {
        list = testList;
      }
      const newArr = list.filter(item => item.key !== action.payload);
      action.mold === 1 && (drugList = newArr);
      action.mold === 2 && (testList = newArr);
      // form.settlementDetailsList = newArr
      return Object.assign({}, { ...state }, { drugList, testList });
    }
    case CHANGE_FORM:
      if (action.payload.name === 'treatmentTime') {
        form.hospitalTreatmentInfo.treatmentTime = action.payload.value;
      } else if (action.payload.name === 'insuredMobile') {
        form.userBaseInfo.insuredMobile = action.payload.value;
      } else if (action.payload.name === 'insuredEmail') {
        form.userBaseInfo.insuredEmail = action.payload.value;
      } else if (action.payload.name === 'userPaid') {
        form.hospitalTreatmentInfo.userPaid = action.payload.value;
      } else if (action.payload.name === 'treatmentHospital') {
        form.hospitalTreatmentInfo.treatmentHospital = action.payload.value;
      } else if (action.payload.name === 'treatmentDepartment') {
        form.hospitalTreatmentInfo.treatmentDepartment = action.payload.value;
      } else if (action.payload.name === 'diseaseNameList') {
        form.hospitalTreatmentInfo.diseaseNameList = action.payload.value;
      } else if (action.payload.name === 'patientName') {
        form.hospitalTreatmentInfo.patientName = action.payload.value;
      } else if (action.payload.name === 'insuredName') {
        form.userBaseInfo.insuredName = action.payload.value;
      } else if (action.payload.name === 'insuredIdCard') {
        form.userBaseInfo.insuredIdCard = action.payload.value;
        form.hospitalTreatmentInfo.insuredIdCard = action.payload.value;
      } else if (action.payload.name === 'diseaseNameList') {
        form.hospitalTreatmentInfo.diseaseNameList = [];
        form.hospitalTreatmentInfo.diseaseNameList = action.payload.value;
      }
      return Object.assign({}, { ...state }, { form });
    case UNION_HEALTH_INFO: {
      const healthInfo = Object.assign(
        {},
        state.form.healthInfo,
        action.payload
      );
      form = Object.assign({}, state.form, { healthInfo });
      return Object.assign({}, { ...state }, { form });
    }
    case CONCAT_MATERIALS:
      if (form.materialList.length) {
        action.payload.forEach(item => {
          form.materialList.forEach(mItem => {
            item.materialId === mItem.materialId && (item.files = mItem.files);
          });
        });
      }
      form.materialList = action.payload;
      return Object.assign({}, { ...state }, { form });
    case INIT_FORM:
      form = {
        settlementDetailsList: [
          {
            num: '', // 数量
            specifications: '', // 规格：仅适用于药品
            typeName: '', // 类型名称
            unitPrice: '', // 单价
            isChecked: '药品',
            name: '',
            key: Number(
              Math.random()
                .toString()
                .substr(3, 5) + Date.now()
            ).toString(36)
          }
        ],
        hospitalTreatmentInfo: {
          diseaseNameList: [], // 疾病
          insuredIdCard: '',
          patientName: '', // 就诊人姓名
          treatmentDepartment: '', // 就诊科室名称
          treatmentHospital: '', // 就诊医院名称
          treatmentTime: null, // 就诊时间
          userPaid: '' // 自费金额
        },
        userBaseInfo: {
          insuredEmail: '',
          insuredMobile: '',
          insuredName: '',
          insuredIdCard: ''
        },
        insuranceProductId: '',
        insuranceRightsId: '',
        materialList: [],
        healthInfo: {
          allergyHistory: '',
          drugAllergy: '',
          medicines: ''
        }
      };
      return Object.assign({}, { ...state }, { form });
    case SET_LIST: {
      let list = [] as any;
      if (action.mold === 1) {
        list = drugList;
      } else {
        list = testList;
      }
      list[action.index] = Object.assign(
        {},
        list[action.index],
        action.payload
      );
      action.mold === 1 && (drugList = list);
      action.mold === 2 && (testList = list);
      return Object.assign({}, { ...state }, { drugList, testList });
    }
    case SET_SIGN_URL:
      return {
        ...state,
        signUrl: action.payload
      };
    case SAVE_SIGN_URL:
      return {
        ...state,
        saveSignUrl: action.payload
      };
    default:
      return state;
  }
}
