import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Component } from 'react';
import { getPlanInfo, receiveGift } from '@actions/healthManage';
import Page from '@components/page';
import './index.scss';

interface IState {
  planInfo: any;
}
class HealthDetail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      planInfo: {}
    };
  }

  componentDidMount () {
    this.planInfo();
  }

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
        const planInfo = this.state.planInfo;
        this.setState({
          planInfo: {
            ...planInfo,
            received: true,
            planState: 1
          }
        });
      });
    }
  };

  render () {
    const {
      propagandaPic,
      planName,
      introduction,
      received,
      planState,
      serviceFeature,
      serviceInfoList
    } = this.state.planInfo;
    return (
      <Page showBack title='方案详情'>
        <View className='page-health-detail flex'>
          <View
            className='top'
            style={{ backgroundImage: `url(${propagandaPic})` }}
          >
            <View className='mask'></View>
            <View className='top-title'>{planName}</View>
            <View className='top-sub-title flex'>
              <View className='dot'></View>
              <View className='sub-title-text'>{introduction}</View>
            </View>
          </View>
          {received
            ? (
            <View
              className={`status flex ${planState === 1 ? 'ing' : 'over '}`}
            >
              {planState === 1 ? '进行中' : '已完成'}
            </View>
              )
            : null}

          <View className='service-container'>
            <View className='component-title flex'>
              <Text>服务特色</Text>
              <Text className='service-english'>Service Features</Text>
            </View>
            <View className='service-content'>
              <View className='nodes-text'>
                <RichText
                  nodes={serviceFeature}
                  className='content-text'
                ></RichText>
              </View>
            </View>
          </View>
          <View className='service-container'>
            <View className='component-title flex'>
              <Text>方案内容</Text>
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
export default HealthDetail;
