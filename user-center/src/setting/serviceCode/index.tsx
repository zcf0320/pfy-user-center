import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import Page from '@components/page';
import utils from '@utils/index';
import { getList, receivePrensent } from '@actions/serviceCode';
import EmptyBox from '@components/emptyBox';
import './index.scss';

interface IProps {
  saveData: Function;
}
interface IState {
  currentIndex: number;
  scrollHeight: number;
  serviceCodeList: Array<any>;
  loadAll: boolean;
  scrollTop: number;
}
const pageSize = 10;
let pageNum = 1;
const stateList = {
  1: i18n.chain.user.getNow,
  2: i18n.chain.user.received,
  3: i18n.chain.user.expired
};
class ServiceCode extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      currentIndex: 1, // 状态：1待领取，2已领取，3已过期，4已失效
      scrollHeight: 0,
      serviceCodeList: [],
      loadAll: false,
      scrollTop: 0
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.serviceCouponCode });
    this.getList();
    this.getScrollHeight();
  }

  changeTab = index => {
    const { currentIndex } = this.state;
    if (currentIndex === index) {
      return;
    }
    pageNum = 1;
    this.setState(
      {
        currentIndex: index,
        scrollTop: Math.random(),
        serviceCodeList: []
      },
      () => {
        // 更改scroll高度
        this.getScrollHeight();
        this.getList();
      }
    );
  };

  // 获取数据
  getList () {
    const { serviceCodeList } = this.state;
    const params: any = {
      pageNum,
      pageSize,
      state: this.state.currentIndex
    };
    getList(params).then((res:any) => {
      if (pageNum >= Math.ceil(res.total / 10)) {
        this.setState({
          loadAll: true
        });
      } else {
        this.setState({
          loadAll: false
        });
      }
      this.setState({
        serviceCodeList: serviceCodeList.concat(res.records)
      });
    });
  }

  getScrollHeight = () => {
    const { windowHeight, windowWidth } = Taro.getSystemInfoSync() || {};
    let height = 48;
    utils.appConfig.isH5 && (height = height + 44);
    this.setState({
      scrollHeight: windowHeight - (windowWidth / 375) * height
    });
  };

  tolower () {
    if (this.state.loadAll) {
      return;
    }
    pageNum++;
    this.getList();
  }

  toReceive (id, state) {
    if (state === 1) {
      receivePrensent(id).then(() => {
        Taro.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000,
          success: () => {
            pageNum = 1;
            setTimeout(() => {
              this.setState(
                {
                  serviceCodeList: []
                },
                () => {
                  this.getList();
                }
              );
            }, 2000);
          }
        });
      });
    }
  }

  render () {
    const { currentIndex, serviceCodeList } = this.state;
    return (
      <Page showBack title={i18n.chain.user.serviceCouponCode}>
        <View className='serviceCode-page flex'>
          <View className='health-tab flex'>
            <View
              className={`tab-item ${currentIndex === 1 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(1);
              }}
            >
              {i18n.chain.user.notClaimed}
            </View>
            <View
              className={`tab-item ${currentIndex === 2 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(2);
              }}
            >
              {i18n.chain.user.received}
            </View>
            <View
              className={`tab-item ${currentIndex === 3 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(3);
              }}
            >
            {i18n.chain.user.expired}
            </View>
          </View>
          <ScrollView
            scrollY
            style={{
              height: `${this.state.scrollHeight}px`,
              backgroundColor: '#fff',
              width: '100%'
            }}
            scrollTop={this.state.scrollTop}
            onScrollToLower={this.tolower.bind(this)}
          >
            {serviceCodeList.length > 0
              ? (
              <View className='serviceCode-list flex'>
                {serviceCodeList.map(item => {
                  return (
                    <View
                      className={`${
                        item.state === 3
                          ? 'serviceCode-item disable'
                          : 'serviceCode-item'
                      }`}
                      key={item.id}
                    >
                      <View className='code-title'>{item.name}</View>
                      <View
                        className={`${
                          item.channel === 1
                            ? 'code-type-marketing'
                            : 'code-type-service'
                        }`}
                      ></View>
                      <View className='code-content flex'>
                        <Text className='code-time'>
                          {utils.timeFormat(item.effectiveTimeStart, 'y.m.d')}—
                          {utils.timeFormat(item.effectiveTimeEnd, 'y.m.d')}
                        </Text>
                        <View
                          className={`${
                            item.state === 1
                              ? 'serviceCode-btn'
                              : 'serviceCode-btn disable'
                          }`}
                          onClick={this.toReceive.bind(
                            this,
                            item.id,
                            item.state
                          )}
                        >
                          {stateList[item.state]}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
                )
              : (
              <View className='empty flex'>
                <EmptyBox title={i18n.chain.user.noCouponCode}></EmptyBox>
              </View>
                )}
          </ScrollView>
        </View>
      </Page>
    );
  }
}
export default ServiceCode;
