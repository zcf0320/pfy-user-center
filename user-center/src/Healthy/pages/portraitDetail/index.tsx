import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import AuthModal from '@components/AuthModal';
import utils from '@utils/index';
import { getUserPortrait } from '@actions/healthy';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  user: any;
  list: any;
  showModal: boolean;
}
class PortraitDetail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      user: {},
      list: [],
      showModal: false
    };
  }

  componentDidMount () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    this.setState({
      user
    });
    getUserPortrait().then(res => {
      this.setState({
        list: res
      });
    });
  }

  goHealth = () => {
    const { hasIdCard } = this.state.user;

    if (hasIdCard) {
      Taro.switchTab({
        url: '/Healthy/pages/index'
      });
    } else {
      this.setState({
        showModal: true
      });
    }
  };

  render () {
    const { list, user, showModal } = this.state;
    const { sex, name } = user;
    return (
      <Page showBack title={i18n.chain.healthPortrait.title}>
        <View className='page-portrait-detail'>
          <View className='portratit-title'>{name}</View>
          <View className='limit'>
            {i18n.chain.healthPortrait.beenGenerated}
          </View>
          <View className='tag-list flex'>
            {list.length &&
              list.map(item => {
                return (
                  <View className='tag-item flex' key={item}>
                    <View className='add-icon'></View>
                    <Text>{item}</Text>
                  </View>
                );
              })}
            <View className={`head ${sex ? 'man' : ''}`}></View>
          </View>
          <View className='tips'>
            <Text className='go' onClick={this.goHealth}>
              {i18n.chain.healthPortrait.improve}
            </Text>
            <Text>{i18n.chain.healthPortrait.helpGenerate}</Text>
          </View>
          <View
            className='bottom flex'
            onClick={() => {
              Taro.redirectTo({
                url: '/Healthy/pages/portrait/index'
              });
            }}
          >
            {i18n.chain.healthPortrait.regenerate}
          </View>
        </View>
        {showModal && (
          <AuthModal
            onConfirm={() => {
              this.setState({
                showModal: false
              });
              Taro.navigateTo({
                url: '/pages/register/index?isJump=true'
              });
            }}
            onCancel={() => {
              this.setState({
                showModal: false
              });
            }}
          ></AuthModal>
        )}
      </Page>
    );
  }
}
export default PortraitDetail;
