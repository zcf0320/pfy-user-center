import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import i18n from '@i18n/index';
import './index.scss';

function HotChange (props: { products: Array<any> }) {
  const goDetail = (id: number) => {
    Taro.navigateTo({
      url: `/pages/mall/detail/index?id=${id}`
    });
  };
  return (
    <View className='hot'>
      <View className='good-top'>
        <View className='good-title'>
          {i18n.chain.starMinePage.popularExchange}
        </View>
      </View>

      <View className='hot-change'>
        {props.products.map(item => {
          return (
            <View
              key={item.productId}
              className='hot-container'
              onClick={() => goDetail(item.productId)}
            >
              <View className='pic-hot'>
                <Image className='pic-hot' src={item.img}></Image>
              </View>
              <View className='pic-concent'>
                <View className='title'>{item.serviceItemName}</View>
                <View className='record flex-box'>
                  <View className='star'></View>
                  <View className='red'>{item.scorePrice}</View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default HotChange;
