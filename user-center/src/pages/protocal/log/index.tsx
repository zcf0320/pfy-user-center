import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import Page from '@components/page';
import { protocolLog } from '@actions/common';
import dayjs from 'dayjs';
import './index.scss';

interface IState {
  list: any;
}
class Log extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.operationLog });
    // const { userInfo } = utils.appConfig;
    // const user = Taro.getStorageSync(userInfo);
    protocolLog().then(res => {
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
    const { list } = this.state;
    return (
      <Page showBack title={i18n.chain.user.operationLog}>
        <View className='page-log flex'>
          <View className='log-content'>
            {list.map(item => {
              return (
                <View key={item.createTime} className='item'>
                  <View className='item-top flex'>
                    <View
                      className={`icon ${item.userId === '0' && 'plate'}`}
                    ></View>
                    <Text>
                      {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </View>
                  {item.userId !== '0' && (
                    <View className='item-bottom'>
                      {i18n.chain.user.user}{item.userName}
                      {i18n.chain.user.readAndAgree}{item.protocolNameList.join('、')}
                    </View>
                  )}
                  {item.userId === '0' && (
                    <View className='item-bottom'>
                    {i18n.chain.user.ghcareUpdate}{item.protocolNameList.join('、')}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    );
  }
}
export default Log;
