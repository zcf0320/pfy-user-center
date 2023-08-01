import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Image, Input } from '@tarojs/components';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { sendMessage, login, register } from '@actions/common';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  login: Function;
  // 是否完善信息
  isImproveInfo?: boolean;
  close: Function;
  showClose?: boolean;
  showState?: boolean;
}
function LoginModal (props: IProps) {
  const [mobile, setMobile] = useState('');
  const [validCode, setValidCode] = useState('');
  const [focus, setFocus] = useState(false);
  const [codeText, setCodeText] = useState('获取验证码');
  const [isSend, setIsSend] = useState(false);
  const [time, setTime] = useState(60);
  // 是否显示完善信息的弹框
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  useEffect(() => {
    if (props.showState) {
      setChangeState(true);
    }
    const { userInfo } = utils.appConfig;
    // 更新用户信息
    const user = Taro.getStorageSync(userInfo) || {};
    const { hasIdCard, token } = user;
    if (token && !hasIdCard) {
      setShowInfoModal(true);
    }
  }, [props.showState]);
  useEffect(() => {
    let timer: any = null;
    if (isSend && time !== 0) {
      timer = setInterval(() => {
        // 这时候的num由于闭包的原因，一直是0，所以这里不能用setNum(num-1)
        setTime(n => {
          if (n === 0) {
            setCodeText('重新获取');
            setTime(60);
            setIsSend(false);

            timer && clearInterval(timer);
          } else {
            setCodeText(`${n}s`);
          }
          return n - 1;
        });
      }, 1000);
    }
    return () => {
      // 组件销毁时，清除定时器
      clearInterval(timer);
    };
  }, [isSend, time]);
  const send = () => {
    if (isSend) {
      return;
    }
    sendMessage({ mobile }).then(() => {
      setIsSend(true);
    });
  };
  const loginInfo = () => {
    if (!mobile || !validCode) {
      return;
    }
    const params = {
      mobile,
      validCode
    };
    login(params).then((res: any) => {
      const { userInfo, xAccessToken } = utils.appConfig;
      // 更新用户信息
      Taro.setStorageSync(userInfo, res);
      const { token } = res;
      token && Taro.setStorageSync(xAccessToken, token);
      // 如果需要完善信息
      if (props.isImproveInfo) {
        const { hasIdCard } = res;
        // 如果已经完善过
        if (hasIdCard) {
          props.login();
        } else {
          setShowInfoModal(true);
        }
        return;
      }
      props.login();
    });
  };
  const registerInfo = () => {
    if (!name || !idCard) {
      return;
    }
    const params = {
      name,
      idCard
    };
    register(params).then((res: any) => {
      const { userInfo, xAccessToken } = utils.appConfig;
      // 更新用户信息
      Taro.setStorageSync(userInfo, res);
      const { token } = res;
      token && Taro.setStorageSync(xAccessToken, token);
      props.login();
    });
  };
  return (
    <View className='component-login flex'>
      {!showInfoModal
        ? (
        <View className={`health_modal ${changeState ? 'show' : ''}`}>
          <View className='login-modal flex'>
            <View className='login-title'>{i18n.chain.loginModal.nowLogin}</View>
            <View className='item flex'>
              <View className='left flex'>
                <Image
                  className='label'
                  src={`${ossHost}health_mobile.png`}
                ></Image>
                <Input
                  className='input'
                  type='text'
                  value={mobile}
                  placeholder={i18n.chain.loginPage.inputPhone}
                  onFocus={() => {
                    setFocus(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocus(false);
                    }, 100);
                  }}
                  onInput={e => {
                    setMobile(e.detail.value);
                  }}
                  placeholderClass='placeholder'
                ></Input>
              </View>
              {focus
                ? (
                <Image
                  src={`${ossHost}images/close.png`}
                  className='right'
                  onClick={() => {
                    setMobile('');
                  }}
                />
                  )
                : null}
            </View>
            <View className='item flex no-border'>
              <View className='left flex code'>
                <Image
                  className='label'
                  src={`${ossHost}health_psw.png`}
                ></Image>
                <Input
                  className='input'
                  type='text'
                  value={validCode}
                  placeholder={i18n.chain.loginPage.code}
                  onInput={e => {
                    setValidCode(e.detail.value);
                  }}
                  placeholderClass='placeholder'
                ></Input>
              </View>

              <View
                className={`send-message ${isSend ? 'disable' : ''}`}
                onClick={() => {
                  send();
                }}
              >
                {codeText}
              </View>
            </View>
            <View
              className={`login flex ${!mobile || !validCode ? 'disable' : ''}`}
              onClick={() => {
                loginInfo();
              }}
            >
              {i18n.chain.loginPage.login}
            </View>
          </View>

          <Image
            className='health_cancel'
            src={`${ossHost}health_cancel.png`}
            onClick={() => {
              props.close();
            }}
          ></Image>
        </View>
          )
        : (
        <View className='login-modal flex'>
          <View className='login-title'>实名认证</View>
          <View className='common-item'>
            <Input
              className='input'
              type='text'
              placeholder='请输入真实姓名'
              value={name}
              onInput={e => {
                setName(e.detail.value);
              }}
              placeholderClass='placeholder'
            ></Input>
          </View>
          <View className='common-item'>
            <Input
              className='input'
              type='text'
              placeholder='请输入身份证号'
              value={idCard}
              onInput={e => {
                setIdCard(e.detail.value);
              }}
              placeholderClass='placeholder'
            ></Input>
          </View>
          <View
            className={`confirm flex ${!name || !idCard ? 'disable' : ''}`}
            onClick={() => {
              registerInfo();
            }}
          >
            {i18n.chain.button.confirm}
          </View>
        </View>
          )}
    </View>
  );
}
export default LoginModal;
