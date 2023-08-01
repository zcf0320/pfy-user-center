import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import { getPhysicalGoodsInfo } from '@actions/serviceItem';
import { GET_PHYSICALGOOD_INFO } from '@constants/serviceItem';
import { IStoreProps } from '@reducers/interface';
import './index.scss';

const OLDERSTATE = {
  1: '订单待确认',
  2: '订单已发货',
  3: '订单已完成',
  4: '订单已取消'
};
interface IProps {
    getPhysicalGoodsInfo: Function;
    physicalGoodsRecordId: string;
    physicalGoodsInfo: {
        state: number;
        createTime: string;
        cancelReason: string;
        completeTime: string;
        expressCompanyName: string;
        trackingNumber: string;
        receiver: string;
        address: string;
        orderNo: string;
        deliveryTime: string;
    };
}

type PropsType = IStoreProps & IProps
@connect(state => Object.assign({}, state.serviceItem), dispatch => ({
  getPhysicalGoodsInfo (params) {
    getPhysicalGoodsInfo(params).then(res => {
      dispatch({
        type: GET_PHYSICALGOOD_INFO,
        payload: res
      });
    });
  }
}))
class OlderDetail extends Component <PropsType> {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getPhysicalGoodsInfo(
      { physicalGoodsRecordId: router?.params && router.params.id }
    );
  }

  render () {
    const { state, createTime, cancelReason, completeTime, expressCompanyName, trackingNumber, receiver, address, orderNo, deliveryTime } = this.props.physicalGoodsInfo || {};
    console.log(this.props.physicalGoodsInfo);
    return (
            <Page showBack title='订单详情'>
                <View className='page-olderDetail flex'>
                   {state && (<View className='older-state'>
                       <View className='state-text'>{OLDERSTATE[state]}</View>
                       <View className='state-time'>{OLDERSTATE[state]}  {createTime}</View>
                       {state === 4 && (<View className='reason'>
                            <View className='reason-title'>取消原因<Text className='reason-text'>{cancelReason}</Text></View>
                            <View className='state-time'>{completeTime}</View>
                       </View>)}
                   </View>)}
                   <View className='older-logistics'>
                       <View className='logistics-icon'>物流公司：<Text className='older-text'>{expressCompanyName || '暂无'}</Text></View>
                       <View className='logistics-text'>物流单号：<Text className='older-text'>{trackingNumber || '暂无'}</Text></View>
                   </View>
                   <View className='older-people'>
                        <View className='people-icon'>收件人姓名：{receiver || '暂无'}</View>
                       <View className='people-text'>具体地址：{address || '暂无'}</View>
                   </View>
                   <View className='older-info'>
                        <View className='info-icon'>订单信息</View>
                        <View className='info-item'>订单编号<Text className='item-text'>{orderNo || '暂无'}</Text></View>
                        <View className='info-item'>创建时间<Text className='item-text'>{createTime || '暂无'}</Text></View>
                        <View className='info-item'>发货时间<Text className='item-text'>{deliveryTime || '暂无'}</Text></View>
                        <View className='info-item'>完成时间<Text className='item-text'>{completeTime || '暂无'}</Text></View>
                   </View>
                </View>
            </Page>
    );
  }
}
export default OlderDetail;
