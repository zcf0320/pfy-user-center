import { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import { getTreatmentList } from '@actions/serviceItem';
import Page from '@components/page';
import RecordItem from './recordItem';
import './index.scss';

interface IState{
    list: any;
}
class Record extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    getTreatmentList({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then(res => {
      this.setState({
        list: res
      });
    });
  }

  render () {
    const { list } = this.state;
    return <Page title='二次诊疗' showBack>
            <View className='page-record flex'>
                {
                    list.length && list.map((item) => {
                      return <RecordItem recordDetail={item} key={item.serviceRecordId}></RecordItem>;
                    })
                }

            </View>
        </Page>;
  }
}
export default Record;
