import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import utils from '@utils/index';
import { connect } from 'react-redux';
import { GET_PRODUCT_DETAIL } from '@constants/minApp';
import { productDetail, hasServiceRecord } from '@actions/minApp';
import { IStoreProps } from '@reducers/interface';
import DrugLogin from '@components/DrugLogin';
import Page from '@components/page';
import Modal from './modal';
import DrugLoginModal from '../../../component/drugLoginModal';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getProductDetail: Function;
}
interface IState {
  currentIndex: number;
  showModal: boolean;
  isLogin: boolean;
  drugLoginModal: boolean;
  showLoginModal: boolean;
  hasService: boolean;
}

type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getProductDetail (data) {
      productDetail(data).then((res: any) => {
        // 根据id匹配
        const { id, specifications } = res;
        specifications.forEach(item => {
          item.productId === id && (item.select = true);
        });
        dispatch({
          type: GET_PRODUCT_DETAIL,
          payload: res
        });
      });
    }
  })
)
class DrugDetail extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      currentIndex: 0,
      showModal: false,
      isLogin: false, // 是否登录
      drugLoginModal: false, // 提示登录弹窗
      showLoginModal: false, // 登录弹窗
      hasService: false // 是否有权益
    };
  }

  static options = {
    addGlobalClass: true
  };

  componentDidShow () {
    this.getDetail();
    const { xAccessToken } = utils.appConfig;
    if (Taro.getStorageSync(xAccessToken)) {
      this.setState(
        {
          isLogin: true
        },
        () => {
          this.hasService();
        }
      );
    } else {
      this.setState({
        isLogin: false
      });
    }
  }

  // 获取用户是否有权益
  hasService () {
    hasServiceRecord().then((res: boolean) => {
      this.setState({
        hasService: res
      });
    });
  }

  getDetail (id = '') {
    const { router } = getCurrentInstance();
    const params: any = {
      productId: id || (router?.params && router.params.id)
    };
    this.props.getProductDetail(params);
  }

  setModal () {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  swiperWatch (e) {
    const { currentIndex } = this.state;
    if (e.detail.current === undefined || e.detail.current === currentIndex) {
      return;
    }
    this.setState({
      currentIndex: e.detail.current
    });
  }

  // 提示登录
  goLogin () {
    this.setState({
      drugLoginModal: true
    });
  }

  // 取消登录
  noLogin (show) {
    this.setState({
      drugLoginModal: show
    });
  }

  // 登录弹窗
  showLoginModal () {
    this.setState({
      showLoginModal: true,
      drugLoginModal: false
    });
  }

  hideLoginModal () {
    const vm = this;
    vm.setState(
      {
        showLoginModal: false,
        isLogin: true
      },
      () => {
        this.hasService();
      }
    );
  }

  close = () => {
    this.setState({
      showLoginModal: false
    });
  };

  toBug () {
    const { hasService } = this.state;
    if (!hasService) {
      return;
    }
    // 跳转到选择权益
    Taro.navigateTo({
      url: '/MinApp/pages/drug/index/index?status=1'
    });
  }

  render () {
    // eslint-disable-next-line no-shadow
    const { productDetail } = this.props.minApp;
    const {
      headPic,
      prescription,
      name,
      brandName,
      authorizedCode,
      standard,
      manualPic,
      dosageForm,
      manufacturer,
      validMonth,
      weight,
      applicableDiseases
    } = productDetail;
    const {
      currentIndex,
      showModal,
      isLogin,
      drugLoginModal,
      showLoginModal,
      hasService
    } = this.state;
    const { router } = getCurrentInstance();
    return (
      <Page showBack title='商品详情'>
        <View className='page-drug-detail flex'>
          {showModal && (
            <Modal
              serviceRecordId={(router?.params && router.params.serviceRecordId) || ''}
              close={() => {
                this.setModal();
              }}
              refresh={id => {
                this.getDetail(id);
              }}
            ></Modal>
          )}
          {drugLoginModal && (
            <DrugLoginModal
              showState={drugLoginModal}
              noLogin={this.noLogin.bind(this, false)}
              showLoginModal={this.showLoginModal.bind(this)}
            ></DrugLoginModal>
          )}
          {showLoginModal && (
            <DrugLogin
              login={() => {
                this.hideLoginModal();
              }}
              showState={showLoginModal}
              close={this.close}
              isImproveInfo
            ></DrugLogin>
          )}
          <View className='content'>
            <View className='img-list drug-detail-pic'>
              <Swiper
                className='swiper-content'
                // indicatorDots
                // indicatorColor="rgba(70, 125, 232, 0.3)"
                // indicatorActiveColor="#467DE8"
                autoplay
                circular
                interval={5000}
                onAnimationFinish={this.swiperWatch.bind(this)}
              >
                {headPic &&
                  headPic.length &&
                  headPic.map(item => {
                    return (
                      <SwiperItem className='swiper-item flex' key={item}>
                        <Image className='image' src={item}></Image>
                      </SwiperItem>
                    );
                  })}
              </Swiper>
              <View className='dots-box'>
                {headPic &&
                  headPic.length &&
                  headPic.map((item, index) => {
                    return (
                      <View
                        className={`dots ${
                          currentIndex === index ? 'active' : ''
                        }`}
                        key={item}
                      ></View>
                    );
                  })}
              </View>
            </View>
            <View className='name'>
              <View className='name-top flex'>
                <Text>
                  {brandName || ''} {name || ''}
                </Text>
                <View className={`tag flex ${prescription ? '' : 'otc'}`}>
                  {prescription ? 'Rx' : 'OTC'}
                </View>
              </View>
              <View className='disease'>1、{applicableDiseases}</View>
              <View className='tips flex'>
                <Image src={`${ossHost}images/warn.png`} className='warn'></Image>
                <Text>风险提示：处方药须凭处方在执业药师指导下购买和使用</Text>
              </View>
            </View>
            <View className='info'>
              <View className='info-title'>规格参数</View>
              <View className='common-item flex'>
                <View className='label'>批准文号</View>
                <Text>{authorizedCode}</Text>
              </View>
              <View className='common-item flex'>
                <Text className='label' decode>
                  规&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                </Text>
                <Text>{standard}</Text>
              </View>
              <View className='common-item flex'>
                <Text className='label' decode>
                  剂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
                </Text>
                <Text>{dosageForm}</Text>
              </View>
              <View className='common-item flex'>
                <View className='label'>生产厂家</View>
                <Text>{manufacturer}</Text>
              </View>
              <View className='common-item flex'>
                <Text className='label' decode>
                  有&nbsp;&nbsp;效&nbsp;期
                </Text>
                <Text>{validMonth}</Text>
              </View>
              <View className='common-item flex'>
                <Text className='label' decode>
                  重 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量
                </Text>
                <Text>{weight}</Text>
              </View>
            </View>
            <View className='imgs'>
              <View className='drug-detail-info'>包装说明书</View>
              <View className='img-item flex'>
                <Image
                  className='manualPic'
                  src={manualPic}
                  mode='widthFix'
                ></Image>
              </View>
            </View>
          </View>
          <View className='drug-detail-btn flex'>
            {isLogin
              ? (
              <View
                className={`bottom flex ${hasService ? '' : 'disable'}`}
                onClick={() => {
                  this.toBug();
                }}
              >
                {hasService ? '去选择想要使用的权益' : '您暂无权益购买'}
              </View>
                )
              : (
              <View
                className='bottom flex'
                onClick={() => {
                  this.goLogin();
                }}
              >
                登录后查看权益
              </View>
                )}
          </View>
        </View>
      </Page>
    );
  }
}
export default DrugDetail;
