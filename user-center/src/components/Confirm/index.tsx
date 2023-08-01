import { View } from '@tarojs/components';
import './index.scss';

interface IProps {
  title: string;
  text: string;
  subText?: string;
  confirm: Function;
  cancel: Function;
}
function Confirm (props: IProps) {
  return (
    <View className='drug-confirm-modal'>
      <View className='drug-confirm'>
        <View className='drug-confirm-title'>{props.title}</View>
        <View className='drug-confirm-text'>{props.text}</View>
        <View className='drug-confirm-subText'>{props.subText}</View>
        <View className='drug-confirm-btns flex'>
          <View
            className='drug-confirm-cancel'
            onClick={() => {
              props.cancel();
            }}
          >
            取消
          </View>
          <View
            className='drug-confirm-sure'
            onClick={() => {
              props.confirm();
            }}
          >
            确认
          </View>
        </View>
      </View>
    </View>
  );
}
export default Confirm;
