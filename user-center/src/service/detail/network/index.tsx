import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import { AtIndexes } from 'taro-ui';
import { getServiceInfoById } from '@actions/user';
import {
  GET_SERVICE_INFO,
  GET_PROVICE_LIST,
  GET_SITE_LIST
} from '@constants/user';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getServiceInfo: Function;
}
interface IState {
  provinceList: Array<any>;
  cityList: Array<any>;
  list: Array<any>;
  sites: Array<any>;
  selectSites: Array<any>;
  provinceName: string;
  cityName: string;
  showIndex: boolean;
}
@connect(
  state => state,
  dispatch => ({
    getServiceInfo (params) {
      return new Promise(resolve => {
        getServiceInfoById(params).then((res: any) => {
          resolve(res);
          dispatch({
            type: GET_SERVICE_INFO,
            payload: res
          });
          // 全部的省市
          dispatch({
            type: GET_PROVICE_LIST,
            payload: res.provinces
          });
          // 全部的网点
          dispatch({
            type: GET_SITE_LIST,
            payload: res.sites
          });
        });
      });
    }
  })
)
class NetWork extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      provinceList: [],
      cityList: [],
      list: [],
      sites: [],
      selectSites: [],
      provinceName: '-',
      cityName: '-',
      showIndex: false
    };
  }

  componentDidMount () {
    this.getServiceInfo();
  }

  // 获取服务详情
  getServiceInfo () {
    const { router } = getCurrentInstance();
    const { serviceInfoId } = (router?.params && router.params) || {};
    this.props
      .getServiceInfo({
        serviceInfoId
      })
      .then(async res => {
        const { provinceId, cityId } = await utils.getProviceId();

        const { provinces, sites } = res;
        if (provinceId && cityId) {
          let provinceName = '-';
          let cityName = '-';
          const selectProvice = provinces.filter(item => {
            item.provinceId === provinceId &&
              (provinceName = item.provinceName);
            return item.provinceId === provinceId;
          });
          if (selectProvice.length) {
            const { cities } = selectProvice[0];
            const selectCity = cities.filter(item => {
              item.cityId === cityId && (cityName = item.cityName);
              return item.cityId === cityId;
            });
            if (selectCity.length) {
              // 选择该城市的网点
              const selectSites = this.getSitesByCityId(sites, cityId);
              this.setState({
                provinceName,
                cityName,
                selectSites
              });
            }
          }
        }
        this.setState({
          provinceList: this.getList(provinces),
          sites
        });
      });
  }

  call (phone) {
    Taro.showModal({
      title: '',
      content: phone,
      cancelText: '取消',
      cancelColor: '#9D9FA2',
      confirmColor: '#FE9A51',
      confirmText: '呼叫',
      success: function (res) {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: phone
          });
        } else {
          //
        }
      }
    });
  }

  getSitesByCityId (sites, cityId) {
    const selectSites = sites.filter(item => {
      return item.cityId === cityId;
    });
    return selectSites;
  }

  getSitesByProvinceId (sites, provinceId) {
    const selectSites = sites.filter(item => {
      return item.provinceId === provinceId;
    });
    return selectSites;
  }

  // 根据start_key排序
  sortASCII (arr) {
    return arr.sort((a, b) => {
      return a.startKey.charCodeAt() - b.startKey.charCodeAt();
    });
  }

  selectProvice (type) {
    const { provinceList, cityList } = this.state;
    let list = provinceList;
    if (type === 'city') {
      list = this.getList(cityList);
    }
    this.setState({
      list,
      showIndex: true
    });
  }

  // 获取列表
  getList (list) {
    // 根据ASCII进行排序
    const sortList = this.sortASCII(list);
    const resultList = [] as any;
    const startKeyList = [] as any;
    sortList.forEach(item => {
      item.startKey = item.startKey.toLocaleUpperCase();
      !startKeyList.includes[item.startKey] && startKeyList.push(item.startKey);
    });
    startKeyList.forEach(item => {
      const items = [] as any;
      sortList.forEach(sItem => {
        if (item === sItem.startKey) {
          sItem.name = sItem.provinceName || sItem.cityName;
          items.push(sItem);
        }
      });
      resultList.push({
        title: item,
        key: item,
        items
      });
    });
    return resultList;
  }

  select (item) {
    const { provinceId, cityId, provinceName, cityName, cities } = item;
    let { selectSites } = this.state;
    const { sites } = this.state;
    // 选择省
    if (provinceId) {
      selectSites = this.getSitesByProvinceId(sites, provinceId);
      this.setState({
        cityList: cities,

        provinceName,
        cityName: '-',
        showIndex: false,
        selectSites
      });
    }
    // 选择市
    if (cityId) {
      selectSites = this.getSitesByCityId(sites, cityId);
      this.setState({
        cityName,
        showIndex: false,
        selectSites
      });
    }
  }

  render () {
    const { provinceName, cityName, selectSites, showIndex, list } = this.state;
    return (
      <Page showBack title='网点列表'>
        <View className='page-network'>
          <View className='title'>地区</View>
          <View className='select-list flex'>
            <View
              className='select-item flex'
              onClick={() => {
                this.selectProvice('province');
              }}
            >
              <Text>{provinceName}</Text>
              <Text className='tips'>请选择</Text>
            </View>
            <View
              className='select-item flex city'
              onClick={() => {
                this.selectProvice('city');
              }}
            >
              <Text>{cityName}</Text>
              <Text className='tips'>请选择</Text>
            </View>
          </View>
          {!showIndex && (
            <View>
              {selectSites.length
                ? (
                <View>
                  <View className='title'>网点</View>
                  <View className='net-list'>
                    {selectSites.map(item => {
                      return (
                        <View className='net-item flex' key={item.id}>
                          <View className='address'>{item.address}</View>
                          {item.contactMobile && (
                            <View
                              className='phone flex'
                              onClick={() => {
                                this.call(item.contactMobile);
                              }}
                            >
                              <Image
                                src={`${ossHost}images/phone.png`}
                                className='phone-icon'
                              ></Image>
                              <Text>联系商家</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
                  )
                : (
                <View className='empty flex'>
                  <View className='img'></View>
                  <Text className='location'>您当前位置暂无服务网点</Text>
                  <Text>请选择其他地区</Text>
                </View>
                  )}
            </View>
          )}
          {showIndex && (
            <View style='height:100vh'>
              <AtIndexes
                list={list}
                onClick={this.select.bind(this)}
                topKey=''
                isVibrate={false}
              ></AtIndexes>
            </View>
          )}
        </View>
      </Page>
    );
  }
}
export default NetWork;
