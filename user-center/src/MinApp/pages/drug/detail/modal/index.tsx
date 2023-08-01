import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { checkStock } from '@actions/minApp';
import { IStoreProps } from '@reducers/interface';

import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  close: Function;
  refresh: Function;
  serviceRecordId: string;
}
type PropsType = IStoreProps & IProps;
@connect(state => state)
class Modal extends Component<PropsType> {
  constructor (props) {
    super(props);
    this.state = {};
  }

  selectSpec () {
    const { productDetail } = this.props.minApp;
    const { specifications } = productDetail || {};
    if (!specifications) {
      return {};
    }
    const select = specifications.filter(item => {
      return item.select === true;
    });
    return select[0];
  }

  check () {
    if (this.watchData()) {
      return;
    }
    const { productDetail } = this.props.minApp;
    const params: any = {
      saleProductId: productDetail.id
    };
    this.props.serviceRecordId &&
      (params.serviceRecordId = this.props.serviceRecordId);
    checkStock(params).then(() => {
      Taro.navigateTo({
        url: `/MinApp/pages/drug/order/index?serviceRecordId=${this.props
          .serviceRecordId || ''}`
      });
    });
  }

  save () {
    const { router } = getCurrentInstance();
    Taro.navigateTo({
      url: `/MinApp/pages/drug/order/index?serviceRecordId=${router?.params && router.params
        .serviceRecordId}`
    });
  }

  watchData () {
    const { productDetail } = this.props.minApp;
    const { specifications, num } = productDetail || {};
    const select = specifications.filter(item => {
      return item.select === true;
    });
    const { stock } = select[0];
    return !!(num > stock);
  }

  render () {
    const { productDetail } = this.props.minApp;
    const {
      headPic,
      name,
      brandName,
      authorizedCode,
      standard,
      num,
      specifications
    } = productDetail || {};
    return (
      <View className='component-modal'>
        <View className='modal-content'>
          <View className='info flex'>
            <Image
              className='close'
              src={`${ossHost}images/icon_close.png`}
              onClick={() => {
                this.props.close();
              }}
            ></Image>
            <Image className='img' src={headPic[0]}></Image>
            <View className='right'>
              <View className='name'>
                {brandName} {name}
              </View>
              <View className='no'>{authorizedCode}</View>
              <View className='spec'>已选规格：{standard}</View>
            </View>
          </View>
          <View className='content'>
            <View className='spec-list flex'>
              {specifications &&
                specifications.length &&
                specifications.map(item => {
                  return (
                    <View
                      className={`spec-item flex ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.productId}
                      onClick={() => {
                        this.props.refresh(item.productId);
                      }}
                    >
                      {item.specification}
                    </View>
                  );
                })}
            </View>
            <View className='number flex'>
              <Text>购买数量：{num}</Text>
              <Text className='all'>
                （库存{this.selectSpec().stock}盒）
              </Text>
            </View>
          </View>

          <View className='drug-modal-btn flex'>
            <View
              className={`confirm flex ${
                this.watchData() ? 'disable' : ''
              }`}
              onClick={() => {
                this.check();
              }}
            >
              确认
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Modal;
