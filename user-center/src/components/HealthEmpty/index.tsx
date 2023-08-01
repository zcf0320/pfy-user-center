import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import LoginModal from '@components/loginModal';
import i18n from '@i18n/index';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title?: string;
  drug: boolean;
  showBtn?: boolean;
  url?: string;
}
interface IState {
  showLoginModal: boolean;
}
class HealthEmpty extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showLoginModal: false
    };
  }

  goUrl () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const {
      token
    } = user;

    if (!token) {
      this.setState({
        showLoginModal: true
      });
      return;
    }
    if (this.props.url) {
      Taro.navigateTo({
        url: this.props.url
      });
    }
  }

  render () {
    const { showLoginModal } = this.state;
    return (
      <View className='component-empty-box flex '>
        {!this.props.drug
          ? (
          <Image
            src={`${ossHost}claims_no_record.png`}
            className='empty-icon'
          ></Image>
            )
          : (
          <Image
            src={`${ossHost}drug_none.png`}
            className='empty-drug'
          ></Image>
            )}
        <Text>{this.props.title ? this.props.title : '暂无服务'}</Text>
        {this.props.showBtn
          ? (
          <View className='go-btn' onClick={this.goUrl.bind(this)}>
            {i18n.chain.myServicePage.toExchange}
          </View>
            )
          : null}
          {showLoginModal
            ? (
            <LoginModal
              showState={showLoginModal}
              noLogin={() => {
                this.setState({
                  showLoginModal: false
                });
              }}
              goLogin={() => {
                this.setState({
                  showLoginModal: false
                });
              }}
            ></LoginModal>
              )
            : null}
      </View>
    );
  }
}
export default HealthEmpty;
