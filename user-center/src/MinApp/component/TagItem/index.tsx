import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  item: any;
}
function TagItem (props: IProps) {
  const { title, startTime, endTime, typeId, state } = props.item || {};
  return (
    <View
      className='component-tag-item flex'
      onClick={() => {
        if (state === 2) {
          return;
        }
        Taro.navigateTo({
          url: `/MinApp/pages/article/index?id=${typeId}&title=${title}`
        });
      }}
    >
      <View className='tag-content flex'>
        <View className='title'>{title}</View>
        <View className='time'>
          查阅期限:{utils.timeFormat(startTime, 'y.m.d')}-
          {utils.timeFormat(endTime, 'y.m.d')}
        </View>
      </View>
      <View className='big-dot'></View>
      <View className='little-dot'></View>
      {/* {state === 2 && <Image className="right" src={old}></Image>} */}
    </View>
  );
}
export default TagItem;
