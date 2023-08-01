import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { getMinIntervalDay, getValidDate } from '@actions/common';
import { SET_MODAL } from '@constants/common';
import { connect } from 'react-redux';
import './index.scss';

interface IProps {
  serviceDetail: {
    itemName: string;
    itemDesc: string;
    useTime: number;
    endTime: number;
    serviceRecordId: string;
    state: number;
    serviceId: string;
    pageCode: string;
    needAuth: boolean;
    orderId: number;
    useCount: number;
    claimState: number;
    needCheck: number;
    claimFailReasons: string;
    checkFailReasons: string;
  };
  noAction?: boolean;
  actions: any;
  reducers: any;
  state: number;
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
class ServiceItem extends Component<IProps, {}> {
  statusText (status) {
    const { useCount } = this.props.serviceDetail || {};
    let text = '';
    if (status === 0) {
      text = `${i18n.chain.serviceComponent.useNow}${useCount !== 1 ? `x${useCount}` : ''}`;
      useCount === -1 && (text = i18n.chain.serviceComponent.unlimitedUse);
    }
    status === 1 && (text = i18n.chain.serviceComponent.viewDetails);
    status === 2 && (text = i18n.chain.myServicePage.overdue);
    return text;
  }

  statusimg (status) {
    const { claimState, needCheck } = this.props.serviceDetail || {};
    let text = '';
    if (status === 1) {
      claimState === 1 && (text = 'success-lp');
      claimState === 2 && (text = 'fail-lp');
    }
    if (status === 0) {
      needCheck === 1 && (text = '');
      needCheck === 2 && (text = '');
      needCheck === 3 && (text = 'ing-sh');
      needCheck === 4 && (text = 'success-sh');
      needCheck === 5 && (text = 'fail-sh');
      needCheck === 6 && (text = 'fail-sh');
    }
    return text;
  }

  // 去使用
  goUse (e) {
    e.stopPropagation();
    const {
      state,
      serviceRecordId,
      orderId,
      pageCode,
      needCheck
    } = this.props.serviceDetail;
    const type = utils.appConfig.codeMap[pageCode];
    if (state === 0 && needCheck && needCheck !== 1 && needCheck !== 4) {
      let url = '';
      if (needCheck === 2) {
        this.props.actions.setModal({
          show: true,
          title: '提示',
          content: '此项服务需要提交资料审核后使用',
          clickConfirm: () => {
            Taro.navigateTo({
              url: `/ClaimsSettle/pages/step/index?serviceRecordId=${serviceRecordId}`
            });
          }
        });
        return;
      }
      if (needCheck === 6) {
        if (needCheck === 6) {
          getValidDate({
            serviceRecordId
          }).then(res => {
            this.props.actions.setModal({
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
        return;
      }
      if (needCheck === 7) {
        getMinIntervalDay({ serviceRecordId }).then(res => {
          this.props.actions.setModal({
            show: true,
            title: '提示',
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
    if (type === 11 && needCheck === 4) {
      Taro.navigateTo({
        url: `/ClaimsSettle/pages/examineSuccess/index?state=2&serviceRecordId=${serviceRecordId}`
      });
      return;
    }
    if (type === 11) {
      let url = '';
      state === 0 &&
        (url = `/MinApp/pages/drug/detailList/index?serviceRecordId=${serviceRecordId}`);
      // state === 0 && (url = `/MinApp/pages/drug/index/index?serviceRecordId=${serviceRecordId}`)
      state === 1 &&
        (url = `/MinApp/pages/drug/orderDetail/index?id=${orderId}`);

      url &&
        Taro.navigateTo({
          url
        });
    }
  }

  // 去详情
  render () {
    const { itemName, claimFailReasons, useTime, endTime, checkFailReasons } =
      this.props.serviceDetail || {};
    const { state } = this.props;
    return (
      <View className='serviceEquityItem-drug' onClick={this.goUse.bind(this)}>
        <View
          className={`serviceEquityItem-title ${this.statusimg(
            this.props.state
          )}`}
        >
          <View className='serviceEquityItem-title-text'>{itemName}</View>
        </View>
        <View className='serviceEquityItem-bottom'>
          <View className='serviceEquityItem-bottom-time'>{`${utils.timeFormat(
            useTime,
            'y.m.d'
          )} - ${utils.timeFormat(endTime, 'y.m.d')}`}</View>
          {state !== 2
            ? (
            <View className='serviceEquityItem-bottom-btn'>
              {this.statusText(state)}
            </View>
              )
            : null}
        </View>
        {this.props.state === 0 && checkFailReasons
          ? (
          <View className='serviceEquityItem-detail'>{checkFailReasons}</View>
            )
          : null}
        {this.props.state === 1 && claimFailReasons
          ? (
          <View className='serviceEquityItem-detail'>{claimFailReasons}</View>
            )
          : null}
      </View>
    );
  }
}
export default ServiceItem;
