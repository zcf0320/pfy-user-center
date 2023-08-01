import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const ExchangeItem = (props: { item: any; type: string; }) => {
  const {
    serviceInfoName,
    createTime,
    trackingNumber,
    expressCompanyName,
    id
  } = props.item || {};
  return (
    <View
      className='exchange-item-new'
      onClick={() => {
        let url = `/service/result/commodityExchange/index?id=${id}`;
        props.type === '18' &&
          (url = `/ServicesItems/pages/glasses/detail/index?id=${id}`);
        Taro.navigateTo({
          url
        });
      }}
    >
      <View className='top-center'>
        <View className='exchange-item-title flex'>
          <Text className='left'>{serviceInfoName}</Text>
          <View className='right'></View>
        </View>
        <View className='address'>
          兑换时间：{utils.timeFormat(createTime, 'y.m.d h:m')}
        </View>
        <View className='time'>
          物流信息：
          {trackingNumber
            ? `${expressCompanyName},${trackingNumber}`
            : '商品将于7-14个工作日发出，请耐心等待！'}
        </View>
      </View>
      <View className='bottom-center flex'>
        <View className='btn flex btn-in'>查看详情</View>
      </View>
    </View>
  );
};
export default ExchangeItem;
