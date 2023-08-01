import Page from '@components/page';
import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
export default function OutOfService () {
  return <Page title='寰宇关爱' showBack>
  <View>
  <Image src={`${ossHost}out-of-service.png`}></Image>
  </View>

  </Page>;
}
