import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Picker, Text, Input, Textarea } from '@tarojs/components';
import { Component } from 'react';
import { AtImagePicker } from 'taro-ui';
import i18n from '@i18n/index';
import Page from '@components/page';
import utils from '@utils/index';
import { sendMessage, upload, getAllProvice } from '@actions/common';
import { getServiceInfo, add } from '@actions/user';
import { getReserveConfig, getSiteInfo } from '@actions/service';
import { connect } from 'react-redux';
import {
  GET_SERVICE_INFO,
  GET_PROVICE_LIST,
  GET_SITE_LIST,
  SET_PROVICE_PICK_ARR,
  GET_ALL_UPDOORCITY_LIST,
  GET_SELECT_UPDOORCITY_LIST
} from '@constants/user';
import './index.scss';

const { ossHost } = utils.appConfig;
let timer = 60;
const timeList = ['7:00——15:00', '8:00——16:00', '9:00——17:00'];
const config = [
  'reverseArea',
  'detailAddress',
  'siteName',
  'siteMobile',
  'reserveDate',
  'reserveTime',
  'reimbursementWay',
  'customerAddress',
  'hostipalDocuments',
  'clinicHospital',
  'clinicDepartment',
  'illnessState',
  'comeCity'
];
interface IProps {
  onGetServiceInfo: Function;
  provicePickArr: Array<any>;
  upDoorCityList: Array<any>;
  upDoorCitySelectList: Array<any>;
  onSetCities: Function;
  siteList: Array<any>;
  onSendMessage: Function;
  serviceInfo: any;
  onGetAllProvince: Function;
  onSetComeCities: Function;
}
interface IState {
  time: string;
  hourArr: Array<string>;
  hourIndex: number;
  hourText: string;
  multiIndex: Array<number>;
  comeMultiIndex: Array<number>;
  areaName: string;
  comeAreaName: string;
  // siteList: Array<any>
  siteIndex: number;
  siteName: string;
  codeText: string;
  isSend: boolean;
  mobile: string;
  validCode: string;
  bedNumber: string;
  companyTimeIndex: number;
  companyTime: string;
  beforeDate: number;
  reserveConfigRelationVo: any;
  reseverMaterialConfigVos: any;
  customerAddress: string;
  reimbursementWay: number;
  // clinicHospital: string
  clinicDepartment: string;
  illnessState: string;
  hostipalDocuments: number;
  address: string;
  addressId: string;
  siteLists: Array<any>;
  // allProvince: Array<any>;
  provincePickArr: Array<any>;
  provinceIndex: Array<number>;
  comeCityId: number;
  contactMobile: string;
}
@connect(
  state => {
    return Object.assign({}, state.user, state.common);
  },
  dispatch => ({
    onSendMessage (params) {
      return sendMessage(params);
    },
    add (params) {
      return add(params);
    },
    onSetCities (val) {
      dispatch({
        type: SET_PROVICE_PICK_ARR,
        payload: val
      });
    },
    onSetComeCities (val) {
      dispatch({
        type: GET_SELECT_UPDOORCITY_LIST,
        payload: val
      });
    },
    async onGetServiceInfo (params) {
      const res: any = await getServiceInfo(params);
      dispatch({
        type: GET_SERVICE_INFO,
        payload: res
      });
      if (res.provinces && res.provinces.length) {
        // 全部的省市
        dispatch({
          type: GET_PROVICE_LIST,
          payload: res.provinces
        });
        // 获取选择器的数据
        dispatch({
          type: SET_PROVICE_PICK_ARR,
          payload: 0
        });
      }

      // 全部的网点
      dispatch({
        type: GET_SITE_LIST,
        payload: res.sites
      });

      // 上门城市
      dispatch({
        type: GET_ALL_UPDOORCITY_LIST,
        payload: res.comeCitys
      });
      return res;
    },
    async onGetAllProvince () {
      return await getAllProvice();
    }
  })
)
class Common extends Component<IProps, IState> {
  constructor (props: IProps | Readonly<IProps>) {
    super(props);
    this.state = {
      // 预约日期
      time: '',
      // 预约时间
      hourArr: [],
      hourIndex: 0,
      hourText: '',
      multiIndex: [],
      comeMultiIndex: [],
      areaName: '',
      comeAreaName: '',
      siteLists: [],
      siteIndex: 0,
      siteName: '',
      codeText: i18n.chain.appointment.getCode,
      isSend: false,
      mobile: '',
      validCode: '',
      bedNumber: '',
      companyTimeIndex: 0,
      companyTime: '',
      beforeDate: 2,
      reserveConfigRelationVo: [],
      reseverMaterialConfigVos: [],
      customerAddress: '',
      reimbursementWay: 0,
      clinicDepartment: '',
      illnessState: '',
      hostipalDocuments: 0,
      address: '',
      addressId: '',
      // allProvince: [],
      provincePickArr: [],
      provinceIndex: [],
      comeCityId: 0,
      contactMobile: ''
    };
  }

