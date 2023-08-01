import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { IStoreProps } from '@reducers/interface';
import { getTypes, getHistoryList, serviceRecordState } from '@actions/minApp';
import { GET_HISTORY, GET_TYPES, SET_TYPES } from '@constants/minApp';
import Page from '@components/page';
import LoginModal from '@components/DrugLogin';
import ArticleItem from '../../component/articleItem';
import clockIcon from '../../images/clock.png';
import './index.scss';

const { ossHost } = utils.appConfig;
const tab1 = `${ossHost}health_tab1.png`;
const tab1Active = `${ossHost}health_active1.png`;
const tab2 = `${ossHost}health_tab2.png`;
const tab2Active = `${ossHost}health_active2.png`;

interface IProps {
  getTypeList: Function;
  getHistoryList: Function;
  setTypeList: Function;
}
interface IState {
  status: number;
  showLoginModal: boolean;
  isLogin: boolean; // 是否登录
  user: any;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getTypeList (data) {
      getTypes(data).then(res => {
        dispatch({
          type: GET_TYPES,
          payload: res
        });
      });
    },
    setTypeList (data) {
      dispatch({
        type: SET_TYPES,
        payload: data
      });
    },
    getHistoryList () {
      getHistoryList().then(res => {
        dispatch({
          type: GET_HISTORY,
          payload: res
        });
      });
    }
  })
)
class MinApp extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 1,
      showLoginModal: false,
      isLogin: true,
      user: {}
    };
  }

  componentWillUnmount () {
    const { router } = getCurrentInstance();
    const serviceRecordId = router?.params && router.params.serviceRecordId;
    const { xAccessToken } = utils.appConfig;
    const token = Taro.getStorageSync(xAccessToken) || '';
    if (!token || !serviceRecordId) {
      return;
    }
    serviceRecordState({
      serviceRecordId
    });
  }

  componentDidShow () {
    const { status } = this.state;
    const { xAccessToken, userInfo } = utils.appConfig;
    const token = Taro.getStorageSync(xAccessToken) || '';
    const user = Taro.getStorageSync(userInfo) || {};
    this.setState({
      user
    });
    if (token) {
      status === 1 && this.getTypeList();
      status === 2 && this.props.getHistoryList();
      this.setState({
        isLogin: true
      });
    } else {
      this.setState({
        showLoginModal: true,
        isLogin: false
      });
    }
  }

  getTypeList () {
    const { router } = getCurrentInstance();
    const params = {
      serviceRecordId: router?.params && router.params.serviceRecordId
    };
    this.props.getTypeList(params);
  }

  changeTab (val) {
    const { status } = this.state;
    if (val === status) {
      return;
    }
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.setState({
      status: val
    });
    Taro.setNavigationBarTitle({ title: val === 1 ? '健康专栏' : '我的' });
    val === 1 && this.getTypeList();
    val === 2 && this.props.getHistoryList();
  }

  hideLoginModal () {
    const vm = this;
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    vm.setState({
      showLoginModal: false,
      user,
      isLogin: true
    });
    vm.getTypeList();
    vm.props.getHistoryList();
  }

  exit () {
    const { userInfo, weixinUserInfo, xAccessToken } = utils.appConfig;
    Taro.removeStorageSync(userInfo);
    Taro.removeStorageSync(weixinUserInfo);
    Taro.removeStorageSync(xAccessToken);
    this.props.setTypeList([]);
    this.setState({
      showLoginModal: true,
      status: 1,
      user: {},
      isLogin: false
    });
  }

  close = () => {
    this.setState({
      showLoginModal: false
    });
  };

  render () {
    const { status, showLoginModal, user, isLogin } = this.state;
    return (
      <Page showBack title={status === 1 ? '健康专栏' : '我的'} >
        <View className='page-min-app flex'>
          <View className='page-content'>
            {status === 1
              ? (
              <View className='content-health flex'>
                {this.props.minApp.typeList.length
                  ? (
                      this.props.minApp.typeList.map(item => {
                        return (
                      <View
                        key={item.typeId}
                        className='component-tag-item flex'
                        onClick={() => {
                          if (item.state === 2) {
                            return;
                          }
                          Taro.navigateTo({
                            url: `/MinApp/pages/article/index?id=${item.typeId}&title=${item.title}`
                          });
                        }}
                      >
                        <View className='tag-content flex'>
                          <View className='title'>{item.title}</View>
                          <View className='time'>
                            查阅期限：
                            {utils.timeFormat(item.startTime, 'y.m.d')}-
                            {utils.timeFormat(item.endTime, 'y.m.d')}
                          </View>
                        </View>
                        <View className='big-dot'></View>
                        <View className='little-dot'></View>
                      </View>
                        );
                      })
                    )
                  : (
                  <View className='all flex'>
                    <View className='none'></View>
                    <Text>{i18n.chain.common.noPermission}</Text>
                  </View>
                    )}
              </View>
                )
              : (
              <View className='content-2'>
                {isLogin
                  ? (
                  <View className='user'>
                    <View className='user-info flex'>
                      <View className='head-content flex'>
                        <Image
                          className='hade-image'
                          src={user.avatarUrl}
                        ></Image>
                      </View>
                      <View className='text flex'>
                        <View className='hello'>Hi</View>
                        <Text>{utils.hidePhone(user.mobile)}</Text>
                      </View>
                      <View
                        className='exit'
                        onClick={() => {
                          this.exit();
                        }}
                      >
                        退出
                      </View>
                    </View>
                  </View>
                    )
                  : (
                  <View className='user'>
                    <View className='user-info flex'>
                      <View className='head-content flex'>
                        <Image
                          className='hade-image'
                          src={`${ossHost}health_header.png`}
                        ></Image>
                      </View>
                      <View className='health_unlock'>
                        登录解锁更多精彩内容
                      </View>
                      <View
                        className='exit'
                        onClick={() => {
                          this.setState({
                            showLoginModal: true
                          });
                        }}
                      >
                        登录
                      </View>
                    </View>
                  </View>
                    )}
                {this.props.minApp.historyList && (
                  <View className='record-list'>
                    <View className='list-title'>浏览记录</View>
                    <View className='list'>
                      {this.props.minApp.historyList.length
                        ? (
                            this.props.minApp.historyList.map(item => {
                              return (
                            <View key={item.browseTime} className='list-item'>
                              <View className='time-content flex'>
                                <Image
                                  src={clockIcon}
                                  className='clock-icon'
                                ></Image>
                                <Text>
                                  {utils.timeFormat(item.browseTime, 'm月d日')}
                                </Text>
                              </View>
                              {item.list.length
                                ? item.list.map(lItem => {
                                  return (
                                      <ArticleItem
                                        item={lItem}
                                        key={item.articleId}
                                      ></ArticleItem>
                                  );
                                })
                                : null}
                            </View>
                              );
                            })
                          )
                        : (
                        <View className='health-phone flex'>
                          <Image
                            src={`${ossHost}health_phone.png`}
                            className='health-phone-img'
                          />
                          <View className='health-phone-text'>
                            当前暂无浏览记录
                          </View>
                        </View>
                          )}
                    </View>
                  </View>
                )}
              </View>
                )}
          </View>
          <View className='tab flex'>
            <View
              className={`tab-item flex ${status === 1 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(1);
              }}
            >
              <Image
                src={status === 1 ? tab1Active : tab1}
                className='icon-1'
              ></Image>
              <Text>健康专栏</Text>
            </View>
            <View
              className={`tab-item flex ${status === 2 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(2);
              }}
            >
              <Image
                src={status === 2 ? tab2Active : tab2}
                className='icon-2'
              ></Image>
              <Text>我的</Text>
            </View>
          </View>
          {showLoginModal && (
            <LoginModal
              login={this.hideLoginModal.bind(this)}
              close={this.close}
              showState={showLoginModal}
            ></LoginModal>
          )}
        </View>
      </Page>
    );
  }
}
export default MinApp;
