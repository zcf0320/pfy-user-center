import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
export default function ClaimSuccess () {
  return (
    <Page title='我的身份码' showBack>
      <View className='claims-examine'>
      <View className='claims-examine-box'>
        <Image src={`${ossHost}store-claim-success.png`} className='claims-examine-img' />
        <View className='claims-examine-333'>您的理赔已完成</View>
        </View>
        <View
          className='claims-examine-reset'
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/user/service/list/index'
            });
          }}
        >
        查看我的服务
        </View>
      </View>
    </Page>
  );
}
