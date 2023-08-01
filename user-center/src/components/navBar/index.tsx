import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  showBack:boolean;
  showIndex?: boolean;
}
class NavBar extends Component<IProps> {
  goBack () {
    Taro.navigateBack({
      delta: 1
    });
  }

  render () {
    return (
      <View className='component-nav-bar flex'>
        {this.props.showIndex
          ? (
          <Image
            src={`${ossHost}health_back.png`}
            className='index'
            onClick={() => {
              Taro.reLaunch({ url: '/pages/user/index/index' });
            }}
          ></Image>
            )
          : null}
        {this.props.showBack
          ? (
          <Image
            src={`${ossHost}images/back.png`}
            className='back'
            onClick={this.goBack.bind(this)}
          ></Image>
            )
          : null}
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}
export default NavBar;
