import Taro, { getCurrentInstance } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import utils from '@utils/index';
import i18n from '@i18n/index';

import './index.scss';

interface IProps {
  noLogin: Function;
  showState?: boolean;
  goLogin: Function;
}
const LoginModal = (props: IProps) => {
  const [changeState, setChangeState] = useState(false);

  const goLogin = () => {
    let url = '/pages/login/index';
    if (utils.appConfig.isH5) {
      const { router } = getCurrentInstance();
      if (router?.params && router.params.param) {
        url = `/pages/h5/login/index?param=${encodeURIComponent(
          router.params.param
        )}`;
      } else {
        url = '/pages/h5/login/index';
      }
    }
    props.goLogin();
    Taro.navigateTo({
      url
    });
  };
  useEffect(() => {
    if (props.showState) {
      setChangeState(true);
    }
  }, [props.showState]);
  return (
    <View className='component-login-modal'>
      <View className={`login-modal-content flex ${changeState ? 'show' : ''}`}>
        <View className='modal-content-top'>
          {i18n.chain.loginModal.haveSigned}
        </View>
        <View className='modal-content-center'>
          {i18n.chain.loginModal.pleaseLogin}
        </View>
        <View className='modal-content-bottom'></View>
        <View className='login-list flex'>
          <View
            className='login-btn-item flex close'
            onClick={() => {
              props.noLogin(false);
            }}
          >
            {i18n.chain.loginModal.noLogin}
          </View>
          <View className='login-btn-item flex' onClick={goLogin}>
            {i18n.chain.loginModal.nowLogin}
          </View>
        </View>
      </View>
    </View>
  );
};
export default LoginModal;
