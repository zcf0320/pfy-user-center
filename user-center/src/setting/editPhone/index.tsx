import Taro from '@tarojs/taro';
import { View, Input, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { editPhone } from '@actions/user';
import { updatePhoneSms } from '@actions/common';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import './index.scss';

interface IProps {
  sendMessage: Function;
  editPhone: Function;
}
interface IState {
  codeText: string;
  mobile: string;
  validCode: string;
  phone: string;
  isSend: boolean;
}
// 倒计时的60s
let time = 60;
@connect(
  state => state.user,
  () => ({
    sendMessage (params) {
      return updatePhoneSms(params);
    },
    editPhone (params) {
      return editPhone(params);
    }
  })
)
class EditPhone extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      codeText: i18n.chain.userInfo.send,
      validCode: '',
      mobile: '',
      phone: '',
      isSend: false
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.modifyMobile });
    const { checkSession } = utils.Auth;
    checkSession(true).then(res => {
      const { mobile } = res;
      this.setState({
        phone: mobile
      });
    });
  }

  // 发送短信
  sendMessage () {
    const vm = this;
    const { mobile, phone } = this.state;
    const isMobile = utils.checkPhone(mobile);
    if (time !== 60) {
      return;
    }
    // 校验新手机号与原手机号
    let error = '';
    !isMobile && (error = i18n.chain.userInfo.errorPhone);
    mobile === phone && (error = i18n.chain.userInfo.samePhone);
    if (error) {
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 3000
      });
      return;
    }
    this.setState({
      isSend: true
    });
    this.props.sendMessage({ mobile }).then(() => {
      const setCode = setInterval(() => {
        if (!time) {
          time = 60;
          setCode && clearInterval(setCode);
          vm.setState({
            codeText: i18n.chain.userInfo.reacquire,
            isSend: false
          });
        } else {
          time--;
          vm.setState({
            codeText: `${time}s`
          });
        }
      }, 1000);
    }).catch(() => {
      // catch
    });
  }

  editPhone () {
    const { validCode, mobile } = this.state;
    const warnInfo: any = {};
    const isMobile = utils.checkPhone(mobile);
    if (!validCode || !mobile) {
      return;
    }
    if (!isMobile) {
      Taro.showToast({
        title: i18n.chain.userInfo.errorPhone,
        icon: 'none',
        duration: 3000
      });
      return;
    }
    const keys = Object.keys(warnInfo);
    if (!keys.length) {
      const params = {
        validCode,
        mobile
      };
      this.props.editPhone(params).then(() => {
        // 更新用户信息 后跳转个人中心
        utils.Auth.checkSession(true).then(() => {
          Taro.navigateBack({
            delta: 1
          });
        });
      }).catch(() => {
        // catch
      });
    }
  }

  render () {
    return (
      <Page showBack title={i18n.chain.userInfo.editPhone}>
        <View className='page-edit-phone flex'>
          <View className='common-item flex m-t-16'>
            <Text>{i18n.chain.userInfo.original}</Text>
            <Text className='disable'>{utils.hidePhone(this.state.phone)}</Text>
          </View>
          <View className='common-item flex m-t-16'>
            <View className='bord-bottom'>
              <View className='left flex'>
                <View className='label'>{i18n.chain.userInfo.newPhone}</View>
                <Input
                  className='input'
                  placeholder={i18n.chain.loginPage.inputPhone}
                  type='number'
                  maxlength={11}
                  onInput={e => {
                    this.setState({ mobile: e.detail.value });
                  }}
                  value={this.state.mobile}
                  placeholderClass='placeholder'
                ></Input>
              </View>
            </View>
          </View>
          <View className='common-item flex no-border'>
            <View className='left flex'>
              <View className='label'>{i18n.chain.userInfo.verification}</View>
              <Input
                className='input code'
                placeholder={i18n.chain.appointment.inputPlaceholder}
                type='number'
                maxlength={6}
                onInput={e => {
                  this.setState({ validCode: e.detail.value });
                }}
                value={this.state.validCode}
                placeholderClass='placeholder'
              ></Input>
            </View>
            <View className='right flex'>
              <View
                className={`send ${this.state.isSend ? 'disable' : ''}`}
                onClick={this.sendMessage.bind(this)}
              >
                {this.state.codeText}
              </View>
            </View>
          </View>
          <View
            className={`confrim ${
              this.state.mobile && this.state.validCode ? '' : 'disable'
            }`}
            onClick={this.editPhone.bind(this)}
          >
            {i18n.chain.button.confirm}
          </View>
        </View>
      </Page>
    );
  }
}
export default EditPhone;
