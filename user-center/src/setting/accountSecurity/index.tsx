import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import { SET_MODAL } from '@constants/common';
import { connect } from 'react-redux';
import { logout } from '@actions/user';
import Page from '@components/page';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  name: string;
  mobile: string;
  showReason: boolean;
  reasonList: Array<any>;
  reason: string;
  showSuccess: boolean;
}
interface IProps {
  onSetModal: Function;
}
@connect(
  state => state,
  dispatch => ({
    onSetModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class AccountSecurity extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      showReason: false,
      reasonList: [
        { text: i18n.chain.userInfo.cancellation1, select: false },
        { text: i18n.chain.userInfo.cancellation2, select: false },
        { text: i18n.chain.userInfo.cancellation3, select: false },
        { text: i18n.chain.userInfo.cancellation4, select: false },
        { text: i18n.chain.userInfo.cancellation5, select: false }
      ],
      reason: '',
      showSuccess: false
    };
  }

  componentDidMount () {
    const { checkSession } = utils.Auth;
    checkSession(true);
  }

  go (val) {
    let url = '/setting/editInfo/index';
    val === 'work' && (url = '/setting/workInfo/index');
    val === 'phone' && (url = '/setting/editPhone/index');
    Taro.navigateTo({
      url
    });
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;
    utils.Auth.checkSession(true).then(res => {
      Taro.setStorageSync(userInfo, res);
      const { name, mobile } = res;
      this.setState({
        name,
        mobile
      });
    });
  }

  logout () {
    this.props.onSetModal({
      show: true,
      title: i18n.chain.userInfo.accountCancellation,
      content: i18n.chain.userInfo.isSure,
      subTitle: i18n.chain.userInfo.willDelData,
      cancelColor: 'linear-gradient(166deg, #FDC195 0%, #FD665A 100%)',
      confirmColor: 'linear-gradient(180deg, #E9E5E5 0%, #CCCCCC 100%)',
      cancelActive: false,
      confirmActive: true,
      cancelText: i18n.chain.button.cancel,
      confirmText: i18n.chain.button.confirm,
      clickCancel: () => {},
      clickConfirm: () => {
        this.setState({
          showReason: true
        });
      }
    });
  }

  selectReason (text) {
    const { reasonList } = this.state;
    const reasons = [] as any;
    reasonList.forEach(item => {
      if (item.text === text) {
        item.select = !item.select;
      }
      if (item.select) {
        reasons.push(item.text);
      }
    });
    this.setState({
      reasonList,
      reason: reasons.toString()
    });
  }

  clickConfirm () {
    const { reason } = this.state;
    if (!reason) {
      Taro.showToast({
        title: i18n.chain.userInfo.selectReason,
        icon: 'none'
      });
      return;
    }
    logout(reason).then(() => {
      this.setState({
        showReason: false,
        showSuccess: true
      });
      setTimeout(() => {
        this.setState({
          showSuccess: false
        });
        const { userInfo, weixinUserInfo, xAccessToken } = utils.appConfig;
        Taro.removeStorageSync(userInfo);
        Taro.removeStorageSync(weixinUserInfo);
        Taro.removeStorageSync(xAccessToken);
        Taro.reLaunch({
          url: '/pages/user/index/index'
        });
      }, 3000);
    });
  }

  render () {
    const { showReason, reasonList, showSuccess } = this.state;
    return (
      <Page showBack title={i18n.chain.userInfo.accountSecurity}>
        <View className='page-info flex'>
          <View className='common-item flex m-t-20'>
            <View className='bord-b flex'>
              <View className='left flex'>
                <Image
                  className='left-icon'
                  src={`${ossHost}icon_userName.svg`}
                ></Image>
                <Text>{i18n.chain.userInfo.userName}</Text>
              </View>
              <Text className='disable'>{this.state.name || ''}</Text>
            </View>
          </View>
          <View
            className='common-item flex'
            onClick={this.go.bind(this, 'phone')}
          >
            <View className='left flex'>
              <Image
                className='left-icon'
                src={`${ossHost}icon_editPhone.svg`}
              ></Image>
              <Text>{i18n.chain.userInfo.editPhone}</Text>
            </View>
            <View className='right flex'>
              <Text>{utils.hidePhone(this.state.mobile)}</Text>
              <Image src={`${ossHost}images/next.png`} className='next'></Image>
            </View>
          </View>
          <View
            className='common-item btn m-t-20'
            onClick={this.logout.bind(this)}
          >
            <Text>{i18n.chain.userInfo.accountCancellation}</Text>
          </View>
        </View>
        {showReason
          ? (
          <View className='custom-modal'>
            <View
              className={`custom-modal-content ${showReason ? 'show' : ''}`}
            >
              <View className='title flex'>
                {i18n.chain.userInfo.submitReason}
              </View>
              <View className='modal-content flex'>
                <View className='content-text'>
                  {reasonList.map(item => {
                    return (
                      <View
                        className={`reason-item ${item.select ? 'active' : ''}`}
                        key={item.text}
                        onClick={() => {
                          this.selectReason(item.text);
                        }}
                      >
                        {item.text}
                      </View>
                    );
                  })}
                </View>

                <View className='action-list flex'>
                  <View
                    className='action-item cancel flex'
                    onClick={() => {
                      reasonList.forEach(item => {
                        item.select = false;
                      });
                      this.setState({
                        showReason: false,
                        reason: ''
                      });
                    }}
                  >
                    {i18n.chain.button.cancel}
                  </View>

                  <View
                    className='action-item confirm flex'
                    onClick={() => {
                      this.clickConfirm();
                    }}
                  >
                    {i18n.chain.button.submit}
                  </View>
                </View>
              </View>
            </View>
          </View>
            )
          : null}
        {showSuccess
          ? (
          <View className='logout-modal'>
            <View className='logout-modal-content'>
              <Image className='icon' src={`${ossHost}images/logout-success.png`}></Image>
              <View className='title'>{i18n.chain.userInfo.success}</View>
              <View className='sub-title'>{i18n.chain.userInfo.logOut}</View>
            </View>
          </View>
            )
          : null}
      </Page>
    );
  }
}
export default AccountSecurity;
