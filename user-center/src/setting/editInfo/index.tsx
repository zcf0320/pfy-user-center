import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { getIdCard } from '@actions/common';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  userInfo: {
    name?: string;
    mobile?: string;
    idCard?: string;
    age?: number;
    sex?: number;
    hasIdCard?: any;
  };
}
class InputInfo extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: {}
    };
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;

    const user = Taro.getStorageSync(userInfo) || {};
    getIdCard().then(res => {
      user.idCard = res;
      this.setState({
        userInfo: user
      });
    });
  }

  render () {
    const { name, idCard, age, sex, hasIdCard } = this.state.userInfo;
    return (
      <Page showBack title={i18n.chain.userInfo.baseInfo}>
        <View className='page-edit-info flex '>
          <View className='common-item flex m-t-16 no-border'>
            <View className='left flex no-border'>
              <View className='label'>{i18n.chain.userInfo.realName}</View>
              <Text className='no-edit'>{name || '-'} </Text>
            </View>
          </View>
          <View className='common-item flex  m-t-16'>
            <View className='left flex'>
              <View className='label'>{i18n.chain.userInfo.idCard}</View>
              <Text className='no-edit'>{idCard || '-'} </Text>
            </View>
          </View>
          <View className='common-item flex m-t-13'>
            <View className='left flex'>
              <View className='label'>{i18n.chain.userInfo.age}</View>
              <Text className='no-edit'>{age || '-'} </Text>
            </View>
          </View>
          <View className='common-item flex no-border'>
            <View className='left flex no-border'>
              <View className='label'>{i18n.chain.userInfo.sex}</View>
              <Text className='no-edit'>
                {sex !== null ? (sex === 1 ? i18n.chain.userInfo.boy : i18n.chain.userInfo.girl) : '-'}
              </Text>
            </View>
          </View>
          {!hasIdCard
            ? (
            <View
              className='input-info flex'
              onClick={() => {
                Taro.navigateTo({
                  url: '/setting/inputInfo/index'
                });
              }}
            >
              {i18n.chain.userInfo.auth}
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default InputInfo;
