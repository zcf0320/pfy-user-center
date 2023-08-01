import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, RichText, Text, Image } from '@tarojs/components';
import i18n from '@i18n/index';
import { Component } from 'react';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import { getServiceDetail } from '@actions/service';
import { buyProduct, getScore } from '@actions/mall';
import { GET_SERVICE_DETAIL } from '@constants/service';
import { GET_USER_SCORE, SET_DIS_BUY } from '@constants/mall';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  service:any;
  mall:any;
  getServiceDetail: Function;
  buyProduct: Function;
  setDisBuy: Function;
  getScore: Function;
}

@connect(
  state => state,
  dispatch => ({
    getServiceDetail (params) {
      return new Promise(resolve => {
        getServiceDetail(params).then(res => {
          res.serviceItemDesc = res.serviceItemDesc.replace(
            /<img/gi,
            '<img style="max-width:100%;height:auto" '
          );
          resolve(res);
          dispatch({
            type: GET_SERVICE_DETAIL,
            payload: res
          });
        });
      });
    },
    getScore () {
      return new Promise(resolve => {
        getScore().then(res => {
          resolve(res);
          dispatch({
            type: GET_USER_SCORE,
            payload: res
          });
        });
      });
    },
    setDisBuy (data) {
      dispatch({
        type: SET_DIS_BUY,
        payload: data
      });
    },
    buyProduct (params) {
      return buyProduct(params);
    }
  })
)
class ServiceDetail extends Component<IProps> {
  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.serviceComponent.serviceIntroduction });
    const { router } = getCurrentInstance();
    const vm = this;
    this.props
      .getServiceDetail({
        serviceInfoId: router?.params && router.params.serviceInfoId
      })
      .then(res => {
        const { scorePrice } = res.productVo || {};
        vm.props.getScore().then(result => {
          result >= scorePrice && vm.props.setDisBuy(true);
        });
      });
  }

  goNetWork () {
    const { router } = getCurrentInstance();
    Taro.navigateTo({
      url: `/service/detail/network/index?serviceInfoId=${router?.params && router.params.serviceInfoId}`
    });
  }

  watchScore () {
    const { userInfo } = utils.appConfig;
    const disable = !this.props.mall.disableBuy;
    let text = '积分兑换';
    if (disable) {
      const user = Taro.getStorageSync(userInfo) || {};
      const { company } = user;
      text = '积分不足';
      !company && (text = '积分不足，完善信息赚积分');
    }
    return {
      disable,
      text
    };
  }

  render () {
    const {
      img,
      num,
      serviceItemDesc,
      serviceItemName,
      pageCode
    } = this.props.service.serviceDetail;
    const type = utils.appConfig.codeMap[pageCode];
    return (
      <Page showBack title={i18n.chain.serviceComponent.serviceIntroduction}>
        <View className='page-service-detail'>
          <View className='service'>
            <Image className='img' src={img}></Image>
            <View className='service-info flex'>
              <View className='name'>{serviceItemName}</View>
              <View className='use flex'>
                <Text>已有{num}人使用</Text>
                {type === 6 || type === 7
                  ? (
                  <View
                    className='net flex'
                    onClick={() => {
                      this.goNetWork();
                    }}
                  >
                    <Text>{i18n.chain.serviceComponent.serviceNetwork}</Text>
                    <Image src={`${ossHost}images/next_yellow.png`} className='next'></Image>
                  </View>
                    )
                  : null}
              </View>
            </View>
          </View>
          <View className='service-detail'>
            <View className='service-title flex'>
              <View className='line'></View>
              <Text>{i18n.chain.serviceComponent.productDetail}</Text>
              <View className='line'></View>
            </View>
            <RichText className='introduce' nodes={serviceItemDesc}></RichText>
          </View>
        </View>
      </Page>
    );
  }
}
export default ServiceDetail;