  async componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.appointment.title });
    const { router } = getCurrentInstance();
    const { serviceRecordId, siteId } = (router?.params && router.params) || {};
    if (siteId) {
      getSiteInfo(siteId)
        .then((res: any) => {
          this.setState({
            addressId: res.addressId,
            areaName: res.cityName,
            contactMobile: res.contactMobile,
            address: res.address,
            siteName: res.serviceSiteName
          });
        })
        .catch(() => {});
    }
    const service = await this.props.onGetServiceInfo({ serviceRecordId });
    getReserveConfig(serviceRecordId || '').then((res: any) => {
      res.reseverMaterialConfigVos &&
        res.reseverMaterialConfigVos.forEach((item: any) => {
          item.files = [];
        });
      this.setState({
        reserveConfigRelationVo: res.reserveConfigRelationVo,
        reseverMaterialConfigVos: res.reseverMaterialConfigVos
      });
    });

    const { mobile, itemName } = service;
    const hourArr: Array<string> = [];
    for (let i = 0; i < 24; i++) {
      // 垃圾代码
      if (itemName === '少儿推拿') {
        if (i >= 10 && i <= 16) {
          hourArr.push(`${i}:00`);
        }
      } else {
        hourArr.push(`${i}:00`);
      }
    }
    const { provicePickArr } = this.props;

    const { provinceId, cityId } = await utils.getProviceId();

    if (provinceId && cityId) {
      let selectProviceIndex = 0;
      const proviceList = provicePickArr[0];
      const selectProvice = proviceList.filter((item, index) => {
        item.provinceId === provinceId && (selectProviceIndex = index);
        return item.provinceId === provinceId;
      });
      if (selectProvice.length) {
        const { cities } = selectProvice[0];

        let selectCityIndex = 0;
        const selectCity = cities.filter((item, index) => {
          item.cityId === cityId && (selectCityIndex = index);
          return item.cityId === cityId;
        });
        if (selectCity.length) {
          // 选择该城市的网点
          const siteList = this.props.siteList.filter(item => {
            return item.cityId === cityId;
          });

          this.props.onSetCities(selectProviceIndex);

          this.setState({
            siteLists: siteList,
            multiIndex: [selectProviceIndex, selectCityIndex]
          });
        }
      }
    }
    this.setState({
      hourArr,
      mobile
    });
    const province = await this.props.onGetAllProvince();
    const arr = [] as any;
    province.forEach(item => {
      item.name = item.provinceName;
      item.id = item.provinceId;
      item.cities.forEach(city => {
        city.name = city.cityName;
        city.id = city.cityId;
        city.districts.forEach(district => {
          district.id = district.districtId;
          district.name = district.districtName;
        });
      });
      arr.push(item);
    });
    this.setState({
      provincePickArr: [arr, arr[0].cities, arr[0].cities[0].districts]
      // allProvince: province
    });
  }

  onDateChange = e => {
    // Taro.showModal({
    //     content: utils.timeFormat(new Date(e.detail.value.split('-').join('/')).getTime(), 'y/m/d')
    // })
    this.setState({
      // time: utils.timeFormat(new Date(e.detail.value.split('-').join('/')).getTime(), 'y./m/d')
      time: e.detail.value
    });
  };

  onTimeChange = e => {
    const { hourArr } = this.state;
    this.setState({
      hourIndex: e.detail.value,
      hourText: hourArr[e.detail.value]
    });
  };

  onCompanyTimeChange = e => {
    this.setState({
      companyTimeIndex: e.detail.value,
      companyTime: timeList[e.detail.value]
    });
  };

  // 地区选择
  onProviceChange = e => {
    const { value } = e.detail;
    const { provicePickArr, siteList } = this.props;
    const { cityId } = provicePickArr[1][value[1]];
    // 根据选择的城市筛选出网点地址
    const selectSiteList = siteList.filter(item => {
      return item.cityId === cityId;
    });
    // // 选择相同的 不变
    // if (cityId === this.state.cityId) {
    //   return;
    // }
    this.setState({
      address: '',
      siteName: '',
      siteLists: selectSiteList,
      multiIndex: value,
      areaName: provicePickArr[1][value[1]].label,
      siteIndex: 0
    });
  };

  // 上门城市选择
  onComeProviceChange = e => {
    const { value } = e.detail;
    const { upDoorCitySelectList } = this.props;
    if (!upDoorCitySelectList[0].length) {
      return;
    }
    const { cityId } = upDoorCitySelectList[1][value[1]];
    this.setState({
      comeCityId: cityId,
      comeMultiIndex: value,
      comeAreaName: upDoorCitySelectList[1][value[1]].label
    });
  };

  // 选择城市
  columnChange = e => {
    const { column, value } = e.detail;
    if (column === 0) {
      this.setState({
        multiIndex: [value, 0, 0]
      });
    }
    if (column === 1) {
      const val = this.state.multiIndex;

      this.setState({
        multiIndex: [val[0], value, 0]
      });
    }
    !column && this.props.onSetCities(value);
  };

  // 选择上门城市
  columnComeCityChange = e => {
    const { column, value } = e.detail;
    !column && this.props.onSetComeCities(value);
  };

  // 网点选择
  onSiteChange = e => {
    const { siteLists } = this.state;
    if (!siteLists.length) {
      return;
    }
    this.setState({
      siteIndex: e.detail.value,
      siteName: siteLists[e.detail.value].serviceSiteName,
      address: siteLists[e.detail.value].address,
      addressId: siteLists[e.detail.value].addressId,
      beforeDate: siteLists[e.detail.value].beforeDate || 2
    });
  };

  sendMessage = () => {
    const { mobile, isSend } = this.state;
    // 校验改手机号与原手机号是否相同
    if (timer !== 60 || isSend || !mobile) {
      return;
    }
    const isMobile = utils.checkPhone(mobile);
    !isMobile && Taro.showToast({ title: '请输入正确的手机号', mask: true });
    this.setState({
      isSend: true
    });
    this.props.onSendMessage({ mobile }).then(() => {
      const setCode = setInterval(() => {
        if (!timer) {
          timer = 60;
          setCode && clearInterval(setCode);
          this.setState({
            codeText: i18n.chain.appointment.reacquire,
            isSend: false
          });
        } else {
          timer--;
          this.setState({
            codeText: `${timer}s`
          });
        }
      }, 1000);
    });
  };

  watchData () {
    const {
      time,
      hourText,
      areaName,
      siteName,
      mobile,
      validCode,
      reserveConfigRelationVo,
      companyTime,
      clinicDepartment,
      illnessState,
      customerAddress,
      comeCityId
    } = this.state;
    const type = utils.appConfig.codeMap[this.props.serviceInfo.pageCode];
    let result = true;
    if (!reserveConfigRelationVo) {
      result = false;
      return;
    }
    reserveConfigRelationVo &&
      reserveConfigRelationVo.forEach((item: any) => {
        switch (item.code) {
          case 'updateMobile':
            result = !!(result && mobile);
            return result;
          case 'needMessage':
            result = !!(result && validCode);
            return result;
          case 'reverseArea':
            result = !!(result && areaName);
            return result;
          case 'siteName':
            result = !!(result && siteName);
            return result;
          case 'reserveDate':
            result = !!(result && time);
            return result;
          case 'reserveTime':
            if (type === 15) {
              result = !!(result && companyTime);
            } else {
              result = !!(result && hourText);
            }
            return result;
          case 'customerAddress':
            result = !!(result && customerAddress);
            return result;
          case 'clinicDepartment':
            result = !!(result && clinicDepartment);
            return;
          case 'comeCity':
            result = !!(result && comeCityId);
            return;
          case 'illnessState':
            result = !!(result && illnessState);
            return result;
          default:
        }
      });

    return result && mobile !== '';
  }

  save = () => {
    const { router } = getCurrentInstance();
    if (!this.watchData()) {
      return;
    }
    const { serviceRecordId } = (router?.params && router.params) || {};
    const {
      time,
      hourIndex,
      hourArr,
      siteName,
      mobile,
      validCode,
      bedNumber,
      companyTimeIndex,
      companyTime,
      clinicDepartment,
      hostipalDocuments,
      reimbursementWay,
      customerAddress,
      illnessState,
      reseverMaterialConfigVos,
      comeCityId,
      addressId
    } = this.state;
    const { serviceInfo } = this.props;
    const { pageCode, name, idCard, age, sex } = serviceInfo;
    const type = utils.appConfig.codeMap[pageCode];
    const timeArr = time.split('-');
    const materialReqs = [] as any;

    reseverMaterialConfigVos &&
      reseverMaterialConfigVos.forEach((item: any) => {
        if (item.files.length) {
          const files = [] as any;
          item.files.forEach((file: any) => {
            files.push(file.url);
          });
          materialReqs.push({
            materialConfigId: item.id,
            urls: files
          });
        }
      });
    const params: any = {
      name,
      idCard,
      age,
      sex,
      time,
      mobile,
      serviceRecordId,
      clinicDepartment,
      companyTime,
      clinicHospital: siteName,
      customerAddress,
      hostipalDocuments,
      illnessState,
      materialReqs,
      reimbursementWay,
      comeCityId
    };
    // if(type === 15) {
    //     let companyTimeArr = companyTime.split('——')

    //     bedNumber && (params.bedNumber = bedNumber)
    //     params.startTime = new Date(`1970/01/01 ${companyTimeArr[0]}:00 `).getTime()
    //     params.endTime = new Date(`1970/01/01 ${companyTimeArr[1]}:00 `).getTime()
    // }
    if (timeArr.length) {
      const year = timeArr[0];
      const month = timeArr[1];
      const day = timeArr[2];
      let hour = hourArr[hourIndex];
      type === 15 && (hour = '00:00');
      params.time = new Date(`${year}/${month}/${day} ${hour}:00`).getTime();
    }
    if (type === 15) {
      const companyTimeArr = timeList[companyTimeIndex].split('——');
      bedNumber && (params.bedNumber = bedNumber);
      params.startTime = new Date(
        `1970/01/01 ${companyTimeArr[0]}:00 `
      ).getTime();
      params.endTime = new Date(
        `1970/01/01 ${companyTimeArr[1]}:00 `
      ).getTime();
    }
    siteName && (params.addressId = addressId);
    mobile && (params.mobile = mobile);
    validCode && (params.validCode = validCode);
    add(params)
      .then((res: any) => {
        const { serviceRecordId: recordId, reserveId } = res;
        let url = `/pages/user/appointment/detail/index?reserveId=${reserveId}`;
        (type === 6 || type === 15) &&
          (url = `/pages/user/appointment/record/index?status=1&serviceRecordId=${recordId}&title=${this.props.serviceInfo.itemName}`);
        Taro.showToast({
          title: i18n.chain.appointment.subscribe,
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          Taro.redirectTo({
            url
          });
        }, 1500);
      })
      .catch(() => {});
  };

  onChange = async (index: any, files: any, type: any, i: any) => {
    const { reseverMaterialConfigVos } = this.state;
    if (type === 'add') {
      const file = files[files.length - 1].file;
      const data = (await upload({
        filePath: file.path,
        module: 'appointment'
      })) as string;
      const url = JSON.parse(data).data;

      reseverMaterialConfigVos[index].files.push({
        id: new Date().getTime().toString(),
        url: url
      });
    }
    if (type === 'remove') {
      reseverMaterialConfigVos[index].files.splice(i, 1);
    }

    this.setState({
      reseverMaterialConfigVos
    });
  };

  lookImg = (url: string) => {
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
  };

  provinceColumnChange = (val: any) => {
    const { column, value } = val;
    const { provincePickArr, provinceIndex } = this.state;

    if (column === 0) {
      const arr = provincePickArr[0][value].cities || [];
      provincePickArr[1] = arr;
      provincePickArr[2] = arr[0].districts;
      this.setState({
        provinceIndex: [value, 0, 0],
        provincePickArr: [...provincePickArr]
      });
    }
    if (column === 1) {
      const arr = provincePickArr[1][value].districts || [];
      provincePickArr[2] = arr;
      this.setState({
        provinceIndex: [provinceIndex[0], value, 0],
        provincePickArr: [...provincePickArr]
      });
    }
  };

  provincePickArrChange = (e: any) => {
    const { value } = e.detail;
    const { provincePickArr } = this.state;
    let provinceName = '';
    let cityName = '';
    let districtName = '';
    if (provincePickArr.length) {
      provinceName = provincePickArr[0][value[0]].provinceName;
      cityName = provincePickArr[1][value[1]].name;
      if (provincePickArr[2].length) {
        districtName = provincePickArr[2][value[2]].districtName;
      }
    }

    this.setState({
      provinceIndex: value,
      customerAddress: provinceName + ' ' + cityName + ' ' + districtName
    });
  };

  render () {
    const { router } = getCurrentInstance();
    const { siteId } = (router?.params && router.params) || {};
    const {
      time,
      mobile,
      hourArr,
      beforeDate,
      validCode,
      bedNumber,
      companyTimeIndex,
      companyTime,
      hourIndex,
      multiIndex,
      areaName,
      siteLists,
      siteIndex,
      siteName,
      codeText,
      isSend,
      reimbursementWay,
      reserveConfigRelationVo,
      reseverMaterialConfigVos,
      address,
      illnessState,
      clinicDepartment,
      hostipalDocuments,
      hourText,
      provincePickArr,
      provinceIndex,
      customerAddress,
      comeAreaName,
      comeMultiIndex,
      contactMobile
    } = this.state;

    const { provicePickArr, serviceInfo, upDoorCitySelectList } = this.props;
    const { idCard, name, age, sex, pageCode, itemName } = serviceInfo || {};
    const type = utils.appConfig.codeMap[pageCode];
    return (
      <Page showBack title={i18n.chain.appointment.title}>
        <View className='page-common '>
          <View className='common-info'>
            <View className='common-title flex'>
              {i18n.chain.appointment.information}
            </View>
            {reserveConfigRelationVo &&
              reserveConfigRelationVo.length > 0 &&
              reserveConfigRelationVo.map((item: any) => {
                return ['reversePerson', 'sex', 'idCard'].includes(
                  item.code
                )
                  ? (
                  <View key={item.id} className='common-item flex'>
                    <View className='left'>{item.configName}</View>
                    {item.code === 'reversePerson' && (
                      <View className='right'>{name}</View>
                    )}
                    {item.code === 'sex' && (
                      <View className='right'>
                        {sex
                          ? i18n.chain.appointment.male
                          : i18n.chain.appointment.female}
                      </View>
                    )}
                    {item.code === 'age' && (
                      <View className='right'>{age}</View>
                    )}
                    {item.code === 'idCard' && (
                      <View className='right'>{idCard}</View>
                    )}
                  </View>
                    )
                  : null;
              })}
          </View>
          {reserveConfigRelationVo && reserveConfigRelationVo.length > 0 && (
            <View className='service-info'>
              <View className='service-item flex'>
                <View className='left'>{i18n.chain.appointment.service}</View>
                <View className='right flex disbale'>{itemName}</View>
              </View>
              {reserveConfigRelationVo.map((list: any) => {
                return ['updateMobile', 'needMessage'].includes(list.code)
                  ? (
                  <View key={list.id} className='service-item flex'>
                    <View className='left'>{list.configName}</View>
                    {list.code === 'updateMobile' && (
                      <View className='right flex'>
                        <Input
                          className='input'
                          type='number'
                          maxlength={11}
                          value={mobile}
                          onInput={e => {
                            this.setState({ mobile: e.detail.value });
                          }}
                          placeholder={i18n.chain.appointment.mobilePlaceholder}
                        ></Input>
                      </View>
                    )}
                    {list.code === 'needMessage' && (
                      <View className='right flex'>
                        <Input
                          className='input code'
                          type='number'
                          maxlength={6}
                          value={validCode}
                          onInput={e => {
                            this.setState({ validCode: e.detail.value });
                          }}
                          placeholder={i18n.chain.appointment.codePlaceholder}
                        ></Input>
                        <View
                          className={`send-message flex ${
                            isSend ? 'disable' : ''
                          }`}
                          onClick={this.sendMessage}
                        >
                          {codeText}
                        </View>
                      </View>
                    )}
                  </View>
                    )
                  : null;
              })}
            </View>
          )}
          {reserveConfigRelationVo && reserveConfigRelationVo.length > 0 && (
            <View className='service-info'>
              {reserveConfigRelationVo.map((list: any) => {
                return config.includes(list.code) &&
                  list.code !== 'illnessState'
                  ? (
                  <View key={list.id} className='service-item flex'>
                    <View className='left'>{list.configName}</View>
                    {list.code === 'reverseArea' &&
                      (siteId
                        ? (
                        <View className='right flex'>{areaName}</View>
                          )
                        : (
                        <View className='right flex'>
                          <Picker
                            mode='multiSelector'
                            range={provicePickArr}
                            value={multiIndex}
                            rangeKey='label'
                            onChange={this.onProviceChange}
                            onColumnChange={this.columnChange}
                          >
                            <View className='picker'>
                              {areaName
                                ? (
                                <Text className='picker-select'>
                                  {areaName}
                                </Text>
                                  )
                                : (
                                <Text className='picker-select disable'>
                                  {i18n.chain.appointment.pickerPlaceholder}
                                </Text>
                                  )}
                            </View>
                          </Picker>
                          <View className='next'></View>
                        </View>
                          ))}
                    {list.code === 'siteName' &&
                      (siteId
                        ? (
                        <View className='right flex'>{siteName}</View>
                          )
                        : (
                        <View className='right flex'>
                          <Picker
                            mode='selector'
                            range={siteLists}
                            rangeKey='serviceSiteName'
                            onChange={this.onSiteChange}
                            value={siteIndex}
                          >
                            <View className='picker'>
                              {siteName
                                ? (
                                <Text className='picker-select'>
                                  {siteName}
                                </Text>
                                  )
                                : (
                                <Text className='picker-select disable'>
                                  {i18n.chain.appointment.pickerPlaceholder}
                                </Text>
                                  )}
                            </View>
                          </Picker>
                          <View className='next'></View>
                        </View>
                          ))}
                    {list.code === 'detailAddress' && (
                      <View className='right flex'>{address}</View>
                    )}
                    {list.code === 'siteMobile' &&
                      (siteId
                        ? (
                        <View className='right flex'>{contactMobile}</View>
                          )
                        : (
                        <View className='right flex disable'>
                          {siteName
                            ? siteLists[siteIndex].contactMobile || '-'
                            : '-'}
                        </View>
                          ))}
                    {list.code === 'reserveDate' && (
                      <View className='right flex'>
                        <Picker
                          mode='date'
                          onChange={this.onDateChange}
                          value={
                            time ||
                            utils.timeFormat(
                              new Date().getTime() +
                                24 * 3600 * 1000 * beforeDate,
                              'y-m-d'
                            )
                          }
                          start={utils.timeFormat(
                            new Date().getTime() +
                              24 * 3600 * 1000 * beforeDate,
                            'y-m-d'
                          )}
                        >
                          <View className='picker'>
                            {time
                              ? (
                              <Text className='picker-select'>{time}</Text>
                                )
                              : (
                              <Text className='picker-select disable'>
                                {type !== 15
                                  ? i18n.chain.appointment.pickerPlaceholder
                                  : '请选择开始陪护时间'}
                              </Text>
                                )}
                          </View>
                        </Picker>
                        <View className='next'></View>
                      </View>
                    )}
                    {list.code === 'reserveTime' && (
                      <View className='right flex'>
                        <Picker
                          mode='selector'
                          range={hourArr}
                          onChange={this.onTimeChange}
                          value={hourIndex}
                        >
                          <View className='picker'>
                            {hourText
                              ? (
                              <Text className='picker-select'>{hourText}</Text>
                                )
                              : (
                              <Text className='picker-select disable'>
                                {i18n.chain.appointment.pickerPlaceholder}
                              </Text>
                                )}
                          </View>
                        </Picker>
                        <View className='next'></View>
                      </View>
                    )}
                    {list.code === 'reimbursementWay' && (
                      <View className='right flex'>
                        <View
                          className='radio'
                          onClick={() => {
                            this.setState({
                              reimbursementWay: 0
                            });
                          }}
                        >
                          {reimbursementWay === 0
                            ? (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio-checked.png`}
                            />
                              )
                            : (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio.png`}
                            />
                              )}
                          {i18n.chain.appointment.ownExpense}
                        </View>
                        <View
                          className='radio'
                          onClick={() => {
                            this.setState({
                              reimbursementWay: 1
                            });
                          }}
                        >
                          {reimbursementWay === 1
                            ? (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio-checked.png`}
                            />
                              )
                            : (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio.png`}
                            />
                              )}
                          {i18n.chain.appointment.medicalInsurance}
                        </View>
                      </View>
                    )}
                    {list.code === 'customerAddress' && (
                      <View className='right flex'>
                        <Picker
                          mode='multiSelector'
                          range={provincePickArr}
                          rangeKey='name'
                          onChange={this.provincePickArrChange}
                          onColumnChange={e => {
                            this.provinceColumnChange(e.detail);
                          }}
                          value={provinceIndex}
                        >
                          <View className='picker'>
                            {customerAddress
                              ? (
                              <Text className='picker-select'>
                                {customerAddress}
                              </Text>
                                )
                              : (
                              <Text className='picker-select disable'>
                                {i18n.chain.appointment.pickerPlaceholder}
                              </Text>
                                )}
                          </View>
                        </Picker>
                        <View className='next'></View>
                      </View>
                    )}
                    {list.code === 'hostipalDocuments' && (
                      <View className='right flex'>
                        <View
                          className='radio'
                          onClick={() => {
                            this.setState({
                              hostipalDocuments: 0
                            });
                          }}
                        >
                          {hostipalDocuments === 0
                            ? (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio-checked.png`}
                            />
                              )
                            : (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio.png`}
                            />
                              )}
                          {i18n.chain.appointment.yes}
                        </View>
                        <View
                          className='radio'
                          onClick={() => {
                            this.setState({
                              hostipalDocuments: 1
                            });
                          }}
                        >
                          {hostipalDocuments === 1
                            ? (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio-checked.png`}
                            />
                              )
                            : (
                            <Image
                              className='radio-img'
                              src={`${ossHost}images/radio.png`}
                            />
                              )}
                          {i18n.chain.appointment.no}
                        </View>
                      </View>
                    )}
                    {list.code === 'clinicHospital' && (
                      <View className='right flex'>{siteName}</View>
                    )}
                    {list.code === 'clinicDepartment' && (
                      <View className='right flex'>
                        <Input
                          className='input'
                          value={clinicDepartment}
                          onInput={e => {
                            this.setState({ clinicDepartment: e.detail.value });
                          }}
                          placeholder={i18n.chain.appointment.inputPlaceholder}
                        ></Input>
                      </View>
                    )}

                    {list.code === 'comeCity' && (
                      <View className='right flex'>
                        <Picker
                          mode='multiSelector'
                          range={upDoorCitySelectList}
                          value={comeMultiIndex}
                          rangeKey='label'
                          onChange={this.onComeProviceChange}
                          onColumnChange={this.columnComeCityChange}
                        >
                          <View className='picker'>
                            {comeAreaName
                              ? (
                              <Text className='picker-select'>
                                {comeAreaName}
                              </Text>
                                )
                              : (
                              <Text className='picker-select disable'>
                                {i18n.chain.appointment.pickerPlaceholder}
                              </Text>
                                )}
                          </View>
                        </Picker>
                        <View className='next'></View>
                      </View>
                    )}
                  </View>
                    )
                  : (
                      list.code === 'illnessState' && (
                    <View className='text-area'>
                      <View className='title'>{list.configName}</View>
                      <Textarea
                        autoHeight
                        className='textarea'
                        value={illnessState}
                        placeholderClass='placeholder'
                        onInput={e => {
                          this.setState({ illnessState: e.detail.value });
                        }}
                        placeholder={i18n.chain.appointment.inputPlaceholder}
                      ></Textarea>
                    </View>
                      )
                    );
              })}
              {type === 15
                ? (
                <View className='service-item flex'>
                  <View className='left'>
                    {i18n.chain.appointment.nursingBedNo}
                  </View>
                  <View className='right flex'>
                    <Input
                      className='input'
                      type='number'
                      value={bedNumber}
                      onInput={e => {
                        this.setState({ bedNumber: e.detail.value });
                      }}
                      placeholder='请输入详细病房地址到具体床号(选填)'
                    ></Input>
                  </View>
                </View>
                  )
                : null}
              {type === 15
                ? (
                <View className='service-item flex'>
                  <View className='left'>
                    {i18n.chain.appointment.accompanyingTime}
                  </View>
                  <View className='right flex'>
                    <Picker
                      mode='selector'
                      range={timeList}
                      onChange={this.onCompanyTimeChange}
                      value={companyTimeIndex}
                    >
                      <View className='picker'>
                        {companyTime
                          ? (
                          <Text className='picker-select'>{companyTime}</Text>
                            )
                          : (
                          <Text className='picker-select disable'>
                            {i18n.chain.appointment.pickerPlaceholder}
                          </Text>
                            )}
                      </View>
                    </Picker>
                    <View className='next'></View>
                  </View>
                </View>
                  )
                : null}
            </View>
          )}
          {reseverMaterialConfigVos && reseverMaterialConfigVos.length > 0 && (
            <View className='material-info'>
              <View className='material-title'>
                {i18n.chain.appointment.subMittals}
              </View>
              {reseverMaterialConfigVos.map((item: any, index: number) => {
                return (
                  <View key={item.id} className='material-wrap'>
                    <View className='material-item'>
                      <View className='left flex'>
                        {item.materialNameForUser}
                        {item.mandatory
                          ? (
                          <View className='red'>（必填）</View>
                            )
                          : (
                          <View className='color-999'>（选填）</View>
                            )}
                      </View>
                      <View
                        className='right'
                        onClick={() => {
                          this.lookImg(item.sampleFileUrl);
                        }}
                      >
                        {item.sampleFileUrl
                          ? i18n.chain.appointment.viewExample
                          : i18n.chain.appointment.noSample}
                      </View>
                    </View>
                    <View className='content'>{item.content}</View>
                    <AtImagePicker
                      files={item.files}
                      onChange={this.onChange.bind(this, index)}
                    />
                  </View>
                );
              })}
            </View>
          )}
          <View
            className={`save ${this.watchData() ? '' : 'disable'}`}
            onClick={this.save}
          >
            {i18n.chain.appointment.submit}
          </View>
        </View>
      </Page>
    );
  }
}
export default Common;
