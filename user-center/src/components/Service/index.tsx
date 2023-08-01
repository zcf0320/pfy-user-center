import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import {
  addCouponCode,
  disabetsJump,
  getYjyUrl,
  getServiceInfo,
  getThirdToken,
  getSerialNum
} from '@actions/service';
import {
  getDiseaseInfo,
  getMinIntervalDay,
  getValidDate
} from '@actions/common';
import { onlyCheckManualLaborState } from '@actions/inquire';
import { connect } from 'react-redux';
import { SET_CHAT_INFO } from '@constants/inquire';
import { SET_MODAL } from '@constants/common';
import ProvinceCitySite from '@components/ProvinceCitySite';
import i18n from '@i18n/index';
import './index.scss';

interface IProps {
  serviceDetail: any;
  actions: any;
  reducers: any;
  from: string;
}
interface IState {
  show: boolean;
  showProvince: boolean;
}
@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: state.inquire
      }
    );
  },
  dispatch => {
    return Object.assign(
      {},
      {
        actions: {
          setChatInfo (data) {
            dispatch({
              type: SET_CHAT_INFO,
              payload: data
            });
          },
          setModal (data) {
            dispatch({
              type: SET_MODAL,
              payload: data
            });
          }
        }
      }
    );
  }
)
class Service extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      show: false,
      showProvince: false
    };
  }

  getButtonName () {
    const { from } = this.props;
    const { useCount, state, useTime } = this.props.serviceDetail || {};
    let text = i18n.chain.serviceComponent.useNow;
    if (state === 0) {
      if (useTime >= new Date().getTime()) {
        text = i18n.chain.serviceComponent.notEffective;
      } else if (useCount) {
        text = `${i18n.chain.serviceComponent.useNow}${
          useCount !== 1 ? `x${useCount}` : ''
        }`;
        useCount === -1 && (text = i18n.chain.serviceComponent.unlimitedUse);
      }
    }
    state === 1 && (text = i18n.chain.serviceComponent.viewDetails);
    state === 2 && (text = i18n.chain.serviceComponent.invalid);
    state === 3 && (text = i18n.chain.serviceComponent.invalid);
    state === 4 && (text = i18n.chain.serviceComponent.invalid);
    from === 'questionnaireList' && (text = i18n.chain.serviceComponent.useNow);
    return text;
  }

  hide () {
    const { show } = this.state;
    this.setState({
      show: !show
    });
  }

  // 去使用
  goUse (e) {
    e.stopPropagation();
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
      sourceType,
      recomendId
    } = this.props.serviceDetail;
    const type = utils.appConfig.codeMap[pageCode];
    if (state === 0 && useTime >= new Date().getTime()) {
      return;
    }

    if (sourceType === 6) {
      getServiceInfo(recomendId)
        .then((res: any) => {
          const type = utils.appConfig.codeMap[res.pageCode];
          if (res.state === 0) {
            this.goUrl(
              res.needAuth,
              type,
              res.serviceInfoId,
              res.serviceRecordId,
              res.itemName,
              res.pageCode,
              res.secondTreatmentCheckState,
              res.itemDesc,
              res.usetime,
              res.endTime,
              res.needCheck,
              res.insuranceProductId
            );
          }
        })
        .catch(() => {});
    }
    if (state === 0) {
      this.goUrl(
        needAuth,
        type,
        serviceInfoId,
        serviceRecordId,
        itemName,
        pageCode,
        secondTreatmentCheckState,
        itemDesc,
        useTime,
        endTime,
        needCheck,
        insuranceProductId
      );
    }
    if (state === 1) {
      this.goDetail();
    }
  }

  goUrl (
    needAuth,
    type,
    serviceInfoId,
    serviceRecordId,
    itemName,
    pageCode,
    secondTreatmentCheckState,
    itemDesc,
    useTime,
    endTime,
    needCheck,
    insuranceProductId
  ) {
    const { xAccessToken, userInfo, isWeapp } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo);
    const token = Taro.getStorageSync(xAccessToken);
    const { hasIdCard } = user;
    if (needAuth && !hasIdCard) {
      Taro.showModal({
        title: '',
        content: i18n.chain.serviceComponent.needAuth,
        cancelText: i18n.chain.button.cancelAuth,
        confirmText: i18n.chain.button.submitAuth,
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
    if (needCheck && needCheck !== 1 && needCheck !== 4) {
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
          this.props.actions.setModal({
            show: true,
            title: i18n.chain.common.tips,
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
          this.props.actions.setModal({
            show: true,
            title: i18n.chain.common.tips,
            content: `您已提交过申请，请在${res}天后再次提交，感谢使用！`
          });
        });
        return;
      }

      needCheck === 3 && (url = '/Claim/pages/review/index');
      needCheck === 5 &&
        (url = `/Claim/pages/reject/index?serviceRecordId=${serviceRecordId}`);
      Taro.navigateTo({
        url
      });
      return;
    }

    // 在线券码
    if (type === 8) {
      this.props.actions.setModal({
        show: true,
        content: `${i18n.chain.serviceComponent.confirmUse}“${itemName}”？`,
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
    if (type === 11 && needCheck === 4) {
      Taro.navigateTo({
        url: `/ClaimsSettle/pages/examineSuccess/index?state=2&serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    let url = '';
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
    type === 11 &&
      (url = `/MinApp/pages/drug/detailList/index?serviceRecordId=${serviceRecordId}`);
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
            title: i18n.chain.serviceComponent.doctorBusy,
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
      url = `/ServicesItems/pages/seconds/record/index?serviceRecordId=${serviceRecordId}`;
      secondTreatmentCheckState === 2 &&
        (url = `/ServicesItems/pages/seconds/index?serviceRecordId=${serviceRecordId}`);
    }
    type === 18 &&
      (url = `/ServicesItems/pages/glasses/index?serviceRecordId=${serviceRecordId}`);
    type === 19 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/laborDay/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 20 &&
      (url =
        '/pages/webview/index?url=https://m.yaofangwang.com/&fuid=181&fsid=&m=5935');
    type === 21 &&
      (url = `/ServicesItems/pages/physical/index/index?serviceRecordId=${serviceRecordId}`);
    if (type === 22) {
      this.getDiabetes(serviceRecordId);
      return;
    }
    type === 23 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/depressed/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 24 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/anxious/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    type === 31 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}dementia/index&token=${token}&serviceRecordId=${serviceRecordId}`);

    if (type === 25 || type === 28) {
      getYjyUrl(serviceRecordId).then((res: any) => {
        if (isWeapp) {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${res.url}&code=${res.code}&data=${res.answerText}&title=医加壹服务`
          });
        } else {
          window.location.href = `${res.url}?code=${res.code}&data=${res.answerText}`;
        }
      });
    }
    if (type === 30) {
      getThirdToken(6, 0)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=肤质测试`
          });
        })
        .catch(() => {});
      return;
    }
    if (type === 32) {
      getSerialNum(serviceInfoId)
        .then((res: any) => {
          Taro.navigateTo({
            url: `/pages/webview/index?url=https://huanyu.dada360.com/huanyu_jump.jsp&mobile=${user.mobile}&serialNumber=${res}&serviceRecordId=${serviceRecordId}`
          });
        })
        .catch(() => {});
      return;
    }
    type === 33 && (url = '/pages/user/service/outofservice/index');
    if (type === 34) {
      this.setState({
        showProvince: true
      });
      return;
    }
    if (type === 35) {
      getThirdToken(4, 0)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=睡眠管理`
          });
        })
        .catch(() => {});
      return;
    }
    if (type === 36) {
      getThirdToken(9, 0)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=甲状腺管理`
          });
        })
        .catch(() => {});
      return;
    }
    type === 37 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/hpv/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    if (url) {
      Taro.navigateTo({
        url
      });
    }
  }

  goServiceDetail () {
    const { serviceInfoId } = this.props.serviceDetail;
    Taro.navigateTo({
      url: `/service/detail/index/index?serviceInfoId=${serviceInfoId}`
    });
  }

  // 去详情
  goDetail () {
    const { userInfo, isWeapp } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo);
    const {
      serviceRecordId,
      state,
      pageCode,
      itemName,
      serviceInfoId,
      orderSerialNumber,
      orderId
    } = this.props.serviceDetail;
    const type = utils.appConfig.codeMap[pageCode];
    if (state === 2 && type < 5) {
      const url = `/service/detail/index/index?serviceInfoId=${serviceInfoId}`;
      Taro.navigateTo({
        url
      });
      return;
    }
    if (type === 17) {
      Taro.navigateTo({
        url: `/ServicesItems/pages/seconds/record/index?serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    if (type === 11) {
      Taro.navigateTo({
        url: `/MinApp/pages/drug/orderDetail/index?id=${orderSerialNumber}`
      });
      return;
    }

    if (type === 10) {
      return;
    }
    let url = '';
    (type === 8 || type === 9 || type === 18) &&
      (url = `/service/record/commodityExchange/index?serviceRecordId=${serviceRecordId}&title=${itemName}&type=${type}`);
    (type < 6 || type === 19 || type === 23 || type === 24) &&
      (url = `/service/record/online/index?serviceRecordId=${serviceRecordId}&title=${itemName}`);
    (type === 6 || type === 7 || type === 15 || type === 34 || type === 27) &&
      (url = `/pages/user/appointment/record/index?serviceRecordId=${serviceRecordId}&title=${itemName}`);
    type === 11 && (url = `/MinApp/pages/drug/orderDetail/index?id=${orderId}`);

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
            title: i18n.chain.serviceComponent.noAIResult,
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

    type === 26 &&
      (url = `/pages/webview/index?url=${
        utils.appConfig.SERVICE_URL
      }zh/detail&token=${token}&id=${serviceRecordId}&time=${new Date().getTime()}`);
    if (type === 25 || type === 28) {
      if (type === 28) {
        getYjyUrl(serviceRecordId).then((res: any) => {
          if (isWeapp) {
            Taro.navigateTo({
              url: `/pages/webview/index?url=${res.url}&code=${res.code}&data=${res.answerText}`
            });
          } else {
            window.location.href = `${res.url}?code=${res.code}&data=${res.answerText}`;
          }
        });
      } else {
        Taro.navigateTo({
          url: `/pages/yjy/index?serviceRecordId=${serviceRecordId}`
        });
      }
    }
    if (type === 30) {
      getThirdToken(6, 1)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=肤质测试`
          });
        })
        .catch(() => {});
    }
    type === 31 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}dementia/home&token=${token}&serviceRecordId=${serviceRecordId}`);
    if (type === 32) {
      getSerialNum(serviceInfoId)
        .then((res: any) => {
          Taro.navigateTo({
            url: `/pages/webview/index?url=https://huanyu.dada360.com/huanyu_jump.jsp&mobile=${user.mobile}&serialNumber=${res.data}&serviceRecordId=${serviceRecordId}`
          });
        })
        .catch(() => {});
      return;
    }
    type === 33 && (url = '/pages/user/service/outofservice/index');
    if (type === 35) {
      getThirdToken(4, 0)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=睡眠管理`
          });
        })
        .catch(() => {});
      return;
    }
    if (type === 36) {
      getThirdToken(9, 0)
        .then((res: any) => {
          const url =
            res.url + `&serviceRecordId=${serviceRecordId}&token=${token}`;
          Taro.navigateTo({
            url: `/pages/webview/index?url=${url}&title=甲状腺管理`
          });
        })
        .catch(() => {});
      return;
    }
    type === 37 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/hpv/start&code=${pageCode}&token=${token}&serviceRecordId=${serviceRecordId}`);
    Taro.navigateTo({
      url
    });
  }

  getDiabetes = data => {
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
        Taro.navigateTo({ url });
      } else {
        if (res) {
          url = `${utils.appConfig.SERVICE_URL}diabetes/bloodSugar?token=${token}&serviceRecordId=${data}`;
        } else {
          url = `${utils.appConfig.SERVICE_URL}diabetes/index?token=${token}&serviceRecordId=${data}`;
        }
        window.location.href = url;
      }
    });
  };

  render () {
    const { show, showProvince } = this.state;
    const {
      itemName,
      endTime,
      itemDesc,
      state,
      useTime,
      sourceType,
      serviceRecordId
    } = this.props.serviceDetail || {};
    return (
      <View className='component-service-new'>
        <View
          className='service-name'
          onClick={() => {
            this.goServiceDetail();
          }}
        >
          {itemName}
        </View>
        <View
          className={`right flex ${
            state === 2 ||
            state === 3 ||
            state === 4 ||
            useTime >= new Date().getTime()
              ? 'disable'
              : ''
          }`}
          onClick={this.goUse.bind(this)}
        >
          {this.getButtonName()}
        </View>
        <View className='service-content'>
          <View className='service-time flex'>
            <View className='time-left'>
              {i18n.chain.serviceComponent.serviceValidity}:
              {useTime ? utils.timeFormat(useTime, 'y.m.d') : ''}-
              {endTime ? utils.timeFormat(endTime, 'y.m.d') : ''}
            </View>
            <View
              className='time-right flex'
              onClick={() => {
                this.hide();
              }}
            >
              <Text>{i18n.chain.button.detail}</Text>
              <View className={`show ${show ? 'hide' : ''}`}></View>
            </View>
          </View>
          {show
            ? (
            <View>
              <View className='source flex'>
                <Text>{i18n.chain.serviceComponent.serviceSource}:</Text>
                <View
                  className={`source-type type-${sourceType} ${
                    i18n.getLocaleName() === 'zh' ? '' : 'en'
                  }`}
                ></View>
              </View>
              {itemDesc
                ? (
                <View className='desc'>
                  {i18n.chain.serviceComponent.abstract}:{itemDesc}
                </View>
                  )
                : null}
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
      </View>
    );
  }
}
export default Service;
