import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import utils from '@utils/index';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
class Success extends Component {
  render () {
    const { router } = getCurrentInstance();
    return (
      <Page showBack title='提交成功'>
        <View className='page-success flex'>
          <View className='content flex'>
            <Image
              className='img'
              src={`${ossHost}order_success.png`}
            ></Image>
            <Text className='order-success'>提交成功</Text>
            <View className='order-view'>后期信息可在订单中查看</View>
            <View className='btns flex'>
              <View
                className='btn flex back'
                onClick={() => {
                  Taro.navigateBack({
                    delta: 2
                  });
                }}
              >
                <Text>返回首页</Text>
              </View>
              <View
                className='btn flex'
                onClick={() => {
                  Taro.redirectTo({
                    url: `/MinApp/pages/drug/orderDetail/index?id=${router?.params && router.params.id}`
                  });
                }}
              >
                <Text>查看订单</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Success;
