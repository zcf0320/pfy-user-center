import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import { getProductList, getScore, getHotProduct } from '@actions/mall';
import { connect } from 'react-redux';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { getSign, sign } from '@actions/common';
import { GET_PRODUCT_LIST } from '@constants/mall';
import LoginModal from '@components/loginModal';
import MallItem from '@components/mallItem';
import HotChange from '../components/hot';
import './index.scss';

interface IProps {
  getProductList: Function;
  productList: Array<any>;
}

interface IState {
  height: string;
  starCoin: number;
  showLoginModal: boolean;
  gallfly: boolean;
  signList: Array<any>;
  products: Array<any>;
}
const WEEKLIST = [
  i18n.chain.integralComponent.monday,
  i18n.chain.integralComponent.tuesday,
  i18n.chain.integralComponent.wednesday,
  i18n.chain.integralComponent.thursday,
  i18n.chain.integralComponent.friday,
  i18n.chain.integralComponent.saturday,
  i18n.chain.integralComponent.sunday
];
const signData = [1, 1, 1, 1, 1, 1, 1];
@connect(
  state => Object.assign({}, state.user, state.common, state.mall),
  dispatch => ({
    getProductList (params) {
      getProductList(params).then((res: any) => {
        dispatch({
          type: GET_PRODUCT_LIST,
          payload: res.records,
          pageNum: 1
        });
      });
    }
  })
)
class Mall extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      height: '',
      starCoin: 0,
      showLoginModal: false,
      gallfly: false,
      signList: [],
      products: []
    };
  }

  componentDidMount () {
    if (Taro.getEnv() === 'WEAPP') {
      const rect = Taro.getMenuButtonBoundingClientRect();
      const { statusBarHeight } = Taro.getSystemInfoSync();
      this.setState({
        height: rect.bottom + statusBarHeight + 'px'
      });
    }
  }

  componentDidShow () {
    this.getProductList();
    const { userInfo } = utils.appConfig;
    const { token } = Taro.getStorageSync(userInfo) || {};
    if (token) {
      getScore().then((res: any) => {
        this.setState({ starCoin: res });
      });
      getSign().then((res: any) => {
        this.setState({
          signList: res
        });
      });
    }
    getHotProduct().then((res: any) => {
      this.setState({ products: res });
    });
  }

  // 获取商品列表
  getProductList () {
    const params = {
      pageNum: 1,
      pageSize: 1000
    };
    this.props.getProductList(params);
  }

  onShareAppMessage () {
    return {
      title: i18n.chain.common.title,
      imageUrl:
        'https://senro-tree-sleep-1301127519.cos.ap-nanjing.myqcloud.com/img/%E5%AF%B0%E5%AE%87logo.png',
      path: '/pages/mall/index/index'
    };
  }

  goUrl (index) {
    let url = '';
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    if (!token) {
      this.setState({
        showLoginModal: true
      });
    } else {
      index === 1 && (url = '/PointsMall/pages/task/index');
      index === 2 && (url = '/pages/mall/records/index');
      index === 3 && (url = '/PointsMall/pages/lottery/index');
      Taro.navigateTo({
        url
      });
    }
  }

  checkLogin () {
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    if (!token) {
      this.setState({ showLoginModal: true });
      return false;
    } else {
      this.setState({ showLoginModal: false });
    }
    return true;
  }

  signs () {
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    if (token) {
      if (this.checkLogin()) {
        const day = new Date().getDay() - 1;
        const { signList } = this.state;
        if (signList[day]) {
          return;
        }

        sign().then(() => {
          this.setState({
            gallfly: true
          });
          getScore().then((res: any) => {
            this.setState({ starCoin: res });
          });
          getSign().then((res: any) => {
            this.setState({
              signList: res
            });
          });
        });
      }
    } else {
      this.checkLogin();
    }
  }

  render () {
    const {
      height,
      showLoginModal,
      gallfly,
      starCoin,
      signList,
      products
    } = this.state;
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    return (
      <View>
        <View className='star-custom-bar' style={{ height: height }}>
          星矿
        </View>
        <View className='page-mall'>
          <View className='mall-banner'>
            <View className='mall-top'>
              <View className='mall-top-title flex-between'>
                <View className='flex mall-pentacle'>
                  {i18n.chain.bannerComponent.myStar}
                </View>
                <View
                  className='mall-exchange flex-center'
                  onClick={() => {
                    this.goUrl(2);
                  }}
                >
                  <View className='take-img'></View>
                  {i18n.chain.bannerComponent.exchangeRecord}
                </View>
              </View>
              <View className='score'>{!token ? '— —' : starCoin}</View>
            </View>
            <View className='banner-bottom'>
              <View className='top-banner'>
                <View className='flex-between'>
                  <View className='top-banner-title flex-box'>
                    <View className='top-banner-title-text'>
                      {i18n.chain.bannerComponent.dailyCheck}
                    </View>
                  </View>
                </View>
                <View className='modal flex'>
                  <View className='week flex'>
                    {token
                      ? (
                      <View className='week-content'>
                        {signList && signList.length
                          ? signList.map((item, index) => {
                            return (
                                <View
                                  className='week-item flex'
                                  key={WEEKLIST[index]}
                                >
                                  <View
                                    className={`item-content flex ${
                                      item ? 'active' : ''
                                    }`}
                                  >
                                    {index === 6
                                      ? (
                                      <View className='week-last'>
                                        <View className='add-score'></View>
                                        <View className='start big'></View>
                                        <View className='start sm'></View>
                                      </View>
                                        )
                                      : (
                                      <View className='start'></View>
                                        )}
                                    <View
                                      className={`integral-score ${
                                        item ? 'active' : ''
                                      }`}
                                    >
                                      +3
                                    </View>
                                  </View>
                                  <View
                                    className={`name ${item ? 'active' : ''}`}
                                  >
                                    {item
                                      ? i18n.chain.bannerComponent.collected
                                      : WEEKLIST[index]}
                                  </View>
                                </View>
                            );
                          })
                          : null}
                      </View>
                        )
                      : (
                      <View className='week-content'>
                        {signData &&
                          signData.length &&
                          signData.map((item, index) => {
                            return (
                              <View
                                className='week-item flex'
                                key={WEEKLIST[index]}
                              >
                                <View
                                  className={`item-content flex ${
                                    item ? 'active' : ''
                                  }`}
                                >
                                  {index === 6
                                    ? (
                                    <View className='week-last'>
                                      <View className='add-score'></View>
                                      <View className='start big'></View>
                                      <View className='start sm'></View>
                                    </View>
                                      )
                                    : (
                                    <View className='start'></View>
                                      )}
                                  <View
                                    className={`integral-score ${
                                      item ? 'active' : ''
                                    }`}
                                  >
                                    +3
                                  </View>
                                </View>
                                <View
                                  className={`name ${item ? 'active' : ''}`}
                                >
                                  {token && item
                                    ? i18n.chain.bannerComponent.collected
                                    : WEEKLIST[index]}
                                </View>
                              </View>
                            );
                          })}
                      </View>
                        )}
                  </View>
                  <View className='sign-btn'>
                    <View
                      className={`sign flex  ${
                        !token || signList[new Date().getDay() - 1]
                          ? 'disable'
                          : ''
                      }`}
                      onClick={() => this.signs()}
                    >
                      {i18n.chain.bannerComponent.signIn}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className='mall-menu'>
            <View
              className='box-banner-left'
              onClick={() => {
                this.goUrl(3);
              }}
            >
              <View className='box-banner-left-title'>
                {i18n.chain.bannerComponent.starPrize}
              </View>
              <View className='box-banner-left-subtitle'>
                {i18n.chain.bannerComponent.drugPurchase}
              </View>
              <View className='box-banner-left-btn'>
                {i18n.chain.bannerComponent.draw}
              </View>
            </View>
            <View
              className='box-banner-right'
              onClick={() => {
                this.goUrl(1);
              }}
            >
              <View className='box-banner-right-title'>
                {i18n.chain.bannerComponent.dailyTasks}
              </View>
              <View className='box-banner-right-subtitle'>
                {i18n.chain.bannerComponent.tasksStar}
              </View>
              <View className='box-banner-right-btn'>
                {i18n.chain.bannerComponent.drawStar}
              </View>
            </View>
          </View>
          <View className='goods-list flex'>
            {products.length > 0 && <HotChange products={products} />}

            <View className='good-content'>
              <View className='good-top'>
                <View className='good-title'>
                  {i18n.chain.starMinePage.allGoods}
                </View>
              </View>
              <View className='goods-list-conter'>
                {this.props.productList.length &&
                  this.props.productList.map(item => {
                    return (
                      <MallItem
                        productInfo={item}
                        key={item.productId}
                      ></MallItem>
                    );
                  })}
              </View>
            </View>
          </View>
        </View>
        {showLoginModal
          ? (
          <LoginModal
            showState={showLoginModal}
            noLogin={() => {
              this.setState({
                showLoginModal: false
              });
            }}
            goLogin={() => {
              this.setState({
                showLoginModal: false
              });
            }}
          ></LoginModal>
            )
          : null}
        {gallfly
          ? (
          <View className='mall-mantle'>
            <View className='mall-mantle-img'>
              <View className='mall-success'>签到成功</View>
              <View
                className='mall-alter-btn'
                onClick={() => {
                  this.setState({ gallfly: false });
                }}
              >
                我知道了
              </View>
            </View>
          </View>
            )
          : null}
      </View>
    );
  }
}
export default Mall;
