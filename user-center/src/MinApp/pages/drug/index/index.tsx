import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import TabBar from '@components/drugTabBar';
import LoginModal from '@components/DrugLogin';
import utils from '@utils/index';
import { connect } from 'react-redux';
import {
  SET_PRODUCT_TYPE,
  GET_PRODUCT_LIST,
  GET_ORDER_LIST
} from '@constants/minApp';
import {
  allType,
  typeAllList,
  orderList,
  hasServiceRecord
} from '@actions/minApp';
import { SET_MODAL } from '@constants/common';
import NoLogin from '../../../component/noLogin';
import ServiceList from '../serviceList';
import EmptyBox from '../../../component/emptyBox';
import './index.scss';

const pageSize = 10;
let pageNum = 1;
let loadAll = false;
const { ossHost } = utils.appConfig;
interface IProps {
  getTypeList: Function;
  setTypeList: Function;
  getProductList: Function;
  getOrderList: Function;
  setModal: Function;
}
interface IState {
  status: number;
  showAll: boolean;
  user: any;
  showLoginModal: boolean;
  scrollHeight: number;
  orderScrollHeight: number;
  curIndex: number;
  hasEquityTips: boolean;
  isLogin: boolean;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    // 设置
    setTypeList (data) {
      dispatch({
        type: SET_PRODUCT_TYPE,
        payload: data
      });
    },
    getProductList (data) {
      typeAllList(data).then(res => {
        dispatch({
          type: GET_PRODUCT_LIST,
          payload: res,
          pageNum
        });
        // if (pageSize > res.records.length) {
        //   loadAll = true;
        // }
      });
    },
    getOrderList (data) {
      orderList(data).then((res: any) => {
        dispatch({
          type: GET_ORDER_LIST,
          payload: res.records,
          pageNum
        });
        if (pageSize > res.records.length) {
          loadAll = true;
        }
      });
    },
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class DrugIndex extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      showAll: false,
      user: {},
      showLoginModal: false,
      scrollHeight: 0,
      orderScrollHeight: 0,
      curIndex: 0,
      hasEquityTips: false,
      isLogin: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    // 获取type
    this.getType();
    this.setState({
      status: Number(router?.params && router.params.status) || 0
    });
  }

  componentDidShow () {
    const vm = this;
    const { hasEquityTips } = this.state;
    const { xAccessToken, userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 140 : 96;
        const orderHeight = utils.appConfig.isH5 ? 92 : 48;
        vm.setState({
          scrollHeight: hasEquityTips
            ? windowHeight - ((windowWidth + 36) / 375) * height
            : windowHeight - (windowWidth / 375) * height,
          orderScrollHeight: windowHeight - (windowWidth / 375) * orderHeight
        });
      }
    });
    // 是否登录
    if (Taro.getStorageSync(xAccessToken)) {
      this.setState({
        isLogin: true,
        user
      });
    } else {
      this.setState({
        isLogin: false
      });
    }
    // 是否有权益
    hasServiceRecord().then((res: boolean) => {
      this.setState({
        hasEquityTips: res
      });
    });
    // 已经实名认证
    // if (hasIdCard && token) {
    //   this.getType();
    // } else {
    //   this.setState({
    //     showLoginModal: true
    //   });
    // }
  }

  // 获取type
  async getType () {
    const res = (await allType()) as Array<any>;
    if (!res.length) {
      return;
    }
    res[0].select = true;
    this.props.setTypeList(res);
    this.getProductList();
  }

  // 选择type
  async selectType (index) {
    this.setState({
      curIndex: index
    });
    // 单独处理
    const { productType } = this.props.minApp;
    if (productType[index].select) {
      return;
    }
    productType.forEach(item => {
      item.select = false;
    });
    // if (index < 3) {
    productType[index].select = true;
    // } else {
    //   let navBarList = [];
    //   let delNumber = 3;
    //   index < productType.length - 3 &&
    //     (delNumber = productType.length - 1 - index);
    //   navBarList = productType.splice(index, delNumber);
    //   productType = navBarList.concat(productType);
    //   productType[0].select = true;
    //   this.setState({
    //     showAll: false
    //   });
    // }
    await this.props.setTypeList([...productType]);
    this.getProductList();
  }

  getProductList () {
    const { router } = getCurrentInstance();
    const { productType } = this.props.minApp;
    const selectType = productType.filter(item => {
      return item.select === true;
    });
    const params: any = {
      typeId: selectType[0].typeId
    };
    router?.params && router.params.serviceRecordId &&
      (params.serviceRecordId = router?.params && router.params.serviceRecordId);
    this.props.getProductList(params);
  }

  tolower () {
    // if (loadAll) {
    //   return;
    // }
    // pageNum++;
    // this.getProductList();
  }

  getOrderList () {
    if (!this.state.isLogin) {
      return;
    }
    const params = {
      pageSize,
      pageNum
    };
    this.props.getOrderList(params);
  }

  toOrderLower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getOrderList();
  }

  selectTab (index) {
    const { status } = this.state;
    if (status !== index) {
      pageNum = 1;
      loadAll = false;
      index === 0 && this.getProductList();
      index === 2 && this.getOrderList();
      this.setState(
        {
          status: index
        },
        () => {
          Taro.setNavigationBarTitle({
            title: this.getPageTitle()
          });
        }
      );
    }
  }

  getPageTitle () {
    const { status } = this.state;
    let text = i18n.chain.common.title;
    status === 1 && (text = i18n.chain.drug.rights);
    status === 2 && (text = i18n.chain.drug.order);
    status === 3 && (text = i18n.chain.tabBar.my);
    return text;
  }

  setShowAll () {
    const { showAll } = this.state;
    this.setState({
      showAll: !showAll
    });
  }

  exit () {
    this.props.setModal({
      show: true,
      content: i18n.chain.user.logoutSure,
      cancelText: i18n.chain.button.exit,
      confirmText: i18n.chain.button.cancel,
      confirmColor: 'linear-gradient(142deg, #7BB4F5 0%, #467DE8 100%)',
      cancelColor: 'linear-gradient(180deg, #E9E5E5 0%, #CCCCCC 100%)',
      clickCancel: () => {
        const { userInfo, weixinUserInfo, xAccessToken } = utils.appConfig;
        Taro.removeStorageSync(userInfo);
        Taro.removeStorageSync(weixinUserInfo);
        Taro.removeStorageSync(xAccessToken);
        // this.props.setTypeList([]);
        this.setState({
          isLogin: false,
          status: 3,
          user: {}
        });
      },
      clickConfirm: () => {
        // do something
      }
    });
  }

  hideLoginModal () {
    const vm = this;
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    vm.setState({
      showLoginModal: false,
      user,
      isLogin: true
    });
    this.getType();
  }

  go (url) {
    // 是否登录
    if (!this.state.isLogin) {
      this.goLogin();
      return;
    }
    Taro.navigateTo({
      url
    });
  }

  close = () => {
    this.setState({
      showLoginModal: false
    });
  };

  watchList () {
    // eslint-disable-next-line no-shadow
    const { productList, orderList } = this.props.minApp;
    return {
      product: !productList.length,
      order: !orderList.length
    };
  }

  // 使用权益
  useEquity () {
    const { hasEquityTips } = this.state;
    if (hasEquityTips) {
      this.setState({
        status: 1
      });
    } else {
      Taro.navigateTo({
        url: '/pages/user/service/exchange/index'
      });
    }
  }

  // 去登录
  goLogin () {
    this.setState({
      showLoginModal: true
    });
  }

  render () {
    const {
      status,
      curIndex,
      user,
      showLoginModal,
      scrollHeight,
      orderScrollHeight,
      hasEquityTips,
      isLogin
    } = this.state;
    const tab = [
      {
        icon: `${ossHost}drug_tab1.png`,
        activeIcon: `${ossHost}drug_tab_active1.png`,
        text: i18n.chain.tabBar.home
      },
      {
        icon: `${ossHost}drug_tab4.png`,
        activeIcon: `${ossHost}drug_tab_active4.png`,
        text: i18n.chain.drug.rights
      },
      {
        icon: `${ossHost}drug_tab2.png`,
        activeIcon: `${ossHost}drug_tab_active2.png`,
        text: i18n.chain.drug.order
      },
      {
        icon: `${ossHost}drug_tab3.png`,
        activeIcon: `${ossHost}drug_tab_active3.png`,
        text: i18n.chain.tabBar.my
      }
    ];
    // eslint-disable-next-line no-shadow
    const { productType, productList, orderList } = this.props.minApp;
    return (
      <Page showBack title={this.getPageTitle()} >
        {showLoginModal && (
          <LoginModal
            login={() => {
              this.hideLoginModal();
            }}
            showState={showLoginModal}
            close={this.close}
            isImproveInfo
          ></LoginModal>
        )}
        <View className='page-drug-index flex'>
          <View className='content'>
            {status === 0
              ? (
              <View className='content-1'>
                <View className='page-title'>
                  <View className='tab-list'>
                    {productType &&
                      productType.length &&
                      productType.map((item, index) => {
                        return (
                          <View
                            className={`tab-item flex ${
                              curIndex === index ? 'active' : ''
                            }`}
                            key={item.typeId}
                            onClick={() => {
                              this.selectType(index);
                            }}
                          >
                            <Text>{item.typeName}</Text>
                            {curIndex === index && (
                              <View className='line'></View>
                            )}
                          </View>
                        );
                      })}
                  </View>
                </View>

                <ScrollView
                  scrollY
                  style={{ height: `${scrollHeight}px` }}
                  onScrollToLower={this.tolower.bind(this)}
                >
                  {isLogin
                    ? (
                    <View
                      className='drug-tips'
                      onClick={this.useEquity.bind(this)}
                    >
                      {hasEquityTips
                        ? i18n.chain.drug.drugTips1
                        : i18n.chain.drug.drugTips2}
                    </View>
                      )
                    : null}
                  {productList && productList.length
                    ? (
                    <View
                      className={`drug-list flex ${
                        this.watchList().product ? 'none' : ''
                      }`}
                    >
                      {productList &&
                        productList.length &&
                        productList.map(item => {
                          return (
                            <View
                              className='drug-item'
                              key={item.id}
                              onClick={() => {
                                Taro.navigateTo({
                                  url: `/MinApp/pages/drug/detail/index?id=${item.id}`
                                });
                              }}
                            >
                              <View
                                className={`tag flex ${
                                  item.prescription ? '' : 'otc'
                                }`}
                              >
                                {item.prescription ? 'Rx' : 'OTC'}
                              </View>
                              <Image
                                className='drug-img'
                                src={item.headPic ? item.headPic[0] : ''}
                              ></Image>
                              <View className='drug-name'>
                                {item.brandName || ''} {item.name}
                              </View>
                              <View className='specs'>{item.standard}</View>
                            </View>
                          );
                        })}
                    </View>
                      )
                    : null}
                  {productList && productList.length === 0 && (
                    <EmptyBox title={i18n.chain.drug.soldOut} drug></EmptyBox>
                  )}
                </ScrollView>
              </View>
                )
              : null}
            {status === 1
              ? (
                  isLogin
                    ? (
                <ServiceList></ServiceList>
                      )
                    : (
                <NoLogin
                  tips={i18n.chain.drug.loginCheckRights}
                  goLogin={() => { this.goLogin(); }}
                ></NoLogin>
                      )
                )
              : null}
            {status === 2
              ? (
                  isLogin
                    ? (
                <View className='content-2'>
                  <ScrollView
                    scrollY
                    style={{ height: `${orderScrollHeight}px` }}
                    onScrollToLower={this.toOrderLower.bind(this)}
                  >
                    <View
                      className={`order-list flex ${
                        this.watchList().order ? 'none' : ''
                      }`}
                    >
                      {orderList && orderList.length
                        ? (
                            orderList.map(item => {
                              return (
                            <View
                              className='order-item'
                              key={item.orderId}
                              onClick={() => {
                                Taro.navigateTo({
                                  url: `/MinApp/pages/drug/orderDetail/index?id=${item.orderId}`
                                });
                              }}
                            >
                              <View className='order-top'>
                                <View className='info flex'>
                                  <Image
                                    className='left'
                                    src={
                                      item.medicineProductVOList[0].headPic[0]
                                    }
                                  ></Image>
                                  <View className='right'>
                                    <View className='name flex'>
                                      {item.medicineProductVOList[0].brandName}
                                      {item.medicineProductVOList[0].name}
                                    </View>
                                    <View className='order-type flex'>
                                      <View className='no'>
                                        {
                                          item.medicineProductVOList[0]
                                            .authorizedCode
                                        }
                                      </View>
                                      <View className='type'>
                                        剂型：
                                        {
                                          item.medicineProductVOList[0]
                                            .dosageForm
                                        }
                                      </View>
                                    </View>
                                    <View className='order-specs-box'>
                                      <View className='order-specs flex'>
                                        <Text
                                          className='order-specs-left'
                                          decode
                                        >
                                          规&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                                        </Text>
                                        <Text className='order-specs-right'>
                                          {
                                            item.medicineProductVOList[0]
                                              .standard
                                          }
                                        </Text>
                                      </View>
                                      <View className='order-specs-number'>
                                        ×{item.medicineProductVOList[0].num}
                                      </View>
                                    </View>
                                    <View className='order-bottom flex'>
                                      {item.orderState === 2 && (
                                        <View className='order-bottom-tag order-bottom0'>
                                          {utils.orderStatus(
                                            item.orderState
                                          )}
                                        </View>
                                      )}
                                      {item.orderState === 1 && (
                                        <View className='order-bottom-tag order-bottom1'>
                                          {utils.orderStatus(
                                            item.orderState
                                          )}
                                        </View>
                                      )}
                                      {item.orderState === 3 && (
                                        <View className='order-bottom-tag order-bottom3'>
                                          {utils.orderStatus(
                                            item.orderState
                                          )}
                                        </View>
                                      )}
                                      {item.orderState === 4 && (
                                        <View className='order-bottom-tag order-bottom4'>
                                          {utils.orderStatus(
                                            item.orderState
                                          )}
                                        </View>
                                      )}
                                      {item.orderState === 5 && (
                                        <View className='order-bottom-tag order-bottom5'>
                                          {utils.orderStatus(
                                            item.orderState
                                          )}
                                        </View>
                                      )}
                                      <Image
                                        className='order-view-detail'
                                        src={`${ossHost}order_view.png`}
                                      ></Image>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                              );
                            })
                          )
                        : (
                        <EmptyBox
                          drug={false}
                          showBtn
                          btnText={i18n.chain.drug.toBuy}
                          title={i18n.chain.drug.noOrder}
                          url='/MinApp/pages/drug/index/index'
                        ></EmptyBox>
                          )}
                    </View>
                  </ScrollView>
                </View>
                      )
                    : (
                <NoLogin
                  tips={i18n.chain.drug.loginCheckOrder}
                  goLogin={this.goLogin.bind(this)}
                ></NoLogin>
                      )
                )
              : null}
            {status === 3
              ? (
              <View className='content-3'>
                <View className='user'>
                  <View className='user-info flex'>
                    <View className='left flex'>
                      <View className='head-content flex'>
                        {isLogin
                          ? (
                          <Image
                            className='hade-image'
                            src={user.avatarUrl}
                          ></Image>
                            )
                          : (
                          <Image
                            className='hade-image'
                            src={`${ossHost}admin-avatarUrl.png`}
                          ></Image>
                            )}
                      </View>
                      <View className='text flex'>
                        {isLogin ? <View className='hello'>Hi</View> : null}
                        <Text>
                          {isLogin
                            ? utils.hidePhone(user.mobile)
                            : i18n.chain.drug.unlockMore}
                        </Text>
                      </View>
                    </View>
                    {isLogin
                      ? (
                      <View
                        className='right'
                        onClick={() => {
                          this.exit();
                        }}
                      >
                        {i18n.chain.button.exit}
                      </View>
                        )
                      : (
                      <View className='right' onClick={this.goLogin.bind(this)}>
                        {i18n.chain.loginPage.login}
                      </View>
                        )}
                  </View>
                </View>

                <View
                  className='action-item'
                  onClick={this.go.bind(
                    this,
                    '/setting/addressManage/list/index?noSelect=true&drug=true'
                  )}
                >
                  <View className='action-item-content flex'>
                    <View className='label flex'>
                      <Image className='icon-img' src={`${ossHost}images/user_address.png`}></Image>
                      <Text>{i18n.chain.user.addressManagement}</Text>
                    </View>
                    <Image className='next' src={`${ossHost}images/next.png`}></Image>
                  </View>
                </View>
              </View>
                )
              : null}
          </View>
          <TabBar
            tab={tab}
            activeIndex={status}
            select={this.selectTab.bind(this)}
          ></TabBar>
        </View>
      </Page>
    );
  }
}
export default DrugIndex;
