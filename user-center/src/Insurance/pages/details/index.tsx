import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import Page from '@components/page';
import {
  getDiseaseInfo,
  getMinIntervalDay,
  getValidDate
} from '@actions/common';
import { addCouponCode, disabetsJump, getYjyUrl, getServiceInfo, getThirdToken } from '@actions/service';
import { connect } from 'react-redux';
import utils from '@utils/index';
import {
  getManageDetail,
  valueAddedServiceList,
  getClaimRecord
} from '@actions/insurance';
import { GET_MANAGE_DETAIL } from '@constants/insurance';
import { IStoreProps } from '@reducers/interface';
import { SET_MODAL } from '@constants/common';
import { onlyCheckManualLaborState } from '@actions/inquire';
import ProvinceCitySite from '@components/ProvinceCitySite';
import './index.scss';

interface IProps {
  getDetail: Function;
  setModal: Function;
  insurance: any;
}
interface IState {
  tab: number;
  claimRecordList: Array<any>;
  incrementService: Array<any>;
  myClaim: Array<any>;
  showProvince: boolean;
  serviceRecordId:string;
}
type PropsType = IStoreProps & IProps;
const statusMap = {
  1: i18n.chain.insurance.underGuarantee,
  2: i18n.chain.user.expired,
  3: i18n.chain.serviceComponent.notEffective,
  4: i18n.chain.insurance.cancelled
};
const stateMap = {
  0: i18n.chain.serviceComponent.useNow,
  1: i18n.chain.myServicePage.used,
  2: i18n.chain.user.expired,
  3: i18n.chain.insurance.deleted,
  4: i18n.chain.insurance.cancelled
};

