import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  text: string;
  goUrl: Function;
}

function NoResult (props: IProps) {
  return (
    <View className='claims-no-result'>
      <Image
        src={`${ossHost}claims_no_record.png`}
        className='claims-no-result-img'
      />
      <View className='claims-no-result-text'>{props.text}</View>
      <View className='go-btn' onClick={() => { props.goUrl(); }}>去兑换</View>
    </View>
  );
}
export default NoResult;
