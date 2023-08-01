
import { Component } from 'react';
import { SET_MODAL } from '@constants/common';
import utils from '@utils/index';
import { SET_PROSON_INSURANCE_INFO } from '@constants/insurance';
import { View, Input, Image, Picker, Text } from '@tarojs/components';
import { connect } from 'react-redux';
import { PersonalInfo } from '../type';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps{
    personInsuranceInfo?: PersonalInfo;
    setPersonInsuranceInfo?: Function;
    configShip?: Array<any>;
    index: number;
    setCustomModal?: Function;
}

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
  return Object.assign({}, state.common, state.insurance);
}, dispatch => ({
  setPersonInsuranceInfo (data) {
    dispatch({
      type: SET_PROSON_INSURANCE_INFO,
      payload: data
    });
  },
  setCustomModal (data) {
    dispatch({
      type: SET_MODAL,
      payload: data
    });
  }
}))
class Beneficiary extends Component<IProps> {
    // 投保关系的改变
    onShipChange = (e) => {
      console.log(e.detail.value);
      this.setBeneficiaryList({
        relationship: Number(e.detail.value) + 1
      });
    }

    getShipNameByValue = () => {
      const { relationship } = this.props.personInsuranceInfo || {};
      const configShip = this.props.configShip || [];
      let name = '';
      if (configShip.length) {
        const search = configShip.find(x => x.rootId === relationship);
        name = search.rootName;
      }
      return name;
    }

    // 输入框
    handleInput (key, value) {
      const { index } = this.props;
      this.props.personInsuranceInfo.beneficiaryList[index][key] = value.detail.value;
      this.props.setPersonInsuranceInfo(this.props.personInsuranceInfo);
    }

    setBeneficiaryList (data) {
      const { index, personInsuranceInfo } = this.props;
      const { beneficiaryList } = personInsuranceInfo;

      this.props.personInsuranceInfo.beneficiaryList[index] = Object.assign({}, beneficiaryList[index], data);
      this.props.setPersonInsuranceInfo(this.props.personInsuranceInfo);
    }

    del = () => {
      this.props.setCustomModal({
        show: true,
        content: '确认要删除吗',
        cancelText: '确认',
        confirmText: '取消',
        clickCancel: () => {
          const { index, personInsuranceInfo } = this.props;
          // const { beneficiaryList } = personInsuranceInfo
          this.props.personInsuranceInfo.beneficiaryList.splice(index, 1);
          this.props.setPersonInsuranceInfo(personInsuranceInfo);
        },
        clickConfirm: () => {
          // do something
        }

      });
    }

    render () {
      const { index, personInsuranceInfo } = this.props;
      const { beneficiaryList } = personInsuranceInfo;
      const { relationship, beneficiaryName, beneficiaryCertificateType, beneficiaryMobile, beneficiaryCodeNumber, benefitRatio } = beneficiaryList[index];
      return <View className='component-beneficiary'>
            <View className='common common-info'>
                <View className='title'>受益人{index + 1}</View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text className='text'>被保人关系</Text>
                        <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                    </View>
                    <View className='right flex'>
                        <Picker mode='selector' className='picker' range={shipList} value={[relationship - 1]} rangeKey='rootName' onChange={this.onShipChange}>
                            <Text className='address'>{shipList[relationship - 1].rootName}</Text>
                        </Picker>
                        <Image src={`${ossHost}images/next.png`} className='next'></Image>
                    </View>
                </View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text>姓名</Text>
                        <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                    </View>
                    <Input value={beneficiaryName}
                      type='text'
                      placeholder='请输入姓名'
                      adjust-position={false}
                      placeholderClass='placeholder'
                      onBlur={this.handleInput.bind(this, 'beneficiaryName')}
                      className='input'
                    ></Input>
                </View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text className='text'>证件类型</Text>
                    </View>
                    <View className='right flex'>
                        <Picker mode='selector' className='picker' range={typeList} value={[beneficiaryCertificateType - 1]} rangeKey='rootName' onChange={(e) => {
                          this.setBeneficiaryList({
                            beneficiaryCertificateType: Number(e.detail.value) + 1
                          });
                        }} range-key='rootName'
                        >
                            <Text className='address'>{typeList[beneficiaryCertificateType - 1].rootName}</Text>
                        </Picker>
                        <Image src={`${ossHost}images/next.png`} className='next'></Image>
                    </View>
                </View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text className='text'>证件号码</Text>
                        <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                    </View>
                    <Input value={beneficiaryCodeNumber}
                      type='idcard'
                      placeholder='请输入受益人证件号码'
                      adjustPosition
                      maxlength={18}
                      placeholderClass='placeholder'
                      onBlur={this.handleInput.bind(this, 'beneficiaryCodeNumber')}

                      className='input'
                    ></Input>
                </View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text className='text'>受益比例(%)</Text>
                        <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                    </View>
                    <Input value={benefitRatio}
                      type='idcard'
                      placeholder='请输入受益人比例'
                      adjustPosition
                      maxlength={3}
                      placeholderClass='placeholder'
                      onBlur={this.handleInput.bind(this, 'benefitRatio')}

                      className='input'
                    ></Input>
                </View>
                <View className='common-item flex'>
                    <View className='label flex'>
                        <Text className='text'>受益人手机号</Text>
                        <Image src={`${ossHost}images/must.png`} className='icon-must'></Image>
                    </View>
                    <Input value={beneficiaryMobile}
                      type='idcard'
                      placeholder='请输入受益人手机号'
                      adjustPosition
                      maxlength={11}
                      placeholderClass='placeholder'
                      onBlur={this.handleInput.bind(this, 'beneficiaryMobile')}
                      className='input'
                    ></Input>
                </View>
                {
                    beneficiaryList.length > 1
                      ? <View className='common-item flex del' onClick={() => {
                        this.del();
                      }}
                      >
                        删除
                    </View>
                      : null
                }

            </View>
        </View>;
    }
}
export default Beneficiary;
