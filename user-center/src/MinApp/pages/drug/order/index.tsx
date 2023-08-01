import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import utils from '@utils/index';
import Confirm from '@components/Confirm';
import { IStoreProps } from '@reducers/interface';
import { connect } from 'react-redux';
import { subInfo, productDetail, selectProductList } from '@actions/minApp';
import { GET_SELECT_ADDRESS } from '@constants/service';
import { SET_VISIT_INFO, GET_PRODUCT_DETAIL } from '@constants/minApp';
import { SET_MODAL } from '@constants/common';
import { getAddressList } from '@actions/user';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  getAddressList: Function;
  setVisitInfo: Function;
  setModal: Function;
}
interface IState {
  serviceList: any;
  isShow: boolean;
  productList: any;
  prescription: boolean;
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
    },
    getAddressList () {
      getAddressList().then((res: any) => {
        // 第一个为默认的
        if (res.length && res[0].isDefault) {
          dispatch({
            type: GET_SELECT_ADDRESS,
            payload: res[0]
          });
        } else {
          dispatch({
            type: GET_SELECT_ADDRESS,
            payload: {}
          });
        }
      });
    },
    setVisitInfo (data) {
      dispatch({
        type: SET_VISIT_INFO,
        payload: data
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
class Order extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      serviceList: [],
      isShow: false,
      productList: [],
      prescription: false
    };
  }

  componentDidMount () {
    this.props.getAddressList();
  }

  componentDidShow () {
    if (this.props.service.selectAdddress.provinceId) {
      this.getSelectProductList();
    } else {
      getAddressList().then((res: any) => {
        // 第一个为默认的
        if (res.length && res[0].isDefault) {
          this.getSelectProductList(res[0].provinceId);
        } else {
          this.getSelectProductList(null);
        }
      });
    }
  }

  getSelectProductList (cityId?) {
    const { router } = getCurrentInstance();
    const { serviceRecordId, list } = (router?.params && router.params) || {};
    selectProductList({
      productSaleIdList: JSON.parse(decodeURI(list || '')),
      serviceRecordId: serviceRecordId,
      cityId: cityId || this.props.service.selectAdddress.provinceId
    }).then((res: any) => {
      const prescription = res.filter(item => {
        return item.prescription;
      });
      this.setState({
        productList: res,
        prescription: !!prescription.length
      });
    }).catch(() => {});
  }

  // 判断是否填写完成
  watchDate () {
    // const { prescription } = this.state;
    // const { idCard } = this.props.minApp.visitInfo;
    const { id } = this.props.service.selectAdddress;
    let result = true;
    !id && (result = false);
    // 非处方药
    // if (prescription) {
    //   !idCard && (result = false);
    // }
    return result;
  }

  save () {
    const { prescription } = this.state;

    if (!this.watchDate()) {
      return;
    }
    // 处方药
    if (prescription) {
      this.props.setModal({
        show: true,
        content: '您的就诊信息是否需要同步到健康档案？',
        cancelText: '不用了',
        confirmText: '确认',
        confirmColor: 'linear-gradient(142deg, #7BB4F5 0%, #467DE8 100%)',
        clickConfirm: () => {
          this.confirm();
        },
        clickCancel: () => {
          this.confirm();
        }
      });
      return;
    }
    this.confirm();
  }

  confirm = () => {
    const { router } = getCurrentInstance();
    const { id } = this.props.service.selectAdddress;
    // const { visitInfo } = this.props.minApp;
    const { prescription } = this.state;

    const { serviceRecordId, list } = (router?.params && router.params) || {};
    const params = {
      addressId: id,
      medicineProductIdList: JSON.parse(decodeURI(list || '')),
      serviceRecordId
      // information
    };
    subInfo(params).then((res: any) => {
      this.props.setVisitInfo({});
      if (prescription) {
        Taro.redirectTo({
          url: `/MinApp/pages/drug/orderDetail/index?id=${res.serialNumber}`
        });
      } else {
        Taro.redirectTo({
          url: `/MinApp/pages/drug/success/index?id=${res.serialNumber}`
        });
      }
    }).catch(() => {});
  };

  selectService (index) {
    const { serviceList } = this.state;
    serviceList.forEach(item => {
      item.select = false;
    });
    serviceList[index].select = true;
    this.setState({
      serviceList: this.state.serviceList
    });
  }

  goEditInfo () {
    const { router } = getCurrentInstance();
    Taro.navigateTo({
      url: `/MinApp/pages/drug/info/index?serviceRecordId=${router?.params && router.params
        .serviceRecordId}&list=${router?.params && router.params.list}`
    });
  }

  render () {
    const { isShow, productList } = this.state;
    // const { visitInfo } = this.props.minApp;
    const {
      id,
      provinceName,
      cityName,
      address,
      name: userName,
      mobile
    } = this.props.service.selectAdddress;
    return (
      <Page showBack title='确认订单'>
        <View className='page-order flex'>
          <View className='drug_order-tips flex'>
            依据GSP相关规定，药品一经售出，无质量问题不退不换
          </View>
          <View
            className='address'
            onClick={() => {
              Taro.navigateTo({
                url: '/setting/addressManage/list/index?drug=true'
              });
            }}
          >
            <Image className='next' src={`${ossHost}images/next.png`}></Image>
            <View className='title flex'>
              <Image
                src={`${ossHost}drug_order_add.png`}
                className='icon-image'
              ></Image>
              <Text>收货地址</Text>
            </View>
            <View className='name'>
              <Text>{id ? userName : '暂无收货地址'}</Text>
              {id && <Text className='phone'>{mobile}</Text>}
            </View>
            {id && (
              <View className='address-detail'>
                地址：{provinceName}
                {cityName}
                {address}
              </View>
            )}
          </View>
          <View className='drug-info'>
            <View className='title flex'>
              <Image
                src={`${ossHost}drug_order_info.png`}
                className='icon-image'
              ></Image>
              <Text>商品信息</Text>
            </View>
            {productList.length &&
              productList.map(item => {
                return (
                  <View key={item.id} className='item'>
                    <View className='info flex'>
                      <Image
                        className='img'
                        src={item.headPic && item.headPic[0]}
                      ></Image>
                      <View className='right'>
                        <View className='name'>
                          {item.brandName || ''} {item.name}
                        </View>
                        <View className='no'>{item.authorizedCode}</View>
                        <View className='type'>剂型：{item.dosageForm}</View>
                      </View>
                    </View>
                    <View className='common flex'>
                      <Text className='left' decode>
                        规&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                      </Text>
                      <View className='right'>{item.standard}</View>
                    </View>
                    <View className='common flex'>
                      <View className='left'>购买数量</View>
                      <View className='right'>{item.num}</View>
                    </View>
                    <View className='common flex'>
                      <View className='left'>配送方式</View>
                      <View className='right'>
                        <Text>普通快递</Text>
                        <Text className='money'>¥{item.postage}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
          <View
            className={`confirm flex ${
              this.watchDate() ? '' : 'disable'
            }`}
            onClick={() => {
              this.save();
            }}
          >
            提交订单
          </View>
        </View>
        {
          isShow &&
          (
          <Confirm
            title='提示'
            text='是否确认提交订单？'
            subText='提交后不可修改'
            confirm={() => {
              this.confirm();
            }}
            cancel={() => {
              this.setState({ isShow: false });
            }}
          />
          )}
      </Page>
    );
  }
}
export default Order;
