import Page from '@components/page';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
export default function StoreDrugClaimInfo () {
  return (
    <Page title='门店药品理赔' showBack>
      <View className='store-page-info'>
        <Image className='header-img' src={`${ossHost}store-header.png`}></Image>
        <View className='content'>
          <View className='notice'>
            <Image className='notice-icon' src={`${ossHost}images/store-notice.png`}></Image>
            <View>
              *如需理赔药品中含有处方药，建议携带处方单至现场，以便更快捷的为您提供现场理赔服务。
            </View>
          </View>
          <View className='content-img'>
            <Image className='img' src={`${ossHost}store-content.png`}></Image>
          </View>
        </View>
        <View className='footer'>
          <View
            className='btn'
            onClick={() => {
              Taro.navigateBack();
            }}
          >
            返回扫码
          </View>
        </View>
      </View>
    </Page>
  );
}
