import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { getAddressList, setDefaultAddress, delAddress } from '@actions/user';
import { GET_SELECT_ADDRESS } from '@constants/service';
import { SET_MODAL } from '@constants/common';
import {
  GET_ADDRESS_LIST,
  SET_DEFAULT_ADDRESS,
  EDIT_ADDRESS_INFO
} from '@constants/user';
import { connect } from 'react-redux';
import { IStoreProps } from '@reducers/interface';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getAddressList: Function;
  setDefaultAddress: Function;
  editAddress: Function;
  selectAddress: Function;
  setModal: Function;
}

type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getAddressList () {
      getAddressList().then(res => {
        dispatch({
          type: GET_ADDRESS_LIST,
          payload: res || []
        });
      });
    },
    setDefaultAddress (index) {
      dispatch({
        type: SET_DEFAULT_ADDRESS,
        payload: index
      });
    },
    editAddress (item) {
      dispatch({
        type: EDIT_ADDRESS_INFO,
        payload: item
      });
    },
    selectAddress (item) {
      dispatch({
        type: GET_SELECT_ADDRESS,
        payload: item
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
class AddressList extends Component<PropsType> {
  componentDidShow () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.addressManagement });
    this.props.getAddressList();
  }

  // 设置默认地址
  setDefault (index) {
    const { id } = this.props.user.addressList[index];
    setDefaultAddress({
      addressId: id
    }).then(() => {
      this.props.setDefaultAddress(index);
    });
  }

  render () {
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={i18n.chain.user.addressManagement}>
        <View
          className={`page-address-list ${
            router?.params && router.params.drug ? 'drug' : ''
          }`}
        >
          <View className='tips'>
            {i18n.chain.addressManage.tip}
          </View>
          {
            this.props.user.addressList.length
              ? (
                  this.props.user.addressList.map((item, index) => {
                    const {
                      name,
                      mobile,
                      provinceName,
                      cityName,
                      address,
                      isDefault,
                      districtName
                    } = item;
                    return (
              <View
                className='address-item'
                key={item.id}
                onClick={() => {
                  if (router?.params && router.params.noSelect) {
                    return;
                  }
                  this.props.selectAddress(item);
                  Taro.navigateBack({
                    delta: 1
                  });
                }}
              >
                <View className='top flex'>
                  <View className='info flex'>
                    <View className='name'>{i18n.chain.addressManage.consignee}{name}</View>
                    <View className='phone'>{mobile}</View>
                  </View>
                  <View className='address'>
                    {i18n.chain.addressManage.address}{provinceName}
                    {cityName}
                    {districtName || ''}
                    {address}
                  </View>
                </View>
                <View className='bottom flex'>
                  <View className='bottom-content flex'>
                    <View
                      className='left flex'
                      onClick={e => {
                        e.stopPropagation();
                        this.setDefault(index);
                      }}
                    >
                      <View
                        className={`select flex ${isDefault ? 'active' : ''}`}
                      >
                        {/* <Image src={selectIcon} className='icon-select'></Image> */}
                        {isDefault
                          ? (
                          <View className='icon-select'></View>
                            )
                          : null}
                      </View>
                      <Text>{i18n.chain.addressManage.default}</Text>
                    </View>
                    <View className='right flex'>
                      <View
                        className='item flex'
                        onClick={e => {
                          e.stopPropagation();
                          this.props.editAddress({ ...item });
                          Taro.navigateTo({
                            url: `/setting/addressManage/detail/index?id=${
                              item.id
                            }&drug=${!!(router?.params && router.params.drug) || ''}`
                          });
                        }}
                      >
                        <Image src={`${ossHost}images/edit.png`} className='icon-img'></Image>
                        <Text>{i18n.chain.addressManage.edit}</Text>
                      </View>
                      <View
                        className='item flex'
                        onClick={e => {
                          e.stopPropagation();
                          const vm = this;
                          this.props.setModal({
                            show: true,
                            content: i18n.chain.addressManage.sureDel,
                            clickConfirm: () => {
                              // 如果删除的是默认地址 取消上一页的默认选中
                              delAddress({ addressId: item.id }).then(() => {
                                vm.props.getAddressList();
                                if (
                                  vm.props.service.selectAdddress.id &&
                                  item.id ===
                                    vm.props.service.selectAdddress.id
                                ) {
                                  item.id = '';
                                  vm.props.selectAddress({});
                                }
                              });
                            }
                          });
                        }}
                      >
                        <Image src={`${ossHost}images/address_del.png`} className='icon-img'></Image>
                        <Text>{i18n.chain.button.delete}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
                    );
                  })
                )
              : (
            <View className='empty flex'>
              <View className='img'></View>
              <Text>{i18n.chain.addressManage.noData}</Text>
            </View>
                )}
          <View
            className='add flex'
            onClick={() => {
              Taro.navigateTo({
                url: `/setting/addressManage/detail/index?drug=${!!(router?.params && router.params.drug) || ''}`
              });
            }}
          >
            {i18n.chain.addressManage.add}
          </View>
        </View>
      </Page>
    );
  }
}
export default AddressList;
