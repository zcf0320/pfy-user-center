import { View, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import './index.scss';

function Permission () {
  return (
    <View className='all flex'>
      <View className='none'></View>
      <Text>{i18n.chain.common.noPermission}</Text>
    </View>
  );
}
export default Permission;
