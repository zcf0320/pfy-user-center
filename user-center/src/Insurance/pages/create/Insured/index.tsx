import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, Picker, Input } from '@tarojs/components';
import { SET_PROVICE_PICK_ARR, GET_PROVICE_LIST, SET_PROSON_INSURANCE_INFO } from '@constants/insurance';
import utils from '@utils/index';
import { upload } from '@actions/common';
import { getAllProvice } from '@actions/insurance';
import { connect } from 'react-redux';
import { PersonalInfo } from '../type';

import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    personInsuranceInfo?: PersonalInfo;
    setPersonInsuranceInfo?: Function;
    configShip?: Array<any>;
    getConfigShip?: Function;
    provicePickArr?: Array<any>;
    getProviceList?: Function;
    setCities?: Function;
    jobName: string;
    insuranceDetail?: any;
    getPrice: Function;
}
interface IState{
    multiIndex: Array<number>;
    // typeId: number;
    // relationshipIndex: number;
    socialSecurityIndex: number;
    sexIndex:number;
}
const SocialSecurity = [
  { text: '无', value: 0 },
  { text: '有', value: 1 }
];
const sexList = [
  { rootName: '女', value: 0 },
  { rootName: '男', value: 1 }
];
const typeList = [{
  rootName: '身份证',
  value: 1
}, {
  rootName: '护照',
  value: 2
}];
const shipList = [{
  value: 1,
  rootName: '本人'
},
{
  value: 2,
  rootName: '配偶'
},
{
  value: 3,
  rootName: '父母'
}, {
  value: 4,
  rootName: '子女'
}];
@connect(state => {
  return Object.assign({}, state.insurance);
}, dispatch => ({
  setPersonInsuranceInfo (data) {
    dispatch({
      type: SET_PROSON_INSURANCE_INFO,
      payload: data
    });
  },
  setCities (val) {
    dispatch({
      type: SET_PROVICE_PICK_ARR,
      payload: val
    });
  },
  getProviceList () {
    getAllProvice().then(res => {
      dispatch({
        type: GET_PROVICE_LIST,
        payload: res
      });
      dispatch({
        type: SET_PROVICE_PICK_ARR,
        payload: 0
      });
    });
  }
}))
class Insured extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      multiIndex: [],
      // typeId: 0,
      // relationshipIndex: 1,
      socialSecurityIndex: 0,
      sexIndex: 0
    };
  }

  componentDidMount () {
    // 默认选本人
    // this.props.getConfigShip({type: 'insureRelationship'})
    this.props.getProviceList && this.props.getProviceList();
  }

    // 投保关系的改变
    onShipChange = (e) => {
      // 判断是否是本人
      const value = Number(e.detail.value) + 1;
      const { relationship, policyHolderEmail, policyHolderMobile, policyHolderCodeNumber, policyHolderCertificateType, policyHolderName } = this.props.personInsuranceInfo;
      // const {policyHolderIdCard} = this.props.personInsuranceInfo
      // const { isSelf, rootId } = this.props.configShip[Number(e.detail.value)]
      if (value === 1) {
        this.props.personInsuranceInfo.insuredName = policyHolderName;
        this.props.personInsuranceInfo.insuredCodeNumber = policyHolderCodeNumber;
        this.props.personInsuranceInfo.insuredMobile = policyHolderMobile;
        this.props.personInsuranceInfo.insuredEmail = policyHolderEmail;
        this.props.personInsuranceInfo.insuredCertificateType = policyHolderCertificateType;
      } else {
        if (relationship === 1) {
          this.props.personInsuranceInfo.insuredName = '';
          this.props.personInsuranceInfo.insuredCodeNumber = '';
          this.props.personInsuranceInfo.insuredMobile = '';
          this.props.personInsuranceInfo.insuredEmail = '';
          this.props.personInsuranceInfo.insuredCertificateType = 1;
        }
      }
      this.props.personInsuranceInfo.relationship = value;
      this.props.setPersonInsuranceInfo(this.props.personInsuranceInfo);
    }

    // 是否本人
    isSelf = () => {
      // let result = false
      const { relationship } = this.props.personInsuranceInfo;
      return !!(relationship === 1);
    }

    //
    getShipNameByValue = () => {
      const { relationship } = this.props.personInsuranceInfo;
      const { configShip } = this.props;
      let name = '';
      if (configShip.length) {
        const search = configShip.find(x => x.rootId === relationship);
        name = search.rootName;
      }
      return name;
    }

    onSocialSecurityChange = (e) => {
      this.setState({
        socialSecurityIndex: Number(e.detail.value)
      });
      this.props.setPersonInsuranceInfo({
        hasSocialSecurity: SocialSecurity[Number(e.detail.value)].value
      });
    }

    // 输入框
    handleInput = async (key, value) => {
      const { insuredCertificateType } = this.props.personInsuranceInfo;
      this.props.personInsuranceInfo[key] = value.detail.value;
      if (key === 'insuredCodeNumber' && insuredCertificateType === 1) {
        this.props.personInsuranceInfo.insuredAge = this.getInfoByIdCard(value.detail.value) || '';
      }

      await this.props.setPersonInsuranceInfo(this.props.personInsuranceInfo);
      if (key === 'insuredCodeNumber' && insuredCertificateType === 1) {
        this.props.getPrice();
      }
    }

    getInfoByIdCard (idCard) {
      const { checkIdCard, getAgeByIdCard } = utils;
      // 校验身份证是否正确
      if (!checkIdCard(idCard)) {
        return;
      }
      return getAgeByIdCard(idCard);
    }

    onProviceChange = (e) => {
      const { value } = e.detail;
      const { cityId: selectCityId } = this.props.personInsuranceInfo;
      const { provinceId, label: provinceName } = this.props.provicePickArr[0][value[0]];
      const { cityId, label } = this.props.provicePickArr[1][value[1]];
      // 选择相同的 不变
      if (cityId === selectCityId) {
        return;
      }
      this.props.setPersonInsuranceInfo({
        cityId,
        cityName: label,
        provinceId,
        provinceName
      });
      this.setState({
        multiIndex: value
      });
    }

    onBirthChange = async (e) => {
      await this.props.setPersonInsuranceInfo({
        birth: e.detail.value
      });

      this.props.getPrice();
    }

    onSexChange = async (e) => {
      this.setState({
        sexIndex: Number(e.detail.value)
      });
      await this.props.setPersonInsuranceInfo({
        insuredSex: e.detail.value
      });
      this.props.getPrice();
    }

    columnChange = (e) => {
      const { column, value } = e.detail;
      const provincePickArr = JSON.parse(JSON.stringify(this.props.provicePickArr));
      if (column === 0) {
        const arr = provincePickArr[0][value].cities || [];
        provincePickArr[1] = arr;
        provincePickArr[2] = arr[0].districts;
        this.setState({
          multiIndex: [value, 0, 0]
        });
      }
      if (column === 1) {
        const val = this.state.multiIndex;
        const arr = provincePickArr[1][value].districts || [];
        provincePickArr[2] = arr;
        this.setState({
          multiIndex: [val[0], value, 0]
        });
      }
      !column && this.props.setCities(value);
    }

    // 加减
    addAndReduce = (type) => {
      let { numberOfInsured } = this.props.personInsuranceInfo;
      const { insureMaxNum } = this.props.insuranceDetail;
      if (type === 1) {
        if (numberOfInsured === 1) { return; }
        numberOfInsured--;
      } else {
        if (numberOfInsured !== insureMaxNum) {
          numberOfInsured++;
        }
      }
      this.props.setPersonInsuranceInfo({
        numberOfInsured
      });
    }

    // 上传图片
    uploadImg = async () => {
      let url: any = '';
      const p = new Promise((resolve, reject) => {
        Taro.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
          success: (res) => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths;
            upload({
              filePath: tempFilePaths[0],
              module: 'insurance'
            }).then((res: string) => {
              resolve(JSON.parse(res).data);
            });
          }
        });
      });
      url = await p;
      return url;
    }

    setImages = async (index, iIndex) => {
      const url = await this.uploadImg();
      const { insuredFileList } = this.props.personInsuranceInfo;
      !insuredFileList[index].imgUrls && (insuredFileList[index].imgUrls = []);
      insuredFileList[index].imgUrls[iIndex] = url;
      this.props.setPersonInsuranceInfo({
        insuredFileList
      });
    }

    delImage = (index, iIndex) => {
      const { insuredFileList } = this.props.personInsuranceInfo;
      if (insuredFileList[index].type === 1) {
        insuredFileList[index].imgUrls[iIndex] = '';
      } else {
        insuredFileList[index].imgUrls.splice(iIndex, 1);
      }

      this.props.setPersonInsuranceInfo({
        insuredFileList
      });
    }

    render () {
      const { multiIndex, socialSecurityIndex, sexIndex } = this.state;
      const { relationship, insuredName, insuredCodeNumber, insuredMailingAddress, insuredFileList, numberOfInsured, insuredSex, insuredCertificateType, insuredAge, cityId, hasSocialSecurity, provinceName, cityName, insuredMobile, insuredEmail } = this.props.personInsuranceInfo;
      return (
            <View className='component-insured'>
                <View className='common common-info'>
                    <View className='title'>被保人信息</View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>被保人关系</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <View className='right flex'>
                            <Picker
                              mode='selector' className='picker'
                              range={shipList} value={relationship - 1}
                              rangeKey='rootName'
                              onChange={this.onShipChange}
                            >
                                <Text className='address'>{shipList[relationship - 1].rootName}</Text>
                            </Picker>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>
                    </View>
                    {!this.isSelf() && <View className='common-item flex'>
                        <View className='label'>姓名</View>
                        <Input value={insuredName}
                          type='text'
                          placeholder='请输入姓名'
                          adjust-position={false}
                          placeholderClass='placeholder'
                          onBlur={this.handleInput.bind(this, 'insuredName')}
                          className='input'
                        ></Input>
                    </View>}
                    {
                        !this.isSelf() && <View className='common-item flex'>
                            <View className='label flex'>
                                <Text className='text'>证件类型</Text>

                            </View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={typeList} value={insuredCertificateType - 1} rangeKey='rootName' onChange={(e) => {
                                  this.props.setPersonInsuranceInfo({ insuredCertificateType: Number(e.detail.value) + 1 });
                                }} range-key='rootName'
                                >
                                    <Text className='address'>{typeList[insuredCertificateType - 1].rootName}</Text>
                                </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                    }
                    {
                        !this.isSelf() && <View className='common-item flex'>
                            <View className='label flex'>
                                <Text className='text'>证件号码</Text>
                                <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                            </View>
                            <Input value={insuredCodeNumber}
                              type='text'
                              maxlength={18}
                              placeholder='请输入被保人证件号码'
                              adjust-position={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'insuredCodeNumber')}

                              className='input'
                            ></Input>
                        </View>
                    }
                    {
                        (insuredFileList && insuredFileList.length)
                          ? insuredFileList.map((item, index) => {
                            return item.type === 1
                              ? <View className='card-img' key={item.type}>
                            <View className='card-title flex'>
                                <Text>身份证正反面</Text>
                                <Image className='icon-must' src={`${ossHost}images/must.png`}></Image>
                            </View>
                            <View className='card-list flex'>
                                <View className='card-item flex'>
                                    <View className='card-label'>正面</View>
                                    <View className={`card-content ${item.imgUrls && item.imgUrls[0] ? 'no-border' : ''}`} onClick={() => {
                                      this.setImages(index, 0);
                                    }}
                                    >
                                        {
                                            (item.imgUrls && item.imgUrls[0])
                                              ? <View >
                                                    <View className='img-content'>
                                                        <Image src={item.imgUrls[0]} className='img' mode='aspectFill'></Image>
                                                    </View>

                                                    <View className='del' onClick={(e) => {
                                                      e.stopPropagation();
                                                      this.delImage(index, 0);
                                                    }}
                                                    ></View>
                                                </View>
                                              : null
                                        }
                                    </View>
                                </View>
                                <View className='card-item flex'>
                                    <View className='card-label'>反面</View>
                                    <View className={`card-content ${item.imgUrls && item.imgUrls[1] ? 'no-border' : ''}`} onClick={() => {
                                      this.setImages(index, 1);
                                    }}
                                    >
                                        {
                                            (item.imgUrls && item.imgUrls[1])
                                              ? <View>
                                                    <View className='img-content'>
                                                        <Image src={item.imgUrls[1]} className='img' mode='aspectFill'></Image>
                                                    </View>
                                                    <View className='del' onClick={(e) => {
                                                      e.stopPropagation();
                                                      this.delImage(index, 1);
                                                    }}
                                                    ></View>
                                                </View>
                                              : null
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                              : <View className='card-img list' key={item.type}>
                        <View className='card-title flex'>
                            <Text>{item.name}</Text>
                            <Image className='icon-must' src={`${ossHost}images/must.png`}></Image>
                        </View>
                        <View className='card-list flex'>
                            {
                                (item.imgUrls && item.imgUrls.length)
                                  ? item.imgUrls.map((iItem, iIndex) => {
                                    return <View className='card-item flex' key={iItem}>
                                        <View className='card-content'>
                                            <View>
                                                <View className='img-content'>
                                                    <Image src={iItem} className='img' mode='aspectFill'></Image>
                                                </View>
                                                <View className='del' onClick={(e) => {
                                                  e.stopPropagation();
                                                  this.delImage(index, iIndex);
                                                }}
                                                ></View>
                                            </View>
                                        </View>
                                    </View>;
                                  })
                                  : null
                            }
                            <View className='card-item flex' onClick={() => {
                              this.setImages(index, item.imgUrls ? item.imgUrls.length : 0);
                            }}
                            >
                                <View className='card-content'>
                                </View>
                            </View>
                        </View>
                    </View>;
                          })
                          : null
                    }

                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>性别</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <View className='right flex'>
                            <Picker mode='selector'
                              className='picker'
                              range={sexList} rangeKey='rootName'
                              onChange={this.onSexChange.bind(this)}
                              value={sexIndex}
                            >
                                {
                                    insuredSex !== undefined ? (<Text className='address'>{ insuredSex ? '男' : '女'}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                }
                            </Picker>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>
                    </View>

                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>年龄</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <Input value={insuredAge}
                          type='number'
                          placeholder='请输入被保人年龄'
                          adjust-position={false}
                          maxlength={2}
                          placeholderClass='placeholder'
                          disabled={insuredCertificateType === 1}
                          onBlur={this.handleInput.bind(this, 'insuredAge')}
                          className='input'
                        ></Input>

                    </View>
                    <View className='common-item flex' onClick={() => {
                      Taro.navigateTo({
                        url: '/Insurance/pages/profession/index?type=1'
                      });
                    }}
                    >
                        <View className='label flex'>
                            <Text className='text'>职业</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <View className='right flex'>
                            <Text className='address'>{this.props.jobName || '-'}</Text>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>

                    </View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>有无社保</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <View className='right flex'>
                            <Picker
                              mode='selector' className='picker'
                              range={SocialSecurity}
                              value={socialSecurityIndex}
                              rangeKey='text' onChange={this.onSocialSecurityChange} range-key='text'
                            >
                                {
                                    hasSocialSecurity !== undefined ? (<Text className='address'>{hasSocialSecurity ? '有' : '无'}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                }
                            </Picker>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>
                    </View>
                    <View className='common-item flex'>
                    <View className='label flex'>
                            <Text className='text'>投保地区（省市）</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <View className='right flex'>
                            <Picker mode='multiSelector' className='picker'
                              range={this.props.provicePickArr}
                              rangeKey='label'
                              onChange={this.onProviceChange.bind(this)}
                              onColumnChange={this.columnChange.bind(this)}
                              value={multiIndex}
                            >
                                {
                                    cityId ? (<Text className='address'>{provinceName} {cityName}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                }
                            </Picker>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>
                    </View>
                    <View className='common-item flex'>
                            <View className='label flex'>
                                <Text className='text'>通讯地址</Text>
                            </View>
                            <Input value={insuredMailingAddress}
                              type='text'
                              placeholder='请输入通讯地址'
                              adjust-position={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'insuredMailingAddress')}
                              className='input'
                            ></Input>
                    </View>
                    <View className='common-item flex'>
                            <View className='label flex'>
                                <Text className='text'>投保份数</Text>
                            </View>
                            <View className='add-number flex'>
                                <View className='add flex reduce' onClick={() => { this.addAndReduce(1); }}>-</View>
                                <View className='number flex'>{numberOfInsured}</View>
                                <View className='add flex' onClick={() => { this.addAndReduce(2); }}>+</View>
                            </View>
                    </View>
                    {!this.isSelf() && (<View className='common-item flex'>
                        <View className='label'>手机号</View>
                        <Input value={insuredMobile}
                          type='number'
                          placeholder='选填'
                          maxlength={11}
                          adjust-position={false}
                          placeholderClass='placeholder'
                          onInput={this.handleInput.bind(this, 'insuredMobile')}
                          className='input'
                        ></Input>
                    </View>)}
                    {!this.isSelf() && (
                        <View className='common-item flex'>
                        <View className='label'>电子邮箱</View>
                        <Input value={insuredEmail}
                          type='text'
                          placeholder='选填'
                          adjust-position={false}
                          placeholderClass='placeholder'
                          onInput={this.handleInput.bind(this, 'insuredEmail')}
                          className='input'
                        ></Input>
                    </View>
                    )}
                </View>
            </View>
      );
    }
}
export default Insured;
