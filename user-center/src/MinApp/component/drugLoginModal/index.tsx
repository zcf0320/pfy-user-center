import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

interface IProps {
  noLogin: Function;
  showLoginModal: Function;
  showState?: boolean;
}
const DrugLoginModal = (props: IProps) => {
  const [changeState, setChangeState] = useState(false);
  useEffect(() => {
    if (props.showState) {
      setChangeState(true);
    }
  }, [props.showState]);
  return (
    <View className='component-login-modal-drug'>
      <View className={`login-modal-content flex ${changeState ? 'show' : ''}`}>
        <View className='modal-content-top'>登录后享受购药权益</View>
        <View className='modal-content-center'>请先登录再操作</View>
        <View className='modal-content-bottom'></View>
        <View className='login-list flex'>
          <View
            className='login-btn-item flex close'
            onClick={() => {
              props.noLogin(false);
            }}
          >
            取消
          </View>
          <View
            className='login-btn-item flex'
            onClick={() => {
              props.showLoginModal();
            }}
          >
            去登录
          </View>
        </View>
      </View>
    </View>
  );
};
export default DrugLoginModal;
