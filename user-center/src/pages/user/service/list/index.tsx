import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import i18n from '@i18n/index';
import Service from '@components/Service';
import Page from '@components/page';
import LoginModal from '@components/loginModal';
import { getServiceList } from '@actions/user';
import EmptyBox from '@components/HealthEmpty';
import utils from '@utils/index';
import './index.scss';

interface IState {
  status: number;
  // emptyHeight: number
  scrollHeight: number;
  tipState: boolean;
  serviceList: Array<any>;
  showLoginModal: boolean;
}
const pageSize = 999;
let loadAll = false;
class ServiceList extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      // emptyHeight: 0,
      scrollHeight: 0,
      tipState: true,
      serviceList: [],
      showLoginModal: false
    };
  }

  componentDidMount () {
    this.getScrollHight();
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    const { userInfo } = utils.appConfig;
    const { token } = Taro.getStorageSync(userInfo) || {};

    if (!token) {
      this.setState({
        showLoginModal: true
      });
    }
    loadAll = false;
    if (router?.params && router.params.status) {
      this.setState(
        {
          status: Number(router?.params && router.params.status)
        },
        () => {
          this.getServiceList();
        }
      );
    } else {
      this.getServiceList();
    }
  }

  changeTab (status) {
    if (status === this.state.status) {
      return;
    }
    loadAll = false;
    this.setState(
      {
        status,
        serviceList: []
      },
      () => {
        this.getServiceList();
      }
    );
  }

  getScrollHight () {
    const { tipState } = this.state;
    const { windowHeight, windowWidth } = Taro.getSystemInfoSync();
    let height = utils.appConfig.isH5 ? 92 : 48;
    tipState && (height += 34);
    this.setState({
      scrollHeight: windowHeight - (windowWidth / 375) * height
    });
  }

  // 获取列表
  getServiceList () {
    // 加载全部 就不需要加载了
    const params = {
      pageNum: 1,
      pageSize,
      state: this.state.status
    };
    Taro.showLoading();
    getServiceList(params)
      .then((res: any) => {
        if (params.state === 2) {
          res.records.length &&
            res.records.forEach(item => {
              let text = i18n.chain.myServicePage.overdue;
              item.state === 3 && (text = i18n.chain.myServicePage.delete);
              item.state === 4 &&
                (text = i18n.chain.myServicePage.policyCancelled);
              item.itemDesc = `${i18n.chain.myServicePage.failureCause}:${i18n.chain.myServicePage.serviceItem}${text}`;
            });
        }
        this.setState(
          {
            serviceList: res.records
          },
          () => {
            Taro.hideLoading();
          }
        );
        loadAll = true;
      })
      .catch(() => {
        Taro.hideLoading();
        loadAll = false;
      });
  }

  tolower () {
    if (loadAll) {
      return;
    }
    this.getServiceList();
  }

  // 不登陆
  noLogin (show) {
    this.setState({
      showLoginModal: show
    });
  }

  goPerfect () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};

    const { token, hasIdCard } = user;

    if (!token) {
      this.setState({
        showLoginModal: true
      });
      return;
    }

    if (!hasIdCard) {
      Taro.showModal({
        title: '',
        content: i18n.chain.myServicePage.needAuth,
        cancelText: i18n.chain.button.cancelAuth,
        confirmText: i18n.chain.button.submitAuth,
        cancelColor: '#9D9FA2',
        confirmColor: '#FE9A51',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/register/index?back=true'
            });
          } else {
            // not do
          }
        }
      });
    } else {
      Taro.switchTab({
        url: '/Healthy/pages/index'
      });
    }
  }

  render () {
    const { status, tipState, serviceList, showLoginModal } = this.state;
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={i18n.chain.myServicePage.myService}>
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
        <View className='page-service-list-my flex '>
          <View className='page-title flex'>
            <View
              className={`tab-item ${status === 0 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 0)}
            >
              {i18n.chain.myServicePage.notUsed}
            </View>
            <View
              className={`tab-item ${status === 1 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 1)}
            >
              {i18n.chain.myServicePage.used}
            </View>
            <View
              className={`tab-item ${status === 2 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 2)}
            >
              {i18n.chain.myServicePage.invalid}
            </View>
          </View>

          {tipState
            ? (
            <View className='tips-close flex'>
              {i18n.chain.myServicePage.pageInfo}
            </View>
              )
            : null}
          <ScrollView
            scrollY
            style={{
              height: `${this.state.scrollHeight}px`,
              width: '100%',
              boxSizing: 'border-box'
            }}
            onScrollToLower={this.tolower.bind(this)}
          >
            <View className='service-list'>
              {status === 0 && router?.params && !router.params.param
                ? (
                <View className='component-service'>
                  <View className='component-service-content'>
                    <View className='component-content'>
                      <View className='top-health'>
                        {i18n.chain.user.healthFile}
                      </View>
                      <View className='bottom'>
                        {i18n.chain.myServicePage.healthRecordsInfo}
                      </View>
                      <View
                        className='right flex'
                        onClick={() => {
                          this.goPerfect();
                        }}
                      >
                        {i18n.chain.myServicePage.toPerfect}
                      </View>
                    </View>
                  </View>
                </View>
                  )
                : null}
              {serviceList.length
                ? serviceList.map(item => {
                  return (
                      <Service
                        from=''
                        key={item.serviceRecordId}
                        serviceDetail={item}
                        actions={undefined}
                        reducers={undefined}
                      ></Service>
                  );
                })
                : status !== 0 && (
                    <View
                      className='empty flex'
                      style={{ height: `${this.state.scrollHeight - 48}px` }}
                    >
                      <EmptyBox
                        drug={false}
                        showBtn
                        url='/pages/user/service/exchange/index'
                        title={i18n.chain.myServicePage.noService}
                      ></EmptyBox>
                    </View>
                )}
            </View>
          </ScrollView>
          {status === 0 || serviceList.length > 0
            ? (
            <View
              className='service-add'
              onClick={() => {
                const { userInfo } = utils.appConfig;
                const user = Taro.getStorageSync(userInfo) || {};
                const { token } = user;

                if (!token) {
                  this.setState({
                    showLoginModal: true
                  });
                  return;
                }
                Taro.navigateTo({
                  url: '/pages/user/service/exchange/index'
                });
              }}
            ></View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default ServiceList;
