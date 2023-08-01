import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Component } from 'react';
import { getProductDetail, buyProduct, getScore } from '@actions/mall';
import { GET_PRODUCT_DETAIL, GET_USER_SCORE } from '@constants/mall';
import i18n from '@i18n/index';
import { SET_MODAL } from '@constants/common';
import { connect } from 'react-redux';
import Page from '@components/page';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  getProductDetail: Function;
  buyProduct: Function;
  getScore: Function;
  productDetail: {
    imgs: string;
    serviceItemName: string;
    serviceItemDesc: string;
    num: number;
    score: number;
    price: number;
  };
  userScore: number;
  disableBuy: boolean;
  setModal: Function;
}
interface IState {
  showEndModal: boolean;
}
@connect(
  state => {
    return Object.assign({}, state.common, state.mall);
  },
  dispatch => ({
    getProductDetail (params) {
      getProductDetail(params).then(res => {
        dispatch({
          type: GET_PRODUCT_DETAIL,
          payload: res
        });
      }).catch(res => {
        dispatch({
          type: GET_PRODUCT_DETAIL,
          payload: {}
        });
      });
    },
    getScore () {
      getScore().then(res => {
        dispatch({
          type: GET_USER_SCORE,
          payload: res
        });
      });
    },
    buyProduct (params) {
      return buyProduct(params);
    },
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class Detail extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showEndModal: false

    };
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    Taro.setNavigationBarTitle({ title: i18n.chain.starMinePage.productDetails });
    this.props.getScore();
    this.props.getProductDetail({
      productId: router?.params && router.params.id
    });
  }

  // 购买
  buy () {
    const { router } = getCurrentInstance();
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { token } = user;
    if (!token) {
      let url = '/pages/login/index';
      utils.appConfig.isH5 && (url = '/pages/h5/login/index');
      Taro.navigateTo({
        url
      });
      return;
    }
    const { disable } = this.watchScore();
    if (disable) {
      return;
    }
    const { score } = this.props.productDetail;
    const vm = this;
    this.props.setModal({
      show: true,
      content: `是否花费${score}星币来兑换产品`,
      subTitle: `(当前星币值为${this.props.userScore})`,
      confirmText: '确认兑换',
      clickConfirm: () => {
        const { id } = (router?.params && router.params) || {};
        vm.props
          .buyProduct({
            productId: id
          })
          .then(() => {
            this.setState({
              showEndModal: true
            });
          });
      }
    });
  }

  watchScore () {
    let disable = false;
    let text = i18n.chain.starMinePage.starCurrencyExchange;
    const { token } = Taro.getStorageSync(utils.appConfig.userInfo);
    if (!token) {
      text = i18n.chain.starMinePage.redeemAfterLogin;
    } else {
      if (this.props.userScore < this.props.productDetail.score) {
        disable = true;
        text = i18n.chain.starMinePage.insufficientStarCoins;
      }
    }

    return {
      disable,
      text
    };
  }

  render () {
    const { showEndModal } = this.state;
    return (
      <Page showBack title={i18n.chain.starMinePage.productDetails}>
        <View className='page-mail-detail flex'>
          {showEndModal
            ? (
            <View className='end-modal flex'>
              <View className='modal-content flex'>
                <View className='content-text'>
                  <Text>{i18n.chain.starMinePage.exchangeSucceeded}</Text>
                  <View
                    className='btn flex'
                    onClick={() => {
                      this.setState({
                        showEndModal: false
                      });
                      Taro.navigateTo({
                        url: '/pages/user/service/list/index'
                      });
                    }}
                  >
                    {i18n.chain.starMinePage.myBenefits}
                  </View>
                </View>
                <View
                  className='close'
                  onClick={() => {
                    this.setState({
                      showEndModal: false
                    });
                  }}
                ></View>
              </View>
            </View>
              )
            : null}

          <View className='content'>
            <View className='title'>{i18n.chain.starMinePage.productDetails}</View>
            <RichText
              className='introduce'
              nodes={this.props.productDetail.serviceItemDesc}
            ></RichText>
          </View>
          <View className='bottom flex'>
            <View className='left flex'>
              <View className='left-content'>
                <Text>{i18n.chain.starMinePage.total}</Text>
                <Text className='score'>
                  {this.props.productDetail.score}
                  <Text className='text'>{i18n.chain.bannerComponent.star}</Text>
                </Text>
              </View>
            </View>
            <View
              className={`right flex ${
                this.watchScore().text === '星币不足' ? 'disable' : ''
              }`}
              onClick={this.buy.bind(this)}
            >
              {this.watchScore().text}
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Detail;
