import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '@i18n/index';
import { GET_DIAGNOSE_LIST } from '@constants/inquire';
import { getDiagnoseList, getUserSelectItem } from '@actions/common';
import Page from '@components/page';
import TabBar from '@components/tabBar';
import LoginModal from '@components/login';
import utils from '@utils/index';
import Persission from '@components/permission';
import User from '@components/user';
import { IStoreProps } from '@reducers/interface';
import EmptyBox from '@components/emptyBox';
import tab0 from '../../images/inquire_tab_0.png';
import tab0active from '../../images/inquire_tab_0_active.png';
import tab1 from '../../images/inquire_tab_1.png';
import tab1active from '../../images/inquire_tab_1_active.png';
import OrderItem from '../../component/OrderItem';
import './index.scss';

const pageSize = 10;
let pageNum = 1;
let loadAll = false;
interface IProps {
  getDiagnoseList: any;
}
interface IState {
  status: number;
  showLoginModal: boolean;
  scrollHeight: number;
  hasPerssion: boolean;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getDiagnoseList (data) {
      getDiagnoseList(data).then((res: any) => {
        dispatch({
          type: GET_DIAGNOSE_LIST,
          payload: res.records,
          pageNum
        });
        if (pageSize > res.records.length) {
          loadAll = true;
        }
      });
    }
  })
)
class InquireIndex extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      showLoginModal: false,
      scrollHeight: 0,
      hasPerssion: true
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const vm = this;
    const { xAccessToken, userInfo } = utils.appConfig;
    const token = Taro.getStorageSync(xAccessToken) || '';
    const user = Taro.getStorageSync(userInfo) || {};
    const { hasIdCard } = user;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 264 : 220;
        vm.setState({
          scrollHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });

    // 已经实名认证
    if (hasIdCard && token) {
      router?.params && router.params.serviceType === '1' && this.getPerssion();
    } else {
      this.setState({
        showLoginModal: true
      });
    }
  }

  config: Config = {
    navigationBarTitleText: i18n.chain.common.title
  };

  selectTab (index) {
    const { status } = this.state;
    if (status !== index) {
      pageNum = 1;
      loadAll = false;
      this.setState(
        {
          status: index
        },
        () => {
          Taro.setNavigationBarTitle({
            title: this.getPageTitle()
          });
        }
      );
    }
    index === 1 && this.getList();
  }

  getPerssion () {
    getUserSelectItem()
      .then(() => {
        // do something
      })
      .catch(() => {
        this.setState({
          hasPerssion: false
        });
      });
  }

  getPageTitle () {
    const { status } = this.state;
    let text = i18n.chain.common.title;
    status === 1 && (text = i18n.chain.tabBar.my);
    return text;
  }

  exit () {
    const vm = this;
    vm.setState({
      showLoginModal: true,
      status: 0
    });
  }

  hideLoginModal () {
    this.getPerssion();
    this.setState({
      showLoginModal: false
    });
  }

  go (url) {
    Taro.navigateTo({
      url
    });
  }

  getList () {
    const params: any = {
      pageNum,
      pageSize
    };
    pageNum === 1 && (loadAll = false);
    this.props.getDiagnoseList(params);
  }

  tolower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getList();
  }

  watchList () {
    const { diagnoseList } = this.props.inquire;
    return diagnoseList.length;
  }

  render () {
    const { status, hasPerssion, showLoginModal, scrollHeight } = this.state;
    const tab = [
      {
        icon: tab0,
        activeIcon: tab0active,
        text: i18n.chain.tabBar.consultation
      },
      {
        icon: tab1,
        activeIcon: tab1active,
        text: i18n.chain.tabBar.my
      }
    ];
    const { diagnoseList } = this.props.inquire;
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={this.getPageTitle()}>
        {showLoginModal && (
          <LoginModal
            login={() => {
              this.hideLoginModal();
            }}
            isImproveInfo
          ></LoginModal>
        )}
        {hasPerssion
          ? (
          <View className='page-inquire-index flex'>
            <View className='content'>
              {status === 0
                ? (
                <View className='content-1'>
                  <View className={`content-img ${i18n.getLocaleName() === 'zh' ? '' : 'en'}`}></View>
                  <View
                    className='go flex'
                    onClick={() => {
                      this.go(
                        `/Inquire/pages/im/index?serviceRecordId=${(router?.params && router
                          .params.serviceRecordId) || ''}&serviceType=${(router?.params && router.params.serviceType) || ''}`
                      );
                    }}
                  >
                    {i18n.chain.aiConsulation.button}
                  </View>
                </View>
                  )
                : null}
              {status === 1
                ? (
                <View className='content-2'>
                  <User exit={this.exit.bind(this)}></User>
                  <View className='title flex'>
                    <View className='icon'></View>
                    <Text> {i18n.chain.aiConsulation.record}</Text>
                  </View>
                  <ScrollView
                    style={{ height: `${scrollHeight}px` }}
                    scrollY
                    onScrollToLower={this.tolower.bind(this)}
                  >
                    <View
                      className={`order-list flex ${
                        this.watchList() ? '' : 'none'
                      }`}
                    >
                      {diagnoseList && diagnoseList.length
                        ? (
                            diagnoseList.map(item => {
                              return (
                            <OrderItem
                              item={item}
                              key={item.recordId}
                            ></OrderItem>
                              );
                            })
                          )
                        : (
                        <EmptyBox
                          title={i18n.chain.aiConsulation.noRecord}
                          bg='drug'
                        ></EmptyBox>
                          )}
                    </View>
                  </ScrollView>
                </View>
                  )
                : null}
            </View>
            <TabBar
              tab={tab}
              activeIndex={status}
              select={this.selectTab.bind(this)}
            ></TabBar>
          </View>
            )
          : (
          <Persission></Persission>
            )}
      </Page>
    );
  }
}
export default InquireIndex;
