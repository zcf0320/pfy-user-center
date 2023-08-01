import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, Picker, Input } from '@tarojs/components';
import { connect } from 'react-redux';
import { SET_INSURANCE_INFO } from '@constants/insurance';
import { upload, sendMessage } from '@actions/common';
import utils from '@utils/index';
import { IStoreProps } from '@reducers/interface';

import './index.scss';

const { ossHost } = utils.appConfig;
const pickList = [
  { text: '营业执照', value: 1 },
  { text: '组织代码证', value: 2 },
  { text: '税务登记证', value: 3 }
];
interface IProps{
    dispatchInfo: Function;
}
interface IState{
    selectIndex: number;
    qualificationDocumentsImgList: any;
    isSend: boolean;
    codeText: string;
}
let time = 60;
let setCode;
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  dispatchInfo (data) {
    dispatch({
      type: SET_INSURANCE_INFO,
      payload: data
    });
  }
}))
class PolicyHolder extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectIndex: 0,
      qualificationDocumentsImgList: [],
      isSend: false,
      codeText: '获取验证码'
    };
  }

  // 组件销毁清除定时器
  componentWillUnmount () {
    clearInterval(setCode);
  }

  onPickChange (e) {
    const value = Number(e.detail.value);
    this.setState({
      selectIndex: value
    });
    this.props.dispatchInfo({
      type: value
    });
  }

  uploadImage () {
    const vm = this;
    const { qualificationDocumentsImgList } = this.state;
    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        upload({
          filePath: tempFilePaths,
          module: 'report'
        }).then((res: string) => {
          Taro.hideLoading();
          const result = JSON.parse(res);
          const data = result.data;
          qualificationDocumentsImgList.push(data);
          vm.setState({
            qualificationDocumentsImgList: JSON.parse(JSON.stringify(qualificationDocumentsImgList))
          });
          vm.props.dispatchInfo({
            qualificationDocumentsImg: qualificationDocumentsImgList
          });
        });
      }
    });
  }

  delImage (index) {
    const { qualificationDocumentsImgList } = this.state;
    const vm = this;
    qualificationDocumentsImgList.splice(index);
    vm.setState({
      qualificationDocumentsImgList: JSON.parse(JSON.stringify(qualificationDocumentsImgList))
    });
    vm.props.dispatchInfo({
      qualificationDocumentsImg: qualificationDocumentsImgList
    });
  }

  send () {
    const vm = this;
    const { isSend } = this.state;
    const { contactMobile } = this.props.insurance.insuranceInfo;
    if (!contactMobile || isSend) {
      return;
    }
    vm.setState({
      isSend: true
    });
    time = 60;
    sendMessage({ mobile: contactMobile }).then(() => {
      setCode = setInterval(() => {
        if (!time) {
          time = 60;
          setCode && clearInterval(setCode);
          vm.setState({
            codeText: '重新获取',
            isSend: false
          });
        } else {
          time--;
          vm.setState({
            codeText: `${time}s`,
            isSend: true
          });
        }
      }, 1000);
    });
  }

  render () {
    const { selectIndex, qualificationDocumentsImgList, codeText, isSend } = this.state;
    return (
        <View className='component-policy-holder'>
            <View className='product-title flex'>
                <Text>投保人信息</Text>
            </View>
            <View className='input-item flex no-border'>
                <View className='left flex'>
                    <Text>投保企业名称</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  onBlur={(e) => {
                    this.props.dispatchInfo({
                      companyName: e.detail.value
                    });
                  }}
                  placeholder='请填写与营业执照上一致的企业名称'
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>公司证件类型</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <View className='right flex'>
                    <Picker mode='selector'
                      onChange={this.onPickChange.bind(this)}
                      range={pickList}
                      value={selectIndex}
                      rangeKey='text'
                      className='picker flex'
                    >
                        <View className='picker'>
                            <View className='date'>{pickList[selectIndex].text}</View>
                        </View>
                    </Picker>
                    <Image src={`${ossHost}images/next.png`} className='next'></Image>
                </View>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>公司证件号码</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='与社会统一信用代码一致'
                  onBlur={
                        (e) => {
                          this.props.dispatchInfo({
                            identificationNumber: e.detail.value
                          });
                        }
                    }
                >
                </Input>
            </View>
            <View className='file flex'>
                <View className='file-title flex'>
                    <Text>资质证明文件</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Text className='tips'>仅支持.jpg/.jpeg/png格式，大小不超过4M（没有三证合一的地区，请将营业执照、组织机构代码证和税务登记证分别上传</Text>
                <View className='img-list flex'>
                    {
                        qualificationDocumentsImgList.length
                          ? (
                              qualificationDocumentsImgList.map((item, index) => {
                                return (
                                    <View className='img-item' key={index}>
                                        <Image className='img' src={item}></Image>
                                        <Image src={`${ossHost}images/delete.png`} className='del' onClick={
                                            () => {
                                              this.delImage(index);
                                            }
                                        }
                                        ></Image>
                                    </View>
                                );
                              })
                            )
                          : null
                    }
                    {
                        qualificationDocumentsImgList.length < 3
                          ? (
                            <View className='add flex' onClick={() => {
                              this.uploadImage();
                            }}
                            >
                                <Image className='add-icon' src={`${ossHost}images/add.png`} ></Image>
                        </View>
                            )
                          : null
                    }

                </View>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>办公电话</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='电话格式：021-12345678'
                  onBlur={(e) => {
                    this.props.dispatchInfo({
                      officePhone: e.detail.value
                    });
                  }}
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>联系人</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='请输入姓名'
                  onBlur={(e) => {
                    this.props.dispatchInfo({
                      contactPerson: e.detail.value
                    });
                  }}
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>联系人手机号</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='请输入手机号'
                  onBlur={(e) => {
                    this.props.dispatchInfo({
                      contactMobile: e.detail.value
                    });
                  }}
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>验证码</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <View className='right flex'>
                    <Input className='input'
                      placeholderClass='placeholder'
                      placeholder='请输入手机验证码'
                      onBlur={(e) => {
                        this.props.dispatchInfo({
                          validCode: e.detail.value
                        });
                      }}
                    >
                    </Input>
                    <View className={`send flex ${isSend ? 'disable' : ''}`} onClick={() => { this.send(); }}>{codeText}</View>
                </View>

            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>联系人电子邮箱</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='请输入电子邮箱'
                  onBlur={(e) => {
                    this.props.dispatchInfo({
                      contactEmail: e.detail.value
                    });
                  }}
                >
                </Input>
            </View>
        </View>);
  }
}
export default PolicyHolder;
