export default {
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/user/index/index',
    'pages/login/index',
    'pages/h5/login/index',
    'pages/register/index',
    'pages/protocal/log/index',
    'pages/protocal/index',
    'pages/protocal/all/index',
    'pages/user/service/exchange/index',
    'pages/user/service/record/index',
    'pages/user/service/list/index',
    'pages/user/service/outofservice/index',
    'pages/user/appointment/record/index',
    'pages/user/appointment/report/index',
    'pages/user/appointment/detail/index',
    'pages/user/setting/index/index',
    'pages/mall/index/index',
    'pages/mall/detail/index',
    'pages/mall/records/index',
    'pages/webview/index',
    'Healthy/pages/index',
    'Healthy/pages/portrait/index',
    'Healthy/pages/portraitDetail/index',
    'Healthy/pages/searchFood/index',
    'Healthy/pages/foodLibrary/index',
    'Healthy/pages/foodResult/index',
    'Healthy/pages/diabetesSymptom/index',
    'Healthy/pages/PrescriptionUpload/index',
    'IM/pages/index',
    'Healthy/pages/userInfo/index',
    'Healthy/pages/family/index',
    'Healthy/pages/relatedFamily/index',
    'Healthy/pages/menstruation/index'
  ],
  requiredPrivateInfos: ['getLocation'],
  subPackages: [
    {
      root: 'healthManage/',
      name: 'healthManage',
      pages: [
        'index/index',
        'healthDetail/index',
        'myPlan/index',
        'recommend/index',
        'score/index'
      ]
    },
    {
      root: 'MinApp/',
      name: 'minApp',
      pages: [
        'pages/index/index',
        'pages/detail/index',
        'pages/article/index',
        'pages/drug/index/index',
        'pages/drug/detail/index',
        'pages/drug/order/index',
        'pages/drug/orderDetail/index',
        'pages/drug/success/index',
        'pages/drug/info/index',
        'pages/drug/detailList/index'
      ]
    },
    {
      root: 'Insurance/',
      name: 'insurance',
      pages: [
        'pages/detail/index',
        'pages/create/index',
        'pages/healthQuestion/index',
        'pages/inform/index',
        'pages/record/index',
        'pages/manage/index',
        'pages/details/index',
        'pages/product/index',
        'pages/notify/index',
        'pages/previewPdf/index',
        'pages/introduce/index',
        'pages/planDetail/index',
        'pages/group/create/index',
        'pages/group/detail/index',
        'pages/profession/index',
        'pages/selectProfession/index'
      ]
    },

    {
      root: 'Inquire/',
      name: 'inquire',
      pages: [
        'pages/im/index',
        'pages/index/index',
        'pages/detail/index',
        'pages/diagnose/index',
        'pages/search/index',
        'pages/phoneIndex/index',
        'pages/phone/index',
        'pages/phoneResult/index'
      ]
    },
    {
      root: 'PointsMall/',
      name: 'pointsMall',
      pages: ['pages/lottery/index', 'pages/task/index']
    },
    {
      root: 'Claim/',
      name: 'claim',
      pages: ['pages/reject/index', 'pages/review/index']
    },

    {
      root: 'ClaimsSettle/',
      name: 'claimsSettle',
      pages: [
        'pages/stepOne/index',
        'pages/stepThree/index',
        'pages/examine/index',
        'pages/examineSuccess/index',
        'pages/step/index',
        'pages/word/index',
        'pages/proto/index',
        'pages/process/index',
        'pages/MaterialInfo/index',
        'pages/MoreInfo/index'
      ]
    },
    {
      root: 'MedicationReminder/',
      name: 'medicationReminder',
      pages: [
        'pages/index/index',
        'pages/plan/index',
        'pages/addPlan/index',
        'pages/searchDrug/index',
        'pages/planDetail/index',
        'pages/editPlan/index'
      ]
    },
    {
      root: 'ServicesItems/',
      name: 'servicesItems',
      pages: [
        'pages/glasses/index',
        'pages/glasses/detail/index',
        'pages/mouth/index',
        'pages/seconds/index',
        'pages/seconds/report/index',
        'pages/seconds/record/index',
        'pages/seconds/useConsultation/index',
        'pages/physical/index/index',
        'pages/physical/upload/index',
        'pages/physical/supplement/index',
        'pages/physical/detail/index'
      ]
    },
    {
      root: 'yjy/',
      name: 'yjy',
      pages: ['index/index']
    },
    {
      root: 'service/',
      name: 'service',
      pages: [
        'appointment/newCommon/index',
        'questionnaire/index',
        'appointment/commodityExchange/index',
        'result/supplier/index',
        'result/disease/index',
        'result/commodityExchange/index',
        'detail/index/index',
        'detail/network/index',
        'evaluate/index/index',
        'evaluate/detail/index',
        'record/online/index',
        'record/commodityExchange/index'
      ]
    },
    {
      root: 'article/',
      name: 'article',
      pages: ['index/index', 'detail/index']
    },
    {
      root: 'account/',
      name: 'account',
      pages: ['appeal/index', 'upload/index', 'update/index']
    },
    {
      root: 'setting/',
      name: 'setting',
      pages: [
        'info/index',
        'editPhone/index',
        'editInfo/index',
        'inputInfo/index',
        'workInfo/index',
        'message/index',
        'addressManage/list/index',
        'addressManage/detail/index',
        'auditRecords/index',
        'serviceCode/index',
        'leavingMessage/index',
        'leavingMessage/addMessage/index',
        'accountSecurity/index'
      ]
    },
    {
      root: 'StoreManage',
      name: 'StoreManage',
      pages: [
        'IDCode/index',
        'WriteOffCode/index',
        'StoreDrugClaimInfo/index',
        'StoreMapList/index',
        'ClaimSuccess/index'
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    backgroundColor: '#F6F6F6',
    navigationBarTitleText: '寰宇关爱',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999990',
    selectedColor: '#E94C40',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/user/index/index',
        text: '首页',
        iconPath: './assets/index.png',
        selectedIconPath: './assets/index_active.png'
      },
      {
        pagePath: 'pages/mall/index/index',
        text: '星矿',
        iconPath: './assets/mall.png',
        selectedIconPath: './assets/mall_active.png'
      },
      {
        pagePath: 'Healthy/pages/index',
        text: '健康档案',
        iconPath: './assets/health_manage.png',
        selectedIconPath: './assets/health_manage_active.png'
      },
      {
        pagePath: 'pages/user/setting/index/index',
        text: '我的',
        iconPath: './assets/user_icon.png',
        selectedIconPath: './assets/user_icon_active.png'
      }
    ]
  }
};
