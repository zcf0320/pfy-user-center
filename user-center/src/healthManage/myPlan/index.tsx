import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getMyPlanList } from '@actions/healthManage';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  list: Array<any>;
  status: number;
}
class MyPlan extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: [],
      status: 1
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.plan.myPlan });
    this.getMyPlanList();
  }

  getMyPlanList = () => {
    const { status } = this.state;
    getMyPlanList({
      state: status
    }).then((res: any) => {
      this.setState({
        list: res
      });
    });
  };

  changeTab = index => {
    this.setState(
      {
        status: index
      },
      () => {
        this.getMyPlanList();
      }
    );
  };

  render () {
    const { status, list } = this.state;
    return (
      <Page title={i18n.chain.plan.myPlan}>
        <View className='page-my-plan flex'>
          <View className='plan-tab flex'>
            <View
              className={`tab-item flex ${status === 1 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(1);
              }}
            >
              {i18n.chain.plan.inProgress}
            </View>
            <View
              className={`tab-item flex ${status === 2 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(2);
              }}
            >
              {i18n.chain.plan.complete}
            </View>
            <View className={`line ${status === 2 ? 'line-1' : ''}`}></View>
          </View>
          <View className='plan-list'>
            {list.length
              ? (
                  list.map(item => {
                    return (
                  <View
                    className='plan-item flex'
                    key={item.planId}
                    onClick={() => {
                      let url = `/healthManage/healthDetail/index?id=${item.planId}`;
                      if (item.planId === '-1') {
                        url = `/healthManage/recommend/index?id=${item.planId}&recommendVersion=${item.recommendVersion}`;
                      }
                      Taro.navigateTo({
                        url
                      });
                    }}
                  >
                    <View className='left'>
                      <View className='left-title'>{item.planName}</View>
                      <View className='left-sub-title'>
                        {item.introduction}
                      </View>
                    </View>
                    <View className='right flex'>
                      {item.planState === 1 ? i18n.chain.serviceComponent.useNow : i18n.chain.serviceComponent.viewDetails}
                    </View>
                  </View>
                    );
                    // return
                  })
                )
              : (
              <View className='empty-box flex'>
                <View className='empty-box-content flex'>
                  <View className='img'></View>
                  <Text>{i18n.chain.plan.noPlan}</Text>
                </View>
              </View>
                )}
          </View>
        </View>
      </Page>
    );
  }
}
export default MyPlan;
