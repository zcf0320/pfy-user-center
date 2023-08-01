import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { register } from '@actions/common';
import './index.scss';

interface IState {
  userInfo: {
    name?: string;
    mobile?: string;
    idCard?: string;
    age?: number;
    sex?: number;
  };
}
class EditInfo extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: {}
    };
  }

  componentDidMount () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    this.setState({
      userInfo: user
    });
  }

  save = () => {
    const { name, idCard } = this.state.userInfo;
    const { userInfo, xAccessToken } = utils.appConfig;
    if (!name || !idCard) {
      return;
    }
    register({
      name,
      idCard
    }).then(res => {
      Taro.setStorageSync(userInfo, res);
      Taro.setStorageSync(xAccessToken, res.token);
    });
  };

  render () {
    const { name, idCard } = this.state.userInfo;
    return (
      <Page showBack title='基本信息'>
        <View className='page-edit-info flex'>
          <View className='common-item flex m-t-16 no-border'>
            <View className='left flex no-border'>
              <View className='label'>真实姓名</View>
              <Input
                type='text'
                value={name}
                placeholder='请输入您的姓名'
                className='input'
                placeholderClass='placeholder'
                onInput={e => {
                  const data = Object.assign({}, this.state.userInfo, {
                    name: e.detail.value
                  });
                  this.setState({
                    userInfo: data
                  });
                }}
              ></Input>
            </View>
          </View>
          <View className='common-item flex  m-t-16'>
            <View className='left flex'>
              <View className='label'>身份证号</View>
              <Input
                type='idcard'
                value={idCard}
                placeholder='请输入您的身份证号'
                className='input'
                placeholderClass='placeholder'
                onInput={e => {
                  const data = Object.assign({}, this.state.userInfo, {
                    idCard: e.detail.value
                  });
                  this.setState({
                    userInfo: data
                  });
                }}
              ></Input>
            </View>
          </View>
          <Text className='tips'>
            *已购买保单的用户请认证被保人信息，以便查看保单权益
          </Text>
          <View
            className={`input-info flex ${!name || !idCard ? 'disable' : ''}`}
            onClick={() => {
              this.save();
            }}
          >
            确认
          </View>
        </View>
      </Page>
    );
  }
}
export default EditInfo;
