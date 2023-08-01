import i18n from '@i18n/index';
import { View } from '@tarojs/components';
import './index.scss';

interface IProps {
  tips: string;
  goLogin: Function;
}
function NoLogin (props: IProps) {
  return (
    <View className='no-login'>
      <View className='no-login-img'></View>
      <View className='no-login-text'>{props.tips}</View>
      <View className='no-login-btn' onClick={() => { props.goLogin(); }}>
        {i18n.chain.drug.goLogin}
      </View>
    </View>
  );
}
export default NoLogin;
