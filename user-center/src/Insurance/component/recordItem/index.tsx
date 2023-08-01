import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

interface IProps {
    recordDetail: {
        insuredName: string;
        createTime: number;
        reason: string;
        state: number;
        id: string;
    };
}
interface IState {

}

class RecordItem extends Component <IProps, IState> {
  goDetail () {
    const { id } = this.props.recordDetail;
    Taro.navigateTo({
      url: `/Insurance/pages/detail/index?id=${id}`
    });
  }

  render () {
    const { insuredName, createTime, reason, state } = this.props.recordDetail || {};
    return (
            <View className='record-page' onClick={() => { this.goDetail(); }}>
                <View className='component-record-item'>
                    <View className='item-content'>
                        <View className='common common-title flex'>
                            <Text>华农健康保险</Text>
                            <Text className='status'>查看详情</Text>
                        </View>
                        <View className='common flex'>
                            <Text>被保险人</Text>
                            <Text className='status'>{insuredName}</Text>
                        </View>
                        <View className='common flex'>
                            <Text>申请时间</Text>
                            <Text className='status'>{utils.timeFormat(createTime, 'y/m/d h:m:s')}</Text>
                        </View>
                    </View>
                    <View className='result'>
                        <View className='result-title'>核保结论</View>
                        <View>{state === 1 ? '您提交的资料将会在5-10个工作日内审核完毕，请耐心等待！' : reason}</View>
                    </View>
                </View>
            </View>

    );
  }
}
export default RecordItem;
