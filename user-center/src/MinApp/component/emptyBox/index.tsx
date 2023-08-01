import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  title?: string;
  drug: boolean;
  showBtn?: boolean;
  url?: string;
  btnText?: string;
}
class DrugEmpty extends Component<IProps> {
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
        {!this.props.drug
          ? (
          <Image
            src={`${ossHost}claims_no_record.png`}
            className='empty-icon'
          ></Image>
            )
          : (
          <Image
            src={`${ossHost}drug_none.png`}
            className='empty-drug'
          ></Image>
            )}
        <Text>{this.props.title ? this.props.title : '暂无服务'}</Text>
        {this.props.showBtn
          ? (
          <View className='go-btn' onClick={this.goUrl.bind(this)}>
            {this.props.btnText}
          </View>
            )
          : null}
      </View>
    );
  }
}
export default DrugEmpty;
