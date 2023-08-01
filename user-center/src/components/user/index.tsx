import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

interface IProps {
  exit?: any;
}
function User (props: IProps) {
  const [user, setUser] = useState({
    avatarUrl: '',
    mobile: '',
    name: ''
  });
  useEffect(() => {
    const userInfo = Taro.getStorageSync(utils.appConfig.userInfo);
    setUser(userInfo);
  }, []);
  const exit = () => {
    Taro.showModal({
      title: '提示',
      content: '确认要退出登录吗',
      confirmText: '取消',
      confirmColor: '#9D9FA2',
      cancelColor: '#FE9A51',
      cancelText: '确定',
      success: function (res) {
        if (res.confirm) {
          // do not do
        } else {
          const { userInfo, weixinUserInfo, xAccessToken } = utils.appConfig;
          Taro.removeStorageSync(userInfo);
          Taro.removeStorageSync(weixinUserInfo);
          Taro.removeStorageSync(xAccessToken);
          setUser({
            avatarUrl: '',
            mobile: '',
            name: ''
          });
          props.exit();
        }
      }

    });
  };
  return (
    <View className='user'>
      <View className='user-info flex'>
        <View className='left flex'>
          <View className='head-content flex'>
            <Image className='hade-image' src={user.avatarUrl}></Image>
          </View>
          <View className='text flex'>
            <Text className='hello'>Hi，{user.name}</Text>
            <Text>{utils.hidePhone(user.mobile)}</Text>
          </View>
        </View>
        <View className='right flex'>
          <Text
            onClick={() => {
              exit();
            }}
          >
            {i18n.chain.user.logout}
          </Text>
          <View className='exit-icon'></View>
        </View>
      </View>
    </View>
  );
}
export default User;
