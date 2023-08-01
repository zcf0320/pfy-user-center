import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { xAccessToken } = utils.appConfig;

interface IProps {
  item: any;
}
function ArticleItem (props: IProps) {
  const { introduction, typeName, updateTime, articleId, img, title } =
    props.item || {};
  return (
    <View
      className='component-article-item'
      onClick={() => {
        let url = '';
        const token = Taro.getStorageSync(xAccessToken);
        if (utils.appConfig.isH5) {
          url = `/MinApp/pages/detail/index?id=${articleId}&token=${token}`;
        } else {
          url = `/pages/webview/index?url=${utils.appConfig.H5_URL}MinApp/pages/detail/index&id=${articleId}&token=${token}`;
        }
        // url = `/MinApp/pages/detail/index?id=${articleId}&token=${token}`;
        Taro.navigateTo({
          url
        });
        // Taro.navigateTo({
        //     url: `/MinApp/pages/detail/index?id=${articleId}`
        // })
      }}
    >
      <View className='article-content flex'>
        <Image className='image' src={img}></Image>
        <View className='content flex'>
          <View className='title'>{title}</View>
          <View
            className='text'
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}
          >
            {introduction}
          </View>
          <View className='time flex'>
            <View className='typeName'>{typeName}</View>
            <Text>{utils.timeFormat(updateTime, 'y.m.d')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export default ArticleItem;
