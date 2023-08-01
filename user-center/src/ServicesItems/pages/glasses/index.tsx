
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import { getAddressList } from '@actions/user';
import { GET_SELECT_ADDRESS } from '@constants/service';
import { getProductSpecifications, getPhysicalGoods } from '@actions/serviceItem';
import { IStoreProps } from '@reducers/interface';
import './index.scss';

interface IProps {
  getAddressList: Function;
}

interface IState {
  showModal: boolean;
  productId: string;
  physicalGoodsRecordId: string;
  specifications: Array<any>;
}
type PropsType = IStoreProps & IProps;
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
        } else {
          dispatch({
            type: GET_SELECT_ADDRESS,
            payload: {}
          });
        }
      });
    }
  })
)
class Glasses extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      productId: '',
      physicalGoodsRecordId: '',
      specifications: []
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getAddressList();
    getProductSpecifications({
      serviceRecordId: router?.params ? router.params.serviceRecordId : ''
    }).then((res:any) => {
      res.forEach(item => {
        item.check = false;
      });
      this.setState({
        specifications: res
      });
    });
  }

  changeModal (bol) {
    this.setState({
      showModal: bol
    });
  }

  save (id) {
    const { router } = getCurrentInstance();
    if (!this.state.productId) {
      return;
    }
    const params = {
      addressId: id,
      productSpecificationId: this.state.productId,
      serviceRecordId: router?.params && router.params.serviceRecordId
    };
    getPhysicalGoods(params).then((res:any) => {
      this.setState({
        showModal: true,
        physicalGoodsRecordId: res.id
      });
    });
  }

  checkProduct (id, index) {
    const specifications = this.state.specifications;
    specifications.forEach(item => {
      item.check = false;
    });
    specifications[index].check = true;
    this.setState({
      productId: id,
      specifications
    });
  }

  render () {
    const { showModal, specifications } = this.state;
    const {
      id,
      provinceName,
      cityName,
      address,
      name: userName,
      mobile
    } = this.props.service.selectAdddress;
    return (
      <Page showBack title='填写基本信息'>
        <View className='page-glasses flex'>
          <View className='page-glasses-content'>
            <View
              className='address'
              onClick={() => {
                Taro.navigateTo({
                  url: '/setting/addressManage/list/index'
                });
              }}
            >
              <View className='address-title'>
                <Text className='address-title-text'>收货地址</Text>
              </View>
              <View className='address-people'>
                <Text className='people-name'>
                  {id ? userName : '暂无收货地址'}
                </Text>
                {id && <Text>{mobile}</Text>}
              </View>
              {id && (
                <View className='address-detail'>
                  地址：{provinceName}
                  {cityName}
                  {address}
                </View>
              )}
            </View>
            <View className='select-product'>
              <View className='select-title'>选择商品规格</View>
              <View className='product-list flex'>
                {specifications.map((item, index) => {
                  return (
                    <View
                      key={item.id}
                      className={
                        item.check
                          ? 'product-item flex active'
                          : 'product-item flex'
                      }
                      onClick={this.checkProduct.bind(this, item.id, index)}
                    >
                      {item.specifications}
                    </View>
                  );
                })}
                {/* <View className="product-item active" onClick={this.checkProduct.bind(this)}>150度适合45岁左右</View>
                            <View className="product-item">150度适合45岁左右</View> */}
              </View>
            </View>
          </View>
          <View className='submit' onClick={this.save.bind(this, id)}>
            提交
          </View>
          {/* 弹框 */}
          {showModal
            ? (
            <View className='submit-modal'>
              <View className='modal-center'>
                <View className='modal-content'>
                  <Text className='content-text'>提交成功!</Text>
                  <View
                    className='olderDetail'
                    onClick={() => {
                      Taro.redirectTo({
                        url: `/ServicesItems/pages/glasses/detail/index?id=${this.state.physicalGoodsRecordId}`
                      });
                    }}
                  >
                    查看订单详情
                  </View>
                </View>
                <View
                  className='close'
                  onClick={this.changeModal.bind(this, false)}
                ></View>
              </View>
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default Glasses;
