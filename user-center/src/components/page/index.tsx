import { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import utils from '@utils/index';
import NavBar from '@components/navBar';
import './index.scss';
import CustomModal from '../customModal';

interface IProps {
  title: string; // 页面标题
  hideBar?: boolean;
  showBack: boolean;
  showIndex?: boolean;
}
class Page extends Component<IProps> {
  render () {
    const { router } = getCurrentInstance();
    // 判断打开方式 h5 小程序
    const { isH5 } = utils.appConfig;
    const { title, hideBar, showBack, showIndex } = this.props;
    const showTitle = decodeURI(title);
    return (
      <View className='page-component'>
        {isH5 && !hideBar && router?.params && router.params.env !== 'weapp'
          ? (
          <NavBar
            showIndex={showIndex}
            title={showTitle}
            showBack={showBack}
          ></NavBar>
            )
          : null}
        <View className='page-scroll-content'>{this.props.children}</View>
        <CustomModal />
      </View>
    );
  }
}

export default Page;
