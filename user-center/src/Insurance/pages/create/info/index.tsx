
import { Component } from 'react';
import { View, Image, Input, Text, Picker } from '@tarojs/components';
import { connect } from 'react-redux';
import { SET_PROSON_INSURANCE_INFO } from '@constants/insurance';
import utils from '@utils/index';
import { PersonalInfo } from '../type';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    personInsuranceInfo: PersonalInfo;
    setPersonInsuranceInfo: Function;
    getPrice: Function;
}
const typeList = [{
  rootName: '身份证',
  value: 1
}, {
  rootName: '护照',
  value: 2
}];
@connect(state => {
  return Object.assign({}, state.insurance);
}, dispatch => ({
  setPersonInsuranceInfo (data) {
    dispatch({
      type: SET_PROSON_INSURANCE_INFO,
      payload: data
    });
  }
}))
class Info extends Component<IProps> {
    // 输入框
    handleInput = async (key, value) => {
      const { relationship, policyHolderCertificateType } = this.props.personInsuranceInfo;
      // 如果是本人
      if (relationship === 1) {
        key === 'policyHolderName' && (this.props.personInsuranceInfo.insuredName = value.detail.value);
        key === 'policyHolderCodeNumber' && (this.props.personInsuranceInfo.insuredCodeNumber = value.detail.value);
        key === 'policyHolderMobile' && (this.props.personInsuranceInfo.insuredMobile = value.detail.value);
        key === 'policyHolderEmail' && (this.props.personInsuranceInfo.insuredEmail = value.detail.value);
      }
      if (key === 'policyHolderCodeNumber' && policyHolderCertificateType === 1) {
        this.props.personInsuranceInfo.policyholderAge = this.getInfoByIdCard(value.detail.value) || '';
        relationship === 1 && (this.props.personInsuranceInfo.insuredAge = this.getInfoByIdCard(value.detail.value) || '');
      }
      this.props.personInsuranceInfo[key] = value.detail.value;
      await this.props.setPersonInsuranceInfo(this.props.personInsuranceInfo);
      if (key === 'policyHolderCodeNumber' && policyHolderCertificateType === 1 && relationship === 1) {
        this.props.getPrice();
      }
    }

    getInfoByIdCard (idCard) {
      const { checkIdCard, getAgeByIdCard } = utils;
      // 校验身份证是否正确
      if (!checkIdCard(idCard)) {
        // Taro.showToast({
        //     title: '身份证输入错误',
        //     icon: 'none',
        //     duration: 3000
        // })
        return;
      }
      return getAgeByIdCard(idCard);
    }

    onBirthChange = (e) => {
      this.props.setPersonInsuranceInfo({
        policyHolderBirth: e.detail.value
      });
    }

    render () {
      const { relationship, policyHolderName, insuredCertificateType, policyholderAge, policyHolderCodeNumber, policyHolderMobile, policyHolderEmail, policyHolderCertificateType } = this.props.personInsuranceInfo;
      return (
            <View className='component-info'>
                <View className='common'>
                    <View className='title'>投保人信息</View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>姓名</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <Input value={policyHolderName}
                          type='text'
                          placeholder='请输入投保人姓名'
                          placeholderClass='placeholder'
                          adjustPosition
                          onBlur={this.handleInput.bind(this, 'policyHolderName')}
                          className='input'
                        ></Input>
                    </View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>证件类型</Text>
                            {/* <Image src={mustIcon} className='icon-must'></Image> */}
                        </View>
                        <View className='right flex'>
                            <Picker
                              mode='selector' className='picker'
                              range={typeList} value={policyHolderCertificateType - 1}
                              rangeKey='rootName'
                              onChange={(e) => {
                                this.props.setPersonInsuranceInfo({
                                  policyHolderCertificateType: Number(e.detail.value) + 1,
                                  insuredCertificateType: relationship === 1 ? Number(e.detail.value) + 1 : insuredCertificateType
                                });
                              }}
                            >
                                <Text className='address'>{typeList[policyHolderCertificateType - 1].rootName}</Text>
                            </Picker>
                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                        </View>
                    </View>

                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>证件号码</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        {/* <View className="right flex"> */}
                            <Input value={policyHolderCodeNumber}
                              type='idcard'
                              placeholder='请输入投保人证件号码'
                              adjustPosition
                              maxlength={18}
                              placeholderClass='placeholder'
                              onBlur={this.handleInput.bind(this, 'policyHolderCodeNumber')}
                                // onBlur={(e)=>{
                                //     this.isSelf() && this.getInfoByIdCard(e.detail.value)
                                // }}
                              className='input'
                            ></Input>
                        {/* </View> */}

                    </View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>年龄</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        {/* <View className='right flex'> */}
                            <Input value={policyholderAge}
                              type='number'
                              placeholder='请输入投保人年龄'
                              placeholderClass='placeholder'
                              adjustPosition
                              maxlength={2}
                              disabled={!!(policyHolderCertificateType === 1)}
                              onBlur={this.handleInput.bind(this, 'policyholderAge')}
                              className='input'
                            ></Input>

                    </View>
                    <View className='common-item flex'>
                        <View className='label flex'>
                            <Text className='text'>手机号</Text>
                            <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                        </View>
                        <Input value={policyHolderMobile}
                          type='number'
                          maxlength={11}
                          adjustPosition
                          placeholder='请输入投保人手机号'
                          placeholderClass='placeholder'
                          onBlur={this.handleInput.bind(this, 'policyHolderMobile')}
                          className='input'
                        ></Input>
                    </View>
                    <View className='common-item flex'>
                        <View className='label'>电子邮箱</View>
                        <Input value={policyHolderEmail}
                          type='text'
                          placeholder='选填'
                          adjustPosition
                          onBlur={this.handleInput.bind(this, 'policyHolderEmail')}
                          placeholderClass='placeholder'
                          className='input'
                        ></Input>
                    </View>
                </View>
            </View>
      );
    }
}
export default Info;
