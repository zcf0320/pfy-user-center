import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import utils from '@utils/index';
import { connect } from 'react-redux';
import { SET_INSURANCE_INFO } from '@constants/insurance';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    peopleIndex: number;
    detail: any;
    insurance: any;
    setInfo: Function;
    del: Function;
}
@connect(state => state, dispatch => ({
  setInfo (data) {
    dispatch({
      type: SET_INSURANCE_INFO,
      payload: data
    });
  },
  del (data) {
    dispatch({
      type: SET_INSURANCE_INFO,
      payload: data
    });
  }
}))
class Insured extends Component<IProps> {
    getInfoByIdCard = (idCard) => {
      const { getSexByIdCard, checkIdCard, getAgeByIdCard } = utils;
      // 校验身份证是否正确
      if (!checkIdCard(idCard)) {
        return;
      }
      this.dispatchInfo({
        idCard,
        age: getAgeByIdCard(idCard),
        sex: getSexByIdCard(idCard)
      });
    }

    dispatchInfo (data) {
      const { insuredInfos } = this.props.insurance.insuranceInfo;
      // 只修改当前的内容
      const result = Object.assign({}, insuredInfos[this.props.peopleIndex], data);
      insuredInfos[this.props.peopleIndex] = result;
      this.props.setInfo(insuredInfos);
    }

    // 删除
    del () {
      const vm = this;
      Taro.showModal({
        content: '确认要删除吗',
        confirmText: '取消',
        cancelText: '确定',
        confirmColor: '#FE9A51',
        cancelColor: '#9D9FA2',
        success: function (res) {
          if (res.confirm) {
            // do something
          } else if (res.cancel) {
            vm.props.insurance.insuranceInfo.insuredInfos.splice(vm.props.peopleIndex);
            vm.props.del(vm.props.insurance.insuranceInfo);
          }
        }
      });
    }

    render () {
      return (
            <View className='component-insured'>
            <View className='input-item flex no-border'>
                <View className='left flex'>
                    <Text>姓名</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='请填写姓名'
                  value={this.props.detail.name}
                  onBlur={(e) => {
                    this.dispatchInfo({
                      name: e.detail.value
                    });
                  }}
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>证件类型</Text>
                </View>
                <View className='right'>身份证</View>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>证件号码</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input className='right'
                  placeholderClass='placeholder'
                  placeholder='请填写证件号码'
                  value={this.props.detail.idCard}
                  onBlur={(e) => {
                    this.getInfoByIdCard(e.detail.value);
                  }}
                >
                </Input>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>性别</Text>
                </View>
                <View className='right'>{this.props.detail.sex}</View>
            </View>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>年龄</Text>
                </View>
                <View className='right'>{this.props.detail.age}</View>
            </View>
            <View className='input-item flex border-bottom' onClick={() => {
              Taro.navigateTo({
                url: `/Insurance/pages/profession/index?peopleIndex=${this.props.peopleIndex}&type=2`
              });
            }}
            >
                <View className='left flex'>
                    <Text>职业</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <View className='right flex'>
                    <View className='text'>{this.props.detail.jobName || '-'}</View>
                    <Image src={`${ossHost}images/next.png`} className='next'></Image>
                </View>
            </View>
            <View className='del flex' onClick={() => {
              this.del();
            }}
            >删除</View>

        </View>
      );
    }
}

export default Insured;
