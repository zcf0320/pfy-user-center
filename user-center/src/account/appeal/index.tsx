import Taro from '@tarojs/taro';
import { View, Image, Input } from '@tarojs/components';
import { Component } from 'react';
import { IStoreProps } from '@reducers/interface';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import { checkInfo } from '@actions/user';
import actions from '../actions';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  checkInfo: Function;
  actions: any;
  reducers: any;
}
interface IState {
  name: string;
  mobile: string;
  idCard: string;
  loginFocus: boolean;
  mobileFocus: boolean;
  idCardFocus: boolean;
  clear: boolean;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: {
          accountAppealInfo: state.user.accountAppealInfo
        }
      }
    );
  },
  dispatch => {
    return Object.assign(
      {},
      {
        actions: bindActionCreators(actions, dispatch)
      }
    );
  }
)
class Appeal extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      idCard: '',
      loginFocus: false,
      mobileFocus: false,
      idCardFocus: false,
      clear: false
    };
  }

  handleInput = (key: string, value: string) => {
    if (!this.state.clear) {
      this.setState({ [key]: value.detail.value });
    }
  };

  handleFocus (key: string) {
    this.setState({
      [key]: true,
      clear: false
    });
  }

  handleBlur (key: string) {
    setTimeout(() => {
      this.setState({
        [key]: false,
        clear: false
      });
    }, 100);
  }

  clearVal (key) {
    this.setState({
      [key]: '',
      clear: true
    });
  }

  // 必填校验
  idDisable () {
    const { name, mobile, idCard } = this.state;
    let result = false;
    if (!name || !idCard || !mobile) {
      result = true;
    }
    return result;
  }

  // 身份核验
  checkIdentity () {
    let warnStr = '';
    const { name, mobile, idCard } = this.state;
    if (this.idDisable()) {
      return;
    }
    // 校验手机号是否合法
    if (mobile) {
      !utils.checkPhone(mobile) && (warnStr = '手机号错误');
    }
    // 校验身份证号是否合法
    if (idCard) {
      !utils.checkIdCard(idCard) && (warnStr = '身份证号错误');
    }
    if (warnStr) {
      Taro.showToast({
        title: warnStr,
        icon: 'none',
        duration: 2000
      });
    } else {
      checkInfo({ name, mobile, idCard }).then(() => {
        this.props.actions.setAccountAppeal({ name, mobile, idCard });
        Taro.navigateTo({
          url: 'account/upload/index'
        });
      });
    }
  }

  render () {
    const { name, mobile, idCard } = this.state;
    return (
      <Page showBack title='账号申诉'>
        <View className='login-item'>
          <View className='item flex top-input no-shadow'>
            <View className='left flex'>
              <View className='labelName'>姓名</View>
              <Input
                className='input'
                type='text'
                value={this.state.name}
                placeholder='请输入姓名'
                placeholderClass='placeholder'
                onFocus={this.handleFocus.bind(this, 'loginFocus')}
                onBlur={this.handleBlur.bind(this, 'loginFocus')}
                onInput={this.handleInput.bind(this, 'name')}
              ></Input>
              {this.state.loginFocus
                ? (
                <View
                  className='right flex'
                  onClick={this.clearVal.bind(this, 'name')}
                >
                  <Image src={`${ossHost}images/close.png`} className='close' />
                </View>
                  )
                : null}
            </View>
          </View>
          <View className='login-item-content'>
            <View className='item flex'>
              <View className='left flex'>
                <View className='labelName'>身份证号</View>
                <Input
                  className='input'
                  type='number'
                  maxlength={18}
                  placeholder='请输入身份证号'
                  placeholderClass='placeholder'
                  value={this.state.idCard}
                  onFocus={this.handleFocus.bind(this, 'idCardFocus')}
                  onBlur={this.handleBlur.bind(this, 'idCardFocus')}
                  onInput={this.handleInput.bind(this, 'idCard')}
                ></Input>
              </View>
              {this.state.idCardFocus
                ? (
                <View
                  className='right flex'
                  onClick={this.clearVal.bind(this, 'idCard')}
                >
                  <Image src={`${ossHost}images/close.png`} className='close' />
                </View>
                  )
                : null}
            </View>
            <View className='item flex no-shadow'>
              <View className='left flex'>
                <View className='labelName'>手机号</View>
                <Input
                  className='input'
                  type='number'
                  maxlength={11}
                  placeholder='请输入您要申诉的手机号'
                  placeholderClass='placeholder'
                  value={this.state.mobile}
                  onFocus={this.handleFocus.bind(this, 'mobileFocus')}
                  onBlur={this.handleBlur.bind(this, 'mobileFocus')}
                  onInput={this.handleInput.bind(this, 'mobile')}
                ></Input>
              </View>
              {this.state.mobileFocus
                ? (
                <View
                  className='right flex'
                  onClick={this.clearVal.bind(this, 'mobile')}
                >
                  <Image src={`${ossHost}images/close.png`} className='close' />
                </View>
                  )
                : null}
            </View>
            <View className='tips'>仅为已实名认证过的用户提供申诉服务</View>
            <View
              className={`login ${
                !mobile || !name || !idCard ? 'disable' : ''
              }`}
              onClick={this.checkIdentity.bind(this)}
            >
              身份证验证
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Appeal;
