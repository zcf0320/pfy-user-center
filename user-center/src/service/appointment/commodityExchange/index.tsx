import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import utils from '@utils/index';
import { GET_SELECT_ADDRESS } from '@constants/service';
import { getAddressList } from '@actions/user';
import { physicalGoodsCreate } from '@actions/service';
import { connect } from 'react-redux';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  service:any;
  getAddressList: Function;
}

@connect(
  state => state,
  dispatch => ({
    getAddressList () {
      getAddressList().then(res => {
        // 第一个为默认的
        if (res.length && res[0].isDefault) {
          dispatch({
            type: GET_SELECT_ADDRESS,
            payload: res[0]
          });
        }
      });
    }
  })
)
class CommodityExchange extends Component<IProps> {
  componentDidMount () {
    this.props.getAddressList();
  }

  render () {
    const { router } = getCurrentInstance();
    const { itemName, itemDesc, useTime, endTime } = (router?.params && router.params) || {} as any;
    const {
      id,
      provinceName,
      cityName,
      address,
      name,
      mobile
    } = this.props.service.selectAdddress;
    return (
      <Page showBack title='确认使用'>
        <View className='page-commoditu-exchange flex'>
          <View
            className='address flex'
            onClick={() => {
              Taro.navigateTo({
                url: '/setting/addressManage/list/index'
              });
            }}
          >
            <View className='top flex'>
              <View className='left flex'>
                <Image className='icon-img' src={`${ossHost}images/address.png`}></Image>
                <Text className='name'>{id ? name : '请选择地址'}</Text>
                {id ? <Text>{mobile}</Text> : null}
              </View>
              <Image className='right' src={`${ossHost}images/next.png`}></Image>
            </View>
            {id
              ? (
              <View className='bottom'>
                {`地址：${provinceName}${cityName}${address}`}
              </View>
                )
              : null}
          </View>
          <View className='address flex service'>
            <View className='top flex'>
              <View className='left flex'>
                <Image className='icon-img' src={`${ossHost}images/service_icon.png`}></Image>
                <Text className='name'>{decodeURIComponent(itemName)}</Text>
              </View>
            </View>
            <View
              className='bottom'
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {decodeURIComponent(itemDesc)}
            </View>
            <View className='time'>
              {utils.timeFormat(useTime, 'y/m/d')}-
              {utils.timeFormat(endTime, 'y/m/d')}
            </View>
          </View>
          <View
            className={`confrim flex ${id ? 'active' : ''}`}
            onClick={() => {
              if (!id) {
                return;
              }

              Taro.showModal({
                title: '确认兑换并邮寄到此地址吗',
                content: '确认此地址后将不能修改哦',
                confirmText: '确认',
                confirmColor: '#FE9A51',
                cancelText: '取消',
                cancelColor: '#9D9FA2',
                success: function (res) {
                  if (res.confirm) {
                    physicalGoodsCreate({
                      addressId: id,
                      serviceRecordId: router?.params && router.params.serviceRecordId
                    }).then(() => {
                      Taro.showToast({
                        title: '您已成功兑换， 可至“商品兑换”查看物流信息',
                        icon: 'none',
                        duration: 2000
                      });
                      setTimeout(() => {
                        Taro.navigateBack({
                          delta: 2
                        });
                      }, 1500);
                    });
                  } else {
                    //
                  }
                }
              });
            }}
          >
            确认
          </View>
        </View>
      </Page>
    );
  }
}
export default CommodityExchange;
