import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import { Component } from 'react';
import Page from '@components/page';
import {
  getPlanInfo,
  receiveGift,
  getRecommenInfoByVersion
} from '@actions/healthManage';
import './index.scss';

interface IState {
  planInfo: any;
}
class Recommend extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      planInfo: {}
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    if (router?.params && router.params.recommendVersion) {
      this.getPlanInfoByVersion();
    } else {
      this.planInfo();
    }
  }

  getPlanInfoByVersion = () => {
    const { router } = getCurrentInstance();
    getRecommenInfoByVersion({
      healthPlanId: router?.params && router.params.id,
      version: router?.params && router.params.recommendVersion
    }).then(res => {
      this.setState({
        planInfo: res
      });
    });
  };

  planInfo = () => {
    const { router } = getCurrentInstance();
    getPlanInfo({
      healthPlanId: router?.params && router.params.id
    }).then(res => {
      this.setState({
        planInfo: res
      });
    });
  };

  getBtnText = () => {
    const { received, planState, packagePrice } = this.state.planInfo;
    let text = `¥${packagePrice} 领取方案`;
    if (received) {
      planState === 1 && (text = '去完成');
      planState === 2 && (text = '已完成');
    }
    return text;
  };

  clickBtn = () => {
    const { router } = getCurrentInstance();
    const { received, planState } = this.state.planInfo;
    if (received) {
      if (planState === 1) {
        Taro.navigateTo({
          url: '/pages/user/service/list/index'
        });
      }
    } else {
      receiveGift({
        planId: router?.params && router.params.id
      }).then(() => {
        Taro.showToast({
          title: '领取成功,权益已分配至您的账户',
          icon: 'none',
          duration: 3000
        });
        this.setState({
          planInfo: {
            received: true,
            planState: 1
          }
        });
      });
    }
  };

  render () {
    const { received, planState, serviceInfoList } = this.state.planInfo;
    return (
      <Page showBack title='方案内容'>
        <View className='page-health-recommend flex'>
          <View className='top flex'>
            <View className='top-title flex'>智能定制方案</View>
            <View className='top-text'></View>
          </View>
          <View className='service-container'>
            <View className='component-title flex'>
              <Text>{i18n.chain.plan.programmeContent}</Text>
              <Text className='service-english'>Plan Content</Text>
            </View>
            <View className='service-content'>
              <View className='service-list'>
                {serviceInfoList && serviceInfoList.length
                  ? serviceInfoList.map(item => {
                    return (
                        <View
                          className='service-item flex'
                          key={item.serviceInfoId}
                        >
                          <View className='service-dot'></View>
                          <View className='service-name'>
                            {item.serviceInfoName}
                          </View>
                          {received
                            ? (
                            <View
                              className={`service-status ${
                                item.serviceInfoState === 2 ? 'over' : ''
                              }`}
                            ></View>
                              )
                            : null}
                        </View>
                    );
                  })
                  : null}
              </View>
            </View>
          </View>
          <View
            className={`btn flex ${planState === 2 ? 'disable' : ''}`}
            onClick={this.clickBtn}
          >
            {this.getBtnText()}
          </View>
        </View>
      </Page>
    );
  }
}
export default Recommend;
