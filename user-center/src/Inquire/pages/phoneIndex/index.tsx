import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import Page from '@components/page';
import './index.scss';

class PhoneIndex extends Component {
  render () {
    const { router } = getCurrentInstance();
    return (
      <Page showBack title='电话问诊'>
        <View className='page-phone-index flex'>
          <View className='phone-index'>
            <View className='phone-image'></View>
          </View>
          <View
            className='phone-bottom flex'
            onClick={() => {
              Taro.redirectTo({
                url: `/Inquire/pages/phone/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
              });
            }}
          >
            我已知悉，开始问诊
          </View>
        </View>
      </Page>
    );
  }
}
export default PhoneIndex;
