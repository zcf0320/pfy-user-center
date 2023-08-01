import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import Page from '@components/page';
import { protocolList } from '@actions/common';
import './index.scss';

interface IState {
  list: any;
}
class Protocol extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.userAgreement });
    protocolList().then(res => {
      this.setState({
        list: res
      });
    });
  }

  goProto = index => {
    Taro.navigateTo({
      url: `/pages/protocal/all/index?index=${index}`
    });
  };

  render () {
    return (
      <Page showBack title={i18n.chain.user.userAgreement}>
        <View className='page-protocal flex'>
          {this.state.list.map(item => {
            return (
              <View
                key={item.id}
                className='view-common flex'
                onClick={() => {
                  this.goProto(item.type);
                }}
              >
                <Text>
                  {item.title}
                  {item.version}
                </Text>
                <View className='next'></View>
              </View>
            );
          })}

          <View
            className='log'
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/protocal/log/index'
              });
            }}
          >
            -{i18n.chain.user.operationLog}-
          </View>
        </View>
      </Page>
    );
  }
}
export default Protocol;
