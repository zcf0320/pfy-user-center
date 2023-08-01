import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { SET_MODAL } from '@constants/common';
import Page from '@components/page';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  onSetModal: Function;
  saveData: Function;
}
@connect(
  state => {
    return Object.assign({}, state.user, state.common, state.healthy);
  },
  dispatch => ({
    onSetModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class Info extends Component<IProps> {
  go (val) {
    let url = '/setting/editInfo/index';
    val === 'work' && (url = '/setting/workInfo/index');
    val === 'phone' && (url = '/setting/editPhone/index');
    val === 'account' && (url = '/setting/accountSecurity/index');
    Taro.navigateTo({
      url
    });
  }

  logout () {
    this.props.onSetModal({
      title: i18n.chain.common.tips,
      show: true,
      content: i18n.chain.user.logoutSure,
      cancelActive: false,
      confirmActive: true,
      cancelText: i18n.chain.button.exit,
      confirmText: i18n.chain.button.cancel,
      clickCancel: () => {
        const { userInfo, weixinUserInfo, xAccessToken } = utils.appConfig;
        Taro.removeStorageSync(userInfo);
        Taro.removeStorageSync(weixinUserInfo);
        Taro.removeStorageSync(xAccessToken);
        Taro.reLaunch({
          url: '/pages/user/index/index'
        });
      },
      clickConfirm: () => {

      }
    });
  }

  render () {
    return (
      <Page showBack title={i18n.chain.userInfo.title}>
        <View className='page-info flex'>
          <View
            className='common-item flex m-t-16'
            onClick={this.go.bind(this)}
          >
            <View className='bord-b flex'>
              <View className='left flex'>
                <Image
                  className='left-icon'
                  src={`${ossHost}user_info.png`}
                ></Image>
                <Text>{i18n.chain.userInfo.baseInfo}</Text>
              </View>

              <Image src={`${ossHost}images/next.png`} className='next'></Image>
            </View>
          </View>
          <View
            className='common-item flex'
            onClick={this.go.bind(this, 'work')}
          >
          <View className='bord-b flex'>
            <View className='left flex'>
              <Image
                className='left-icon'
                src={`${ossHost}work_info.png`}
              ></Image>
              <Text>{i18n.chain.userInfo.work}</Text>
            </View>
            <Image src={`${ossHost}images/next.png`} className='next'></Image>
            </View>
          </View>
          <View
            className='common-item flex'
            onClick={this.go.bind(this, 'account')}
          >
            <View className='left flex'>
              <Image
                className='left-icon'
                src={`${ossHost}images/account-security.png`}
              ></Image>
              <Text>{i18n.chain.userInfo.accountSecurity}</Text>
            </View>

            <Image src={`${ossHost}images/next.png`} className='next'></Image>
        </View>
            <View className='logout flex' onClick={() => { this.logout(); }}>
              {i18n.chain.user.logout}
            </View>

        </View>
      </Page>
    );
  }
}
export default Info;
