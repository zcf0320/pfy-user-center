import Taro from '@tarojs/taro';
import { ReactNode } from 'react';
import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

const { xAccessToken } = utils.appConfig;

interface IProps {
  children: ReactNode;
  title: string;
  icon: string;
  close: () => any;
  type: number;
}

const goChart = (type: number) => {
  // 0血糖 1血压
  const token = Taro.getStorageSync(xAccessToken);

  Taro.navigateTo({
    url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}points/chart&token=${token}&type=${type}`
  });
};

const Drawer = (props: IProps) => {
  const { title, icon, type } = props;

  return (
    <View className='mall-drawer'>
      <View className='drawer'>
        <View className='drawer-header'>
          <View className='left'>
            <Image className='icon' src={icon} />
            <View className='title'>{title}</View>
            <View
              className='view'
              onClick={() => {
                goChart(type);
              }}
            >
              {i18n.chain.setHeathly.lookTrend}
            </View>
          </View>
          <View className='icon_close' onClick={props.close}></View>
        </View>
        <View className='drawer-content'>{props.children}</View>
      </View>
    </View>
  );
};

export default Drawer;
