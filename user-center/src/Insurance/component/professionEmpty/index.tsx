import { View, Text } from '@tarojs/components';
import './index.scss';

function ProfessionEmpty () {
  return (
        <View className='component-empty'>
            <View className='empty-img'></View>
            <Text>找不到相关职位</Text>
        </View>
  );
}
export default ProfessionEmpty;
