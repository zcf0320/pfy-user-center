import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  imageList: Array<string>;
  close: () => void;
}
function PreviewImage (props: IProps) {
  const { imageList } = props;
  return (
    <View className='component-preview'>
      <View className='img-list'>
        <Swiper
          className='swiper-content'
          indicatorDots
          circular
          interval={5000}
        >
          {imageList &&
            imageList.length &&
            imageList.map(item => {
              return (
                <SwiperItem className='swiper-item' key={item}>
                  <Image className='image' src={item}></Image>
                  <Text>1</Text>
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
      <Image
        src={`${ossHost}images/icon_close.png`}
        className='close'
        onClick={() => {
          props.close();
        }}
      ></Image>
    </View>
  );
}
export default PreviewImage;
