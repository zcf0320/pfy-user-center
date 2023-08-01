import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { physicalGoodsInfo } from '@actions/service';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  info: any;
}
class Result extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      info: {}
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const vm = this;
    physicalGoodsInfo({
      physicalGoodsRecordId: router?.params && router.params.id
    }).then(res => {
      vm.setState({
        info: res
      });
    });
  }

  render () {
    const {
      address,
      expressCompanyName,
      trackingNumber,
      receiver,
      mobile,
      orderNo,
      serviceInfoName,
      createTime
    } = this.state.info;
    return (
      <Page showBack title='兑换详情'>
        <View className='page-exchange-detail flex'>
          {trackingNumber || expressCompanyName
            ? (
            <View className='common'>
              <View className='common-top flex'>
                <Image src={`${ossHost}images/logistics.png`} className='img'></Image>
                <Text className='title'>物流信息</Text>
              </View>
              <View className='common-bottom flex'>
                <View className='common-item'>
                  商品将于7-14个工作日发出，请耐心等待！
                </View>
                {trackingNumber
                  ? (
                  <View className='common-item flex'>
                    <Text>
                      {expressCompanyName}：{trackingNumber}
                    </Text>
                    <Text
                      className='copy'
                      onClick={() => {
                        Taro.setClipboardData({
                          data: trackingNumber
                        });
                      }}
                    >
                      复制
                    </Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}

          {receiver || mobile || address
            ? (
            <View className='common'>
              <View className='common-top flex'>
                <Image src={`${ossHost}images/address.png`} className='img'></Image>
                <Text className='title'>收件信息</Text>
              </View>
              <View className='common-bottom flex'>
                {receiver || mobile
                  ? (
                  <View className='common-item'>
                    {receiver
                      ? (
                      <Text className='m-r-32'>{receiver}</Text>
                        )
                      : null}
                    {mobile ? <Text className='m-r-32'>{mobile}</Text> : null}
                  </View>
                    )
                  : null}

                {address
                  ? (
                  <View className='common-item flex'>
                    <Text>地址：{address}</Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}

          {serviceInfoName || orderNo || createTime
            ? (
            <View className='common'>
              <View className='common-top flex'>
                <Image src={`${ossHost}images/order.png`} className='img'></Image>
                <Text className='title'>订单信息</Text>
              </View>
              <View className='common-bottom flex'>
                {serviceInfoName
                  ? (
                  <View className='common-item'>
                    <Text>商品名称：{serviceInfoName}</Text>
                  </View>
                    )
                  : null}
                {orderNo
                  ? (
                  <View className='common-item'>
                    <Text>订单编号：{orderNo}</Text>
                  </View>
                    )
                  : null}
                {createTime
                  ? (
                  <View className='common-item'>
                    <Text>
                      兑换时间：{utils.timeFormat(createTime, 'y/m/d h:s')}
                    </Text>
                  </View>
                    )
                  : null}
              </View>
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default Result;
