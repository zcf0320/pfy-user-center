import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import './index.scss';

interface IProps {
  title?: string;
  bg?: string;
  small?: boolean;
  showBtn?: boolean;
  url?: string;
}
class EmptyBox extends Component<IProps> {
  goUrl () {
    if (this.props.url) {
      Taro.navigateTo({
        url: this.props.url
      });
    }
  }

  render () {
    return (
      <View className='component-empty-box flex '>
        {this.props.small
          ? (
          <View className={`empty-icon ${this.props.bg}`}></View>
            )
          : (
          <View className={`empty-icon big ${this.props.bg}`}></View>
            )}
        <Text>{this.props.title ? this.props.title : i18n.chain.myServicePage.emptyService}</Text>
        {this.props.showBtn
          ? (
          <View className='go-btn' onClick={this.goUrl.bind(this)}>
            {i18n.chain.myServicePage.toExchange}
          </View>
            )
          : null}
      </View>
    );
  }
}
export default EmptyBox;
