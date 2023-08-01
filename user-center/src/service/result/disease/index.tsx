import { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import OrderItem from '@components/orderItem';
import { getDiseaseInfo } from '@actions/common';
import './index.scss';

interface IState {
  item: any;
}
class Disease extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      item: {}
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    getDiseaseInfo({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then((res:any) => {
      res.serviceRecordId = router?.params && router.params.serviceRecordId;
      this.setState({
        item: res
      });
    });
  }

  render () {
    const { item } = this.state;
    return (
      <Page showBack title='问诊详情'>
        <View className='page-disease flex'>
          <OrderItem item={item} type={1}></OrderItem>
        </View>
      </Page>
    );
  }
}
export default Disease;
