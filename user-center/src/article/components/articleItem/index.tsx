import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

function ArticleItem (props: { info: any }) {
  const goDetail = () => {
    Taro.navigateTo({
      url: `/article/detail/index?id=${props.info.id}`
    });
  };
  const { updateTime, advertisPic, title, introduce, tags } = props.info || {};
  return (
    <View
      className='component-article-item flex'
      onClick={() => {
        goDetail();
      }}
    >
      <View className='content flex'>
        <Image className='image' src={advertisPic}></Image>
        <View className='item-content'>
          <View className='artical-title'>{title}</View>
          <View className='tag-list flex'>
            {tags &&
              tags.length &&
              tags.map((item, index) => {
                return index < 2
                  ? (
                  <View key={item} className='tags-item flex'>
                    {item}
                  </View>
                    )
                  : null;
              })}
          </View>
          <Text className='time'>{utils.timeFormat(updateTime, 'y.m.d')}</Text>

          <View
            className='artical-content'
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}
          >
            {introduce}
          </View>
        </View>
      </View>
    </View>
  );
}
export default ArticleItem;
