import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import './index.scss';

interface IProps {
  productInfo: {
    moneyPrice: number;
    img: string;
    productId: string;
    scorePrice: number;
    serviceItemName: string;
  };
}

class MallItem extends Component<IProps> {
  goDetail () {
    const { productId } = this.props.productInfo || {};

    if (!productId) {
      return;
    }

    Taro.navigateTo({
      url: `/pages/mall/detail/index?id=${productId}`
    });
  }

  render () {
    const { scorePrice, serviceItemName, img } = this.props.productInfo || {};

    return (
      <View className='component-mall-item' onClick={this.goDetail.bind(this)}>
        <View className='card'>
          <Image className='img' src={img}></Image>
        </View>
        <View className='bottom'>
          <View className='bottom-title overflow'>{serviceItemName}</View>
          <View className='compontent-score flex'>
            <View className='star'></View>
            <View className='score-left'>{scorePrice}</View>
          </View>
        </View>
      </View>
    );
  }
}
export default MallItem;
