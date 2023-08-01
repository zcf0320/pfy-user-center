import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  View,
  Image,
  Text,
  Picker,
  Textarea,
  Switch,
  Input
} from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { addAddress } from '@actions/user';
import { getAllProvice } from '@actions/common';
import {
  SET_ALLPROVICE_PICK_ARR,
  GET_ALLPROVICE_LIST,
  SET_DISTRICTS
} from '@constants/user';
import { connect } from 'react-redux';
import { IStoreProps } from '@reducers/interface';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getAllProviceList: Function;
  setCities: Function;
  setDistricts: Function;
}
interface IState {
  title: string;
  name: string;
  mobile: string;
  provinceId: number | string;
  cityId: number | string;
  districtId: number | string;
  districtName: string;
  address: string;
  isDefault: boolean;
  cityName: string;
  provinceName: string;
  multiIndex: number[];
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    setCities (val) {
      dispatch({
        type: SET_ALLPROVICE_PICK_ARR,
        payload: val
      });
    },
    setDistricts (val) {
      dispatch({
        type: SET_DISTRICTS,
        payload: val
      });
    },
    getAllProviceList () {
      return new Promise(resolve => {
        getAllProvice().then((res: any) => {
          res.forEach(item => {
            item.label = item.provinceName;
            item.cities.forEach(cItem => {
              cItem.label = cItem.cityName;
              cItem.districts.forEach(dItem => {
                dItem.label = dItem.districtName;
              });
            });
          });
          // 全部的省市
          dispatch({
            type: GET_ALLPROVICE_LIST,
            payload: res
          });
          // 获取选择器的数据
          dispatch({
            type: SET_ALLPROVICE_PICK_ARR,
            payload: 0
          });
          dispatch({
            type: SET_DISTRICTS,
            payload: 0
          });
          resolve(res);
        });
      });
    }
  })
)
class AddressDetail extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      title: i18n.chain.addressManage.addAddress,
      name: '',
      mobile: '',
      provinceId: '',
      address: '',
      cityId: '',
      provinceName: '',
      cityName: '',
      isDefault: false,
      districtId: '',
      districtName: '',
      multiIndex: [0, 0, 0]
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const vm = this;
    if (router?.params && router.params.id) {
      Taro.setNavigationBarTitle({
        title: i18n.chain.addressManage.editAddress
      });
      const {
        name,
        mobile,
        address,
        isDefault,
        cityId,
        provinceId,
        provinceName,
        cityName,
        districtId,
        districtName
      } = this.props.user.editAddressInfo || {};
      this.props.getAllProviceList().then(() => {
        let selectProviceIndex = 0;
        const proviceList = vm.props.user.allProvicePickArr[0];

        const selectProvice =
          proviceList &&
          proviceList.filter((item, index) => {
            if (item.provinceId === provinceId) {
              selectProviceIndex = index;
            }
            return item.provinceId === provinceId;
          });
        if (selectProvice && selectProvice.length) {
          const { cities } = selectProvice[0];
          let selectCityIndex = 0;
          const selectCity = cities.filter((item, index) => {
            item.cityId === cityId && (selectCityIndex = index);
            return item.cityId === cityId;
          });
          if (selectCity.length) {
            vm.props.setCities(selectProviceIndex);
            vm.props.setDistricts(selectCityIndex);
            let districtIndex = 0;
            if (districtId) {
              selectCity[0].districts.forEach(
                (item, index) => {
                  item.districtId === districtId && (districtIndex = index);
                });
              // vm.props.setDistricts(selectCityIndex)
            }
            vm.setState({
              multiIndex: [selectProviceIndex, selectCityIndex, districtIndex]
            });
          }
        }
      });
      this.setState({
        title: i18n.chain.addressManage.editAddress,
        name,
        mobile,
        address,
        isDefault,
        provinceName,
        cityName,
        provinceId,
        cityId,
        districtId,
        districtName
      });
    } else {
      this.props.getAllProviceList().then(async () => {
        // do something
      });
    }
  }

  // 省份改变
  onProviceChange (e) {
    const { value } = e.detail;
    const {
      provinceId,
      label: provinceName
    } = this.props.user.allProvicePickArr[0][value[0]];
    const { cityId, label } = this.props.user.allProvicePickArr[1][value[1]];
    let districtId = '';
    let districtName = '';
    if (this.props.user.allProvicePickArr[2].length > 0) {
      districtId = this.props.user.allProvicePickArr[2][value[2]].districtId;
      districtName = this.props.user.allProvicePickArr[2][value[2]].districtName;
    }
    if (districtId && (districtId === this.state.districtId)) {
      return;
    }
    this.setState({
      cityId,
      provinceName,
      provinceId,
      cityName: label,
      multiIndex: value,
      districtId,
      districtName
    });
  }

  // // 更改城市
  columnChange (e) {
    const multiIndex = this.state.multiIndex;
    const { column, value } = e.detail;
    if (column === 0) {
      this.props.setCities(value);
      this.props.setDistricts(0);
      this.setState({
        multiIndex: [value, 0, 0]
      });
    }
    if (column === 1) {
      this.props.setDistricts(value);
      this.setState({
        multiIndex: [multiIndex[0], value, 0]
      });
    }

    // !column && this.props.setDistricts(value)
  }

  save () {
    const { router } = getCurrentInstance();
    if (!this.watchData()) {
      return;
    }
    const {
      name,
      mobile,
      address,
      provinceId,
      isDefault,
      cityId,
      districtId
    } = this.state;
    const params: any = {
      cityId,
      name,
      mobile,
      address,
      provinceId,
      isDefault,
      districtId
    };
    router?.params && router.params.id && (params.id = router?.params && router.params.id);
    addAddress(params).then(() => {
      Taro.navigateBack({
        delta: 1
      });
    });
  }

  watchData () {
    const {
      address,
      provinceId,
      cityId,
      name,
      mobile
    } = this.state;
    return (
      address &&
      provinceId &&
      cityId &&
      name &&
      mobile.length === 11
    );
  }

  render () {
    const {
      title,
      name,
      mobile,
      address,
      provinceName,
      cityName,
      isDefault,
      districtName
    } = this.state;
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={title}>
        <View
          className={`page-address-detail ${
            router?.params && router.params.drug ? 'drug' : ''
          }`}
        >
          <View className='content'>
            <View className='item flex'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.addressManage.consignee}</View>
                <Input
                  className='input'
                  type='text'
                  value={name}
                  placeholder={i18n.chain.addressManage.inputName}
                  placeholderClass='placeholder'
                  onInput={e => {
                    this.setState({
                      name: e.detail.value
                    });
                  }}
                ></Input>
                {/* <Text>{name}</Text> */}
              </View>
              <View className='right'></View>
            </View>
            <View className='item flex'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.addressManage.phone}</View>
                <Input
                  className='input'
                  type='number'
                  placeholder={i18n.chain.addressManage.inputPhone}
                  placeholderClass='placeholder'
                  maxlength={11}
                  value={mobile}
                  onInput={e => {
                    this.setState({
                      mobile: e.detail.value
                    });
                  }}
                ></Input>
              </View>
              <View className='right'></View>
            </View>
            <View className='item flex'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.addressManage.location}</View>
                <Picker
                  mode='multiSelector'
                  className='picker'
                  range={this.props.user.allProvicePickArr}
                  rangeKey='label'
                  onChange={this.onProviceChange.bind(this)}
                  onColumnChange={this.columnChange.bind(this)}
                  range-key='label'
                  value={this.state.multiIndex}
                >
                  {this.state.cityId
                    ? (
                    <View className='address'>
                      <Text className='province-name'>{provinceName}</Text>
                      <Text className='province-name'>{cityName}</Text>
                      {districtName || ''}
                    </View>
                      )
                    : (
                    <View className='placeholder address'>{i18n.chain.addressManage.select}</View>
                      )}
                </Picker>
              </View>
              <View className='right'>
                <Image src={`${ossHost}images/next.png`} className='next'></Image>
              </View>
            </View>
            <View className='item flex detail-address'>
              <View className='left flex address-detail'>
                <View className='label'>{i18n.chain.addressManage.addressDetail}</View>
              </View>
              <View className='right'>
                <Textarea
                  className='textarea'
                  placeholderClass='placeholder'
                  value={address}
                  adjustPosition={false}
                  placeholder={i18n.chain.addressManage.detailTip}
                  onInput={e => {
                    this.setState({
                      address: e.detail.value
                    });
                  }}
                ></Textarea>
              </View>
            </View>
            <View className='item flex default'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.addressManage.setDefault}</View>
              </View>
              <View className='right'>
                <Switch
                  color='#FF775D'
                  className='switch'
                  checked={isDefault}
                  onChange={e => {
                    this.setState({
                      isDefault: e.detail.value
                    });
                  }}
                ></Switch>
              </View>
            </View>
          </View>
          <View
            className={`add flex ${this.watchData() ? 'active' : ''}`}
            onClick={() => {
              this.save();
            }}
          >
            {i18n.chain.button.save}
          </View>
        </View>
      </Page>
    );
  }
}
export default AddressDetail;
