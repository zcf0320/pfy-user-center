import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import { getYjyDetail } from '@actions/service';
import Page from '@components/page';
import { timeFormat } from '@utils/time';
import './index.scss';

class YjyDetail extends Component {
  state = {
    detail: {
      deptName: null,
      conclusion: null,
      updateTime: null
    }
  };

  componentDidMount () {
    const { router } = getCurrentInstance();
    const { serviceRecordId } = (router?.params && router.params) || {};
    if (serviceRecordId) {
      this.getDetail(serviceRecordId);
    } else {
      Taro.showToast({
        title: '非法进入',
        icon: 'none'
      });
      Taro.navigateBack();
    }
  }

  getDetail (serviceRecordId) {
    getYjyDetail(serviceRecordId).then(res => {
      this.setState({
        detail: res
      });
    });
  }

  render () {
    const { detail } = this.state;
    return (
      <Page showBack title='问诊详情'>
        <View className='yjy-detail'>
          <View className='card'>
            <View className='title'>医加壹图文问诊</View>
            <View className='flex'>
              <View>推荐科室：{detail.deptName}</View>
              <View>{timeFormat(detail.updateTime)}</View>
            </View>
            <View className='conclusion'>咨询总结：{detail.conclusion}</View>
          </View>
        </View>
      </Page>
    );
  }
}
export default YjyDetail;
