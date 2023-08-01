import Taro, { Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import { getPlanList } from '@actions/healthManage';
import utils from '@utils/index';
import i18n from '@i18n/index';
import Page from '@components/page';
import LoginModal from '@components/loginModal';
import './index.scss';

interface IState {
  planList: Array<any>;
  showLoginModal: boolean;
}
class HealthManage extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      planList: [],
      showLoginModal: false
    };
  }

  config: Config = {
    navigationBarTitleText: i18n.chain.plan.title
  };

  componentDidShow () {
    this.setState({
      showLoginModal: false
    });
    this.getPlan();
  }

  getPlan = () => {
    getPlanList().then((res: any) => {
      if (this.checkLogin()) {
        res.unshift({
          planId: -1
        });
      }
      this.setState({
        planList: res
      });
    });
  };

  goPlanDetail = item => {
    if (this.checkLogin()) {
      Taro.navigateTo({
        url: `/healthManage/healthDetail/index?id=${item.planId}`
      });
    }
  };

  goMyPlan = () => {
    if (this.checkLogin()) {
      Taro.navigateTo({
        url: '/healthManage/myPlan/index'
      });
    }
  };

  checkLogin = () => {
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    if (!token) {
      this.noLogin(true);
      return false;
    }
    return true;
  };

  noLogin = (data: boolean) => {
    this.setState({
      showLoginModal: data
    });
  };

  onShareAppMessage () {
    return {
      title: '寰宇关爱',
      imageUrl:
        'https://senro-tree-sleep-1301127519.cos.ap-nanjing.myqcloud.com/img/%E5%AF%B0%E5%AE%87logo.png',
      path: '/healthManage/index/index'
    };
  }

  render () {
    const { planList, showLoginModal } = this.state;
    return (
      <Page showBack={false} title={i18n.chain.plan.title}>
        {showLoginModal
          ? (
          <LoginModal
            showState={showLoginModal}
            noLogin={() => {
              this.noLogin(false);
            }}
            goLogin={() => {
              this.setState({
                showLoginModal: false
              });
            }}
          ></LoginModal>
            )
          : null}
        <View className='page-health-manage flex'>
          <View className='title m-b-16'>{i18n.chain.plan.healthManagement}</View>
          <View className='title m-b-24'> {i18n.chain.plan.choosePlan}</View>
          <View className='sub-title flex m-b-16'>
            <View className='dot'></View>
            <Text>{i18n.chain.plan.improveBadHabits}</Text>
          </View>
          <View className='sub-title flex m-b-48'>
            <View className='dot'></View>
            <Text>{i18n.chain.plan.improveHealth}</Text>
          </View>
          <View className='my-plan flex' onClick={this.goMyPlan}>
            {i18n.chain.plan.myPlan}
          </View>
          {planList && planList.length
            ? planList.map(item => {
              return item.planId === -1
                ? (
                  <View key={item.planId}
                    className='recommend'
                    onClick={() => {
                      Taro.navigateTo({
                        url: '/healthManage/recommend/index?id=-1'
                      });
                    }}
                  >
                    <View className='title'>
                      {i18n.chain.plan.intelligentCustomize}
                    </View>
                    <View className='sub-title'>
                      {i18n.chain.plan.intelligentRecommend}
                    </View>
                    <View className='action flex'>{i18n.chain.plan.customize}</View>
                  </View>
                  )
                : (
                  <View
                    className='manage-item'
                    key={item.planId}
                    style={{ backgroundImage: `url(${item.propagandaPic})` }}
                    onClick={() => {
                      this.goPlanDetail(item);
                    }}
                  >
                    <View className='mask'></View>
                    <View className='item-title m-b-24'>{item.planName}</View>
                    <View className='item-sub-title'>{item.introduction}</View>
                  </View>
                  );
            })
            : null}
        </View>
      </Page>
    );
  }
}
export default HealthManage;
