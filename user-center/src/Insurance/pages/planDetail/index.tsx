import { Config, getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, RichText } from '@tarojs/components';
import Page from '@components/page';
import { getPlanInfo } from '@actions/insurance';
import './index.scss';

interface IProps{}
interface IState{
    planInfo: any;
}
class PlanDetail extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      planInfo: {}
    };
  }

    config: Config = {
      navigationBarTitleText: '保障计划详情'
    }

    componentDidShow () {
      const { router } = getCurrentInstance();
      getPlanInfo({
        productId: router?.params && router.params.id,
        planId: router?.params && router.params.planId
      }).then((res:any) => {
        const { rightsList } = res;
        rightsList && rightsList.length && rightsList.forEach((item) => {
          item.desc = item.desc.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        });
        this.setState({
          planInfo: res
        });
      });
    }

    render () {
      const { suitJob, insuranceTime, suitAge, coverage, rightsList } = this.state.planInfo || {};
      return (
            <Page title='保障计划详情' showBack>
                <View className='page-plan'>
                    <View className='plan-common flex'>
                        <View className='left'>承保职业</View>
                        <View className='right'>{suitJob}</View>
                    </View>
                    <View className='plan-common flex'>
                        <View className='left'>保障期限</View>
                        <View className='right'>{insuranceTime}</View>
                    </View>
                    <View className='plan-common flex'>
                        <View className='left'>投保年龄</View>
                        <View className='right'>{suitAge}</View>
                    </View>
                    <View className='plan-common no-border flex'>
                        <View className='left'>保障范围</View>
                        <View className='right'>{coverage}</View>
                    </View>
                    {
                        rightsList && rightsList.length && rightsList.map((item) => {
                          return (
                                <View key={item.name}>
                                    <View className='plan-common m-t-32 flex'>
                                        <View className='left'>{item.name}</View>
                                        <View className='right'></View>
                                    </View>
                                    <RichText className='content' nodes={item.desc}>
                                    </RichText>
                                </View>
                          );
                        })
                    }

                </View>
            </Page>
      );
    }
}
export default PlanDetail;