@connect(
  state => state,
  dispatch => ({
    getDetail (params) {
      getManageDetail(params).then(res => {
        dispatch({
          type: GET_MANAGE_DETAIL,
          payload: res
        });
      });
    },
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class Details extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      tab: 0,
      claimRecordList: [],
      incrementService: [],
      myClaim: [],
      showProvince: false,
      serviceRecordId: ''
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.insurance.policyDetails });
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    this.props.getDetail({
      insuranceType: router?.params && router.params.insuranceType,
      policyNo: router?.params && router.params.policyNo
    });
    valueAddedServiceList({
      pageNum: 1,
      pageSize: 999,
      type: 0,
      policyNo: router?.params && router.params.policyNo
    }).then((res: any) => {
      this.setState({
        incrementService: res.records
      });
    });
    valueAddedServiceList({
      pageNum: 1,
      pageSize: 999,
      type: 1,
      policyNo: router?.params && router.params.policyNo
    }).then((res: any) => {
      this.setState({
        myClaim: res.records
      });
    });
    getClaimRecord({
      pageNum: 1,
      pageSize: 999,
      policyNo: router?.params && router.params.policyNo
    }).then((res: any) => {
      this.setState({
        claimRecordList: res.records
      });
    });
  }

  // 去使用
  goUse (item) {
    const {
      state,
      serviceRecordId,
      serviceInfoId,
      secondTreatmentCheckState,
      needCheck,
      insuranceProductId,
      itemName,
      pageCode,
      itemDesc,
      useTime,
      endTime,
      needAuth,
      claimType,
      insurancePlanId,
      code,
      sourceType,
      recomendId,
      claimRecordId
    } = item;
    if (claimType === 2) {
      if (item.insuranceRightVO.review) {
        if (item.insuranceRightVO.protocolType) {
          Taro.navigateTo({
            url: `/ClaimsSettle/pages/process/index?rightsId=${item.insuranceRightVO.rightsId}&insuranceProductId=${insuranceProductId}&insurancePlanId=${insurancePlanId}&policyNo=${code}`
          });
          return;
        }
        // 保障计划理赔
        Taro.navigateTo({
          url: `/ClaimsSettle/pages/step/index?rightsId=${item.insuranceRightVO.rightsId}&insuranceProductId=${insuranceProductId}&insurancePlanId=${insurancePlanId}&policyNo=${code}&claimType=2`
        });
        return;
      } else {
        Taro.showToast({
          title: '该理赔无需提交资料，请联系保司直接理赔',
          icon: 'none'
        });
        return;
      }
    }

    const type = utils.appConfig.codeMap[pageCode];
    if (sourceType === 6) {
      getServiceInfo(recomendId).then((res:any) => {
        const type = utils.appConfig.codeMap[res.pageCode];
        if (res.state === 0) {
          this.goUrl(res.needAuth, res.needCheck, type, res.serviceInfoId, res.serviceRecordId, res.itemName, res.pageCode, res.itemDesc, res.secondTreatmentCheckState, res.usetime, res.endTime);
        }
      }).catch(() => {

      });
    }
    if (state === 0 && useTime >= new Date().getTime()) {
      return;
    }
    if (state === 0 && needCheck && needCheck !== 1 && needCheck !== 4) {
      let url = '';
      if (needCheck === 2) {
        Taro.navigateTo({
          url: `/ClaimsSettle/pages/process/index?serviceRecordId=${serviceRecordId}&itemName=${itemName}&insuranceProductId=${insuranceProductId}&serviceInfoId=${serviceInfoId}`
        });
        return;
      }

      if (needCheck === 6) {
        getValidDate({
          serviceRecordId
        }).then(res => {
          this.props.setModal({
            show: true,
            title: '提示',
            content: `您的服务理赔通过后，超过${res}天仍未使用，现已过期，请重新发起理赔申请。`,
            clickConfirm: () => {
              Taro.navigateTo({
                url: `/ClaimsSettle/pages/step/index?serviceRecordId=${serviceRecordId}&again=1`
              });
            }
          });
        });

        return;
      }

      if (needCheck === 7) {
        getMinIntervalDay({ serviceRecordId }).then(res => {
          this.props.setModal({
            show: true,
            title: '提示',
            content: `您已提交过申请，请在${res}天后再次提交，感谢使用！`
          });
        });

        return;
      }

      needCheck === 3 && (url = `/ClaimsSettle/pages/examine/index?state=1&claimRecordId=${claimRecordId}`);
      needCheck === 5 &&
        (url = `/Claim/pages/reject/index?serviceRecordId=${serviceRecordId}&policyNo=${code}`);
      Taro.navigateTo({
        url
      });
      return;
    }
    if (type === 20) {
      Taro.navigateTo({
        url:
          '/pages/webview/index?url=https://m.yaofangwang.com/&fuid=181&fsid=&m=5935'
      });
    }
    if (type === 22) {
      this.getDisabets(serviceRecordId);
    }
    if (type === 25 || type === 28) {
      if (state === 0) {
        getYjyUrl(serviceRecordId).then((res: any) => {
          if (process.env.TARO_ENV === 'h5') {
            window.location.href = `${res.url}?code=${res.code}&data=${res.answerText}`;
          } else {
            Taro.navigateTo({
              url: `/pages/webview/index?url=${res.url}&code=${res.code}&data=${res.answerText}`
            });
          }
        });
      } else {
        Taro.navigateTo({
          url: `/pages/yjy/index?serviceRecordId=${serviceRecordId}`
        });
      }
    }
    if (state === 0) {
      this.goUrl(needAuth, needCheck, type, serviceInfoId, serviceRecordId, itemName, pageCode, itemDesc, secondTreatmentCheckState, useTime, endTime);
    }
  }

  goUrl (needAuth, needCheck, type, serviceInfoId, serviceRecordId, itemName, pageCode, itemDesc, secondTreatmentCheckState, useTime,
    endTime) {
    const { xAccessToken, userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo);
    const token = Taro.getStorageSync(xAccessToken);
    const { hasIdCard } = user;
    if (needAuth && !hasIdCard) {
      Taro.showModal({
        title: '',
        content: '使用该服务需先认证个人信息哦！',
        cancelText: '稍后认证',
        confirmText: '立即认证',
        cancelColor: '#9D9FA2',
        confirmColor: '#FE9A51',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/register/index?back=true'
            });
          } else {
          // do something
          }
        }
      });
      return;
    }
    // const serviceInfoIdList = [
    //   'ff808081737b57b501737b7243b5009e',
    //   '2c91808b7724db6f0177293074610022',
    //   '2c91808b77f2b4600177f5d0c53b004b',
    //   'ff808081737bbf250173948a352501ea',
    //   'ff80808175e59d5c0175f92ef2c20296',
    //   '2c90819377be41100177c790c82b00a9',
    //   '2c90819377eb6e130177ebb7787a05cf',
    //   '2c90819377eb6e130177ebbaa46205eb'
    // ];
    // if (serviceInfoIdList.includes(serviceInfoId)) {
    //   Taro.navigateTo({
    //     url: `/pages/webview/index?url=${
    //     utils.appConfig.SERVICE_URL
    //   }zh/appointment&token=${token}&id=${serviceRecordId}&name=${itemName}&serviceInfoId=${serviceInfoId}&time=${new Date().getTime()}&pageCode=${pageCode}`
    //   });
    //   return;
    // }
    // 在线券码
    if (type === 8) {
      this.props.setModal({
        show: true,
        content: `确认使用“${itemName}”？`,
        clickConfirm: () => {
          addCouponCode({
            serviceRecordId
          }).then(res => {
            Taro.navigateTo({
              url: `/pages/user/appointment/detail/index?recordId=${res}`
            });
          });
        }
      });
      return;
    }
    let url = '';
    if (type === 11 && needCheck === 4) {
      Taro.navigateTo({
        url: `/ClaimsSettle/pages/examineSuccess/index?state=2&serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    if (type === 11) {
      Taro.navigateTo({
        url: `/MinApp/pages/drug/detailList/index?serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    // 预约类型
    (type === 6 || type === 7 || type === 15 || type === 26 || type === 27) &&
    (url = `/service/appointment/newCommon/index?serviceRecordId=${serviceRecordId}&serviceInfoId=${serviceInfoId}`);
    // 建高
    type === 5 &&
    (url = `/pages/webview/index?url=${
      utils.appConfig.SERVICE_URL
    }healthyHeight/info&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}&time=${new Date().getTime()}`);
    type === 1 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newInfo&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type > 1 &&
    type < 5 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newStart&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 2 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newStart&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 9 &&
    (url = `/service/appointment/commodityExchange/index?serviceRecordId=${serviceRecordId}&itemName=${itemName}&itemDesc=${itemDesc}&useTime=${useTime}&endTime=${endTime}`);
    type === 10 &&
    (url = `/MinApp/pages/index/index?serviceRecordId=${serviceRecordId}`);
    type === 12 &&
    (url = `/Inquire/pages/index/index?serviceRecordId=${serviceRecordId}&serviceType=1`);
    if (type === 13) {
      onlyCheckManualLaborState({
        serviceRecordId
      }).then((res: any) => {
        // eslint-disable-next-line no-shadow
        const { queueState, serviceRecordId } = res;
        if (queueState !== 2) {
          Taro.showToast({
            title: '当前医生正忙，请稍后再试!',
            icon: 'none'
          });
          return;
        }
        // vm.props.actions.setChatInfo(res)
        Taro.navigateTo({
          url: `/Inquire/pages/index/index?serviceRecordId=${serviceRecordId}&serviceType=2`
        });
      });
      return;
    }
    type === 14 &&
    (url = `/Inquire/pages/phoneIndex/index?serviceRecordId=${serviceRecordId}`);
    type === 16 &&
    (url = `/ServicesItems/pages/mouth/index?serviceRecordId=${serviceRecordId}`);
    if (type === 17) {
      let url = `/ServicesItems/pages/seconds/record/index?serviceRecordId=${serviceRecordId}`;
      secondTreatmentCheckState === 2 &&
        (url = `/ServicesItems/pages/seconds/index?serviceRecordId=${serviceRecordId}`);
      // needCheck === 5 && (url = `/ServicesItems/pages/seconds/record/index?serviceRecordId=${serviceRecordId}`)
      Taro.navigateTo({
        url
      });
      return;
    }

    type === 18 &&
    (url = `/ServicesItems/pages/glasses/index?serviceRecordId=${serviceRecordId}`);
    type === 19 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/laborDay/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 21 &&
    (url = `/ServicesItems/pages/physical/index/index?serviceRecordId=${serviceRecordId}`);
    type === 23 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/depressed/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 24 &&
    (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/anxious/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    // (type === 26 || type === 27) &&
    // (url = `/pages/webview/index?url=${
    //   utils.appConfig.SERVICE_URL
    // }zh/appointment&token=${token}&id=${serviceRecordId}&name=${itemName}&serviceInfoId=${serviceInfoId}&time=${new Date().getTime()}&pageCode=${pageCode}`);
    if (type === 30) {
      getThirdToken(6, 0).then((res:any) => {
        // if (process.env.TARO_ENV === 'h5') {
        //   window.location.href = `${res.url}`;
        // } else {
        Taro.navigateTo({
          url: `/pages/webview/index?url=${res.url}`
        });
        // }
      }).catch(() => {});
      return;
    }
    if (type === 34) {
      this.setState({
        serviceRecordId: serviceRecordId,
        showProvince: true
      });
      return;
    }
    if (type === 35) {
      getThirdToken(4, 0)
        .then((res: any) => {
          // if (process.env.TARO_ENV === 'h5') {
          //   window.location.href = `${res.url}`;
          // } else {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${res.url}`
          });
          // }
        })
        .catch(() => {});
      return;
    }
    if (url) {
      Taro.navigateTo({
        url
      });
    }
  }

  // 去详情
  goDetail (item) {
    const {
      serviceRecordId,
      state,
      pageCode,
      itemName,
      serviceInfoId,
      orderSerialNumber,
      ownInsuranceClaimListVO
    } = item;
    const type = utils.appConfig.codeMap[pageCode];

    if (ownInsuranceClaimListVO && ownInsuranceClaimListVO.state) {
      Taro.navigateTo({
        url: `/ClaimsSettle/pages/examine/index?state=${ownInsuranceClaimListVO.state}&policyNo=${ownInsuranceClaimListVO.policyNo}&failReason=${ownInsuranceClaimListVO.failReason}&insuranceProductId=${ownInsuranceClaimListVO.insuranceProductId}&insurancePlanId=${ownInsuranceClaimListVO.insurancePlanId}&rightsId=${ownInsuranceClaimListVO.rightsId}&claimType=2&claimRecordId=${item.claimRecordId}&claimNoticeState=${ownInsuranceClaimListVO.claimNoticeState}`
      });
      return;
    }
    if (state === 0) {
      this.goUse(item);
      return;
    } else if (state === 2) {
      Taro.showToast({
        title: '服务已过期',
        icon: 'none'
      });
      return;
    } else if (state === 3) {
      Taro.showToast({
        title: '服务已删除',
        icon: 'none'
      });
      return;
    } else if (state === 4) {
      Taro.showToast({
        title: '保单已撤单',
        icon: 'none'
      });
      return;
    }

    if (state === 2 && type < 5) {
      const url = `/service/detail/index/index?serviceInfoId=${serviceInfoId}`;
      Taro.navigateTo({
        url
      });
      return;
    }
    if (type === 17 && state === 1) {
      Taro.navigateTo({
        url: `/ServicesItems/pages/seconds/record/index?serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    if (type === 11 && state === 1) {
      Taro.navigateTo({
        url: `/MinApp/pages/drug/orderDetail/index?id=${orderSerialNumber}`
      });
      return;
    }
    if (state === 0) {
      let url = `/service/detail/index/index?serviceInfoId=${serviceInfoId}`;
      // 健康专栏直跳详情
      type === 10 &&
        (url = `/MinApp/pages/index/index?serviceRecordId=${serviceRecordId}`);
      if (type === 12 || type === 13 || type === 14) {
        return;
      }
      Taro.navigateTo({
        url
      });
    }
    // 已使用 查看详情
    if (state === 1) {
      if (type === 10) {
        return;
      }
      let url = '';
      (type === 8 || type === 9 || type === 18) &&
        (url = `/service/record/commodityExchange/index?serviceRecordId=${serviceRecordId}&title=${itemName}&type=${type}`);
      (type < 6 || type === 19 || type === 23 || type === 24) &&
        (url = `/service/record/online/index?serviceRecordId=${serviceRecordId}&title=${itemName}`);
      (type === 6 || type === 7 || type === 15 || type === 34) &&
        (url = `/pages/user/appointment/record/index?serviceRecordId=${serviceRecordId}&title=${itemName}`);
      if (type >= 12 && type < 14) {
        getDiseaseInfo({
          serviceRecordId: serviceRecordId
        }).then((res: any) => {
          const { diseaseId } = res;
          diseaseId &&
            Taro.navigateTo({
              url: `/service/result/disease/index?serviceRecordId=${serviceRecordId}`
            });
          !diseaseId &&
            Taro.showToast({
              title: '您本次问诊无结果，无法查看详情',
              icon: 'none'
            });
        });
        return;
      }
      type === 14 &&
        (url = `/Inquire/pages/phoneResult/index?serviceRecordId=${serviceRecordId}`);

      type === 21 &&
        (url = `/ServicesItems/pages/physical/detail/index?serviceRecordId=${serviceRecordId}`);
      const { xAccessToken } = utils.appConfig;
      const token = Taro.getStorageSync(xAccessToken);
      (type === 26 || type === 27) &&
        (url = `/pages/webview/index?url=${
          utils.appConfig.SERVICE_URL
        }zh/detail&token=${token}&id=${serviceRecordId}&time=${new Date().getTime()}`);
      type === 31 &&
        (url = `/ClaimsSettle/pages/examine/index?state=2&serviceRecordId=${serviceRecordId}&claimRecordId=${item.claimRecordId}`);
      Taro.navigateTo({
        url
      });
    }
  }

  getDisabets = data => {
    const { xAccessToken, isWeapp } = utils.appConfig;
    const token = Taro.getStorageSync(xAccessToken);
    disabetsJump(data).then(res => {
      let url = '';
      if (isWeapp) {
        if (res) {
          url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}diabetes/bloodSugar&token=${token}&serviceRecordId=${data}`;
        } else {
          url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}diabetes/index&token=${token}&serviceRecordId=${data}`;
        }
      } else {
        if (res) {
          url = `${utils.appConfig.SERVICE_URL}diabetes/bloodSugar?token=${token}&serviceRecordId=${data}`;
        } else {
          url = `${utils.appConfig.SERVICE_URL}diabetes/index?token=${token}&serviceRecordId=${data}`;
        }
      }
      Taro.navigateTo({ url });
    });
  };

  getClaimState (state, soncendState) {
    if (soncendState) {
      if (state === 2 && soncendState === 2) {
        return i18n.getLocaleName() === 'zh' ? 'success' : 'success-en';
      } else if (state === 3 || soncendState === 3) {
        return i18n.getLocaleName() === 'zh' ? 'fail' : 'fail-en';
      } else {
        return i18n.getLocaleName() === 'zh' ? 'shenhe' : 'shenhe-en';
      }
    } else {
      if (state === 2) {
        return i18n.getLocaleName() === 'zh' ? 'success' : 'success-en';
      } else if (state === 3) {
        return i18n.getLocaleName() === 'zh' ? 'fail' : 'fail-en';
      } else {
        return i18n.getLocaleName() === 'zh' ? 'shenhe' : 'shenhe-en';
      }
    }
  }

  render () {
    const { tab, myClaim, incrementService, claimRecordList, showProvince, serviceRecordId } = this.state;

    const {
      insuranceProductName,
      guaranteePlan,
      price,
      policyNo,
      guaranteeResponsibilityList,
      insuranceCompanyName,
      effectiveDate,
      expiryDate,
      policyState,
      insureSex,
      insureAge,
      policyName,
      insuranceType,
      policyCompanyName,
      insuredName
    } = this.props.insurance.manageDetail || {};
    return (
      <Page showBack title={i18n.chain.insurance.policyDetails}>
        <View className='page-details'>
          <View className='page-title-tab'>
            <View
              className={`tab-item ${tab === 0 ? 'active' : ''}`}
              onClick={() => {
                this.setState({ tab: 0 });
              }}
            >
              {i18n.chain.insurance.policyInformation}
            </View>
            <View
              className={`tab-item ${tab === 1 ? 'active' : ''}`}
              onClick={() => {
                this.setState({ tab: 1 });
              }}
            >
              {i18n.chain.insurance.valueAddedServices}
            </View>
            <View
              className={`tab-item ${tab === 2 ? 'active' : ''}`}
              onClick={() => {
                this.setState({ tab: 2 });
              }}
            >
              {i18n.chain.insurance.myClaim}
            </View>
            <View
              className={`tab-item ${tab === 3 ? 'active' : ''}`}
              onClick={() => {
                this.setState({ tab: 3 });
              }}
            >
              {i18n.chain.insurance.claimRecord}
            </View>
          </View>
          {
            tab === 0
              ? (
            <View>
              <View className='line'></View>
              <View className='page-title'>
                {i18n.chain.insurance.insuranceProducts}:{insuranceProductName}
              </View>
              <View className='content'>
                {/* <View className='common-text flex'>
                                <View className='left'>保险产品</View>
                                <View className='right'>{insuranceProductName}</View>
                            </View> */}
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.guaranteeScheme}</View>
                  <View className='right'>{guaranteePlan || '-'}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.premium}</View>
                  <View className='right'>{price || '-'}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.myServicePage.policyNo}</View>
                  <View className='right'>{policyNo || '-'}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.insuranceCompany}</View>
                  <View className='right'>{insuranceCompanyName || '-'}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.policyEffectiveTime}</View>
                  <View className='right'>
                    {utils.timeFormat(effectiveDate, 'y.m.d')}-
                    {utils.timeFormat(expiryDate, 'y.m.d')}
                  </View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.policyStatus}</View>
                  <View className='right'>{statusMap[policyState]}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.nameOfInsured}</View>
                  <View className='right'>{insuredName || '-'}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.insuredGender}</View>
                  <View className='right'>{insureSex ? i18n.chain.appointment.male : i18n.chain.appointment.female}</View>
                </View>
                <View className='common-text flex'>
                  <View className='left'>{i18n.chain.insurance.ageOfInsured}</View>
                  <View className='right'>{insureAge || '-'}</View>
                </View>
                {insuranceType === 1
                  ? (
                  <View className='common-text flex'>
                    <View className='left'>{i18n.chain.insurance.nameOfApplicant}</View>
                    <View className='right'>{policyName || '-'}</View>
                  </View>
                    )
                  : (
                  <View className='common-text flex'>
                    <View className='left'>{i18n.chain.insurance.nameOfEnterprise}</View>
                    <View className='right'>{policyCompanyName || '-'}</View>
                  </View>
                    )}
              </View>
              <View className='line'></View>
              <View className='page-title flex'>{i18n.chain.insurance.guaranteeContent}</View>
              <View className='responsibility'>
                <View className='responsibility-title flex'>
                  <View className='responsibility-title-image'></View>
                  <Text>{i18n.chain.insurance.guaranteeResponsibility}</Text>
                </View>
                {guaranteeResponsibilityList &&
                  guaranteeResponsibilityList.length &&
                  guaranteeResponsibilityList.map(item => {
                    return (
                      <View
                        className='common-text flex'
                        key={item.responsibilityName}
                      >
                        <View className='left'>{item.responsibilityName}</View>
                        <View className='right'>{item.guaranteePrice}{i18n.chain.common.yuan}</View>
                      </View>
                    );
                  })}
              </View>
            </View>
                )
              : null}
          {tab === 1
            ? (
            <View className='responsibility'>
              <View className='service-list flex'>
                {incrementService && incrementService.length
                  ? incrementService.map(item => {
                    return (
                        <View
                          key={item.serviceRecordId * Math.random(2)}
                          className='service-item'
                        >
                          <View className='service-item-t'>
                            <View className='service-item-t-l'>
                              {item.useTime && utils.timeFormat(item.useTime, 'y.m.d')}-
                              {item.endTime && utils.timeFormat(item.endTime, 'y.m.d')}
                            </View>
                            <View className='service-item-t-r'>
                              {item.state === 1
                                ? (
                                <View className='service-item-t-r-count'>
                                {i18n.chain.insurance.surplus}0{i18n.chain.user.second}
                                </View>
                                  )
                                : (
                                <View className='service-item-t-r-count'>
                                  {i18n.chain.insurance.surplus}
                                  {item.useCount === -1 ? i18n.chain.insurance.infinite : item.useCount}
                                  {i18n.chain.user.second}
                                </View>
                                  )}
                            </View>
                          </View>
                          <View className='service-item-b'>
                            <View
                              className='service-item-b-l'
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item.itemName}
                            </View>
                            <View
                              className={`service-item-b-r ${
                                item.useCount === 0 || item.state !== 0
                                  ? 'disable'
                                  : ''
                              }`}
                              onClick={() => {
                                if (item.useCount === 0) {
                                  return;
                                }
                                this.goUse(item);
                              }}
                            >
                              {stateMap[item.state]}
                            </View>
                          </View>
                        </View>
                    );
                  })
                  : null}
                {incrementService && incrementService.length <= 0
                  ? (
                  <View className='audit-empty'>
                    <Text className='empty-text'>{i18n.chain.insurance.noServices}</Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}
          {tab === 2
            ? (
            <View className='responsibility'>
              <View className='service-list flex'>
                {myClaim && myClaim.length
                  ? myClaim.map((item, index) => {
                    return (
                        <View key={`claims_${index}_${item.insurancePlanId}`}>
                          {item.claimType === 1
                            ? (
                            <View className='service-item'>
                              <View className='service-item-t'>
                                <View className='service-item-t-l'>
                                  {utils.timeFormat(item.useTime, 'y.m.d')}-
                                  {utils.timeFormat(item.endTime, 'y.m.d')}
                                </View>
                                <View className='service-item-t-r'>
                                  {item.state === 1
                                    ? (
                                    <View className='service-item-t-r-count'>
                                      {i18n.chain.insurance.surplus}0{i18n.chain.user.second}
                                    </View>
                                      )
                                    : (
                                    <View className='service-item-t-r-count'>
                                      {i18n.chain.insurance.surplus }&nbsp;
                                      {item.useCount === -1
                                        ? i18n.chain.insurance.infinite
                                        : item.useCount}
                                        &nbsp;{ i18n.chain.user.second}
                                    </View>
                                      )}
                                </View>
                              </View>
                              <View className='service-item-b'>
                                <View
                                  className='service-item-b-l'
                                  style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {item.itemName}
                                </View>
                                <View
                                  className={`service-item-b-r ${
                                    item.useCount === 0 || item.state !== 0
                                      ? 'disable'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    if (item.useCount === 0) {
                                      return;
                                    }
                                    this.goUse(item);
                                  }}
                                >
                                  {stateMap[item.state]}
                                </View>
                              </View>
                            </View>
                              )
                            : (
                            <View className='service-item'>
                              <View className='claim-name'>
                                {item.insuranceRightVO.rightsName}
                              </View>
                              <View className='service-item-b'>
                                <View className='claim-money'>
                                  {i18n.chain.insurance.guaranteeAmount}:{item.insuranceRightVO.ensureAmount}
                                  {item.insuranceRightVO.priceUnit}
                                </View>
                                <View
                                  className={`service-item-b-r ${
                                    !item.insuranceRightVO.waitTimeFlay
                                      ? 'disable'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    if (!item.insuranceRightVO.waitTimeFlay) {
                                      return;
                                    }
                                    this.goUse(item);
                                  }}
                                >
                                  {i18n.chain.serviceComponent.useNow}
                                </View>
                              </View>
                            </View>
                              )}
                        </View>
                    );
                  })
                  : null}
                {myClaim && myClaim.length <= 0
                  ? (
                  <View className='audit-empty'>
                    <Text className='empty-text'>{i18n.chain.insurance.noClaim}</Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}
          {tab === 3
            ? (
            <View className='responsibility'>
              <View className='service-list flex'>
                {claimRecordList && claimRecordList.length
                  ? claimRecordList.map((item: any) => {
                    return item.claimType === 2
                      ? (
                        <View
                          key={item.createTime * Math.random(2)}
                          className={`service-item ${this.getClaimState(
                            item.ownInsuranceClaimListVO.state, null
                          )}`}
                        >
                          <View className='claim-name'>
                            {item.ownInsuranceClaimListVO.rightsName}
                          </View>
                          <View className='service-item-b'>
                            <View className='claim-num'>
                            {i18n.chain.insurance.claimNumber}:{item.ownInsuranceClaimListVO.serialNumber}
                            </View>
                            <View
                              className='claim-record-b-r'
                              onClick={() => {
                                this.goDetail(item);
                              }}
                            >
                              <Text> {i18n.chain.serviceComponent.viewDetails}</Text>
                              <View className='next-weight'></View>
                            </View>
                          </View>
                          {
                            item.ownInsuranceClaimListVO.state === 2 && <View className='claim-amount'>本次赔付金额：{item.ownInsuranceClaimListVO.claimAmount}
                            {item.ownInsuranceClaimListVO.priceUnit}</View>
                          }
                        </View>
                        )
                      : (
                        <View
                          className={`claim-record ${this.getClaimState(
                            item.claimState,
                            item.claimSecondState
                          )}`}
                          key={item.createTime * Math.random(2)}
                        >
                          <View
                            className='claim-record-t'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.itemName}
                          </View>
                          <View className='claim-record-b'>
                            <View className='claim-record-b-l'>
                              提交理赔时间：
                              {utils.timeFormat(item.useTime, 'y.m.d h:m:s')}
                            </View>
                            <View
                              className='claim-record-b-r'
                              onClick={() => {
                                this.goDetail(item);
                              }}
                            >
                              <Text> {i18n.chain.serviceComponent.viewDetails}</Text>
                              <View className='next-weight'></View>
                            </View>
                          </View>
                        </View>
                        );
                  })
                  : null}
                {claimRecordList && claimRecordList.length <= 0
                  ? (
                  <View className='audit-empty'>
                    <Text className='empty-text'>暂无理赔记录</Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}
            {showProvince
              ? (
              <ProvinceCitySite
                serviceRecordId={serviceRecordId}
                close={() => {
                  this.setState({
                    showProvince: false
                  });
                }}
              ></ProvinceCitySite>
                )
              : null}
        </View>
      </Page>
    );
  }
}
export default Details;
