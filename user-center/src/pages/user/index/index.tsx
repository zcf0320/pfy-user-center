import Taro from '@tarojs/taro';
import { Component } from 'react';
import moment from 'moment';
import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import LoginModal from '@components/loginModal';
import Select from '@components/selectModal';
import { addService, needSelect } from '@actions/service';
import { GET_QUESTIONNAURE_LIST, SET_MODAL } from '@constants/common';
import {
  getBanner,
  getDynamicImg,
  homePage,
  homePageList,
  serviceRights
} from '@actions/common';
import { connect } from 'react-redux';
import utils from '@utils/index';
import AuthModal from '@components/AuthModal';
import './index.scss';

// const showSign = false;
const { ossHost } = utils.appConfig;

interface IProps {
  onSetQuestionnaure: Function;
}
interface IState {
  bannerList: Array<any>;
  showModal: boolean;
  showLoginModal: boolean;
  allList: Array<any>;
  articleList: Array<any>;
  homeList: Array<any>;
  serviceList: Array<any>;
  showNewService: boolean;
  serviceCount: number;
  policyCount: number;
  height: string;
}

@connect(
  state => state,
  dispatch => ({
    onSetQuestionnaure (data) {
      dispatch({
        type: GET_QUESTIONNAURE_LIST,
        payload: data
      });
    },
    onSetModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class Home extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      bannerList: [],
      showModal: false,
      showLoginModal: false,
      allList: [],
      articleList: [],
      homeList: [],
      showNewService: false,
      serviceList: [
        {
          pageCode: '',
          text: i18n.chain.homepage.serviceExchange,
          img: `${ossHost}service-exchange.png`
        },
        {
          pageCode: '',
          text: i18n.chain.serviceList.myPolicy,
          img: `${ossHost}my-policy.png`
        },
        {
          pageCode: '',
          text: i18n.chain.serviceList.service7,
          img: `${ossHost}daily-task.png`
        },
        {
          pageCode: '',
          text: '每日打卡',
          img: `${ossHost}clock-in-everyday.png`
        }
      ],
      serviceCount: 0,
      policyCount: 0,
      height: ''
    };
  }

  componentDidMount () {
    if (Taro.getEnv() === 'WEAPP') {
      const rect = Taro.getMenuButtonBoundingClientRect();
      const { statusBarHeight } = Taro.getSystemInfoSync();
      this.setState({
        height: rect.bottom + statusBarHeight + 'px'
      });
    }
    this.getArticleList();
    this.getHomePageList();
    getBanner({ imgType: 1 })
      .then((res: any) => {
        this.setState({
          bannerList: res
        });
      })
      .catch(() => {});
    getDynamicImg({ userDynamicType: 'HEALTH_CARD' })
      .then((res: any) => {
        const service = this.state.serviceList;
        service[3] = {
          pageCode: '',
          text: res.desText,
          img: res.url,
          actionCode: res.actionCode
        };
        this.setState({
          serviceList: service
        });
      })
      .catch(() => {});
  }

  componentDidShow () {
    this.getServiceMap();
    this.setState({
      showLoginModal: false,
      serviceCount: 0,
      policyCount: 0
    });
    const { userInfo } = utils.appConfig;
    const { token } = Taro.getStorageSync(userInfo) || {};

    if (token) {
      this.getNeedSelect();
    }
  }

  // 关闭服务弹框
  closeModal (serviceList) {
    const { allList } = this.state;
    const serviceInfoIdList: any = [];
    const serviceInfoGroupIdList: any = [];
    serviceList.forEach((item: any) => {
      if (item.select) {
        if (item.serviceType) {
          serviceInfoGroupIdList.push(item.serviceInfoId);
        } else {
          serviceInfoIdList.push(item.serviceInfoId);
        }
      }
    });
    const params = {
      code: allList[0].policyNo,
      packageId: serviceList[0].servicePackageId,
      serviceInfoIdList,
      serviceInfoGroupIdList,
      type: 2
    };
    addService(params).then(() => {
      this.state.allList.shift();
      this.setState({
        allList: [...this.state.allList]
      });
    });
  }

  // 不登陆
  noLogin (show) {
    this.setState({
      showLoginModal: show
    });
  }

  // 获取返回的服务项
  getNeedSelect () {
    needSelect()
      .then((res: any) => {
        if (res) {
          this.setState({
            allList: res.list,
            serviceCount: res.serviceNum,
            policyCount: res.policyNum
          });
          if (res.hasNewServiceRecord) {
            this.setState({
              showNewService: true
            });
            return;
          }
          if (res.list && res.list.length && res.list[0].list.length === 1) {
            const serviceInfoIdList: any = [];
            const serviceInfoGroupIdList: any = [];
            res.list[0].list.forEach((item: any) => {
              if (item.serviceType) {
                serviceInfoGroupIdList.push(item.serviceInfoId);
              } else {
                serviceInfoIdList.push(item.serviceInfoId);
              }
            });
            const params = {
              code: res.list[0].policyNo,
              packageId: res.list[0].list[0].servicePackageId,
              serviceInfoIdList,
              serviceInfoGroupIdList,
              type: 2
            };
            addService(params).then(() => {
              res.list[0].list.shift();
              this.setState({
                allList: [...res.list[0].list]
              });
            });
          }
        }
      })
      .catch(() => {});
  }

  getServiceMap = () => {
    serviceRights()
      .then((res: any) => {
        const questionnaure = [] as Array<any>;
        for (const key in res) {
          if (key !== 'specialColumn' && utils.appConfig.codeMap[key] < 5) {
            const { serviceInfoName, serviceRecordIdList } = res[key];
            res[key].itemName = serviceInfoName;
            res[key].state = serviceRecordIdList.length ? 0 : 2;
            res[key].pageCode = key;
            res[key].serviceRecordId = serviceRecordIdList[0];
            questionnaure.push(res[key]);
          }
        }
        this.props.onSetQuestionnaure(questionnaure.sort(this.sort));
      })
      .catch(() => {});
  };

  sort (a, b) {
    return b.serviceRecordIdList.length - a.serviceRecordIdList.length;
  }

  // 获取文章
  getArticleList () {
    homePage()
      .then((res: any) => {
        this.setState({
          articleList: res
        });
      })
      .catch(() => {});
  }

  // 获取特色服务
  getHomePageList () {
    homePageList()
      .then((res: any) => {
        this.setState({
          homeList: res
        });
      })
      .catch(() => {});
  }

  go (url) {
    Taro.navigateTo({
      url
    });
  }

  // 去使用服务
  goService (index) {
    let url = '';
    const { serviceList } = this.state;
    // 去登陆
    const { userInfo } = utils.appConfig;
    const { token } = Taro.getStorageSync(userInfo);
    if (!token) {
      this.setState({
        showLoginModal: true
      });
      return;
    }
    if (index === 3) {
      const item = serviceList[index];
      if (item.actionCode) {
        Taro.navigateTo({
          url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}record/recordDetail&code=${item.actionCode}`
        });
      } else {
        Taro.switchTab({ url: '/Healthy/pages/index' });
      }
    } else {
      index === 0 && (url = '/pages/user/service/exchange/index');
      (index === 1 || index === 8) && (url = '/Insurance/pages/manage/index');
      index === 2 && (url = '/PointsMall/pages/task/index');

      index === 9 && (url = '/pages/user/service/list/index');

      if (url) {
        Taro.navigateTo({
          url
        });
      }
    }
  }

  goBanner () {
    const { userInfo } = utils.appConfig;
    const { token, hasIdCard } = Taro.getStorageSync(userInfo);
    if (!token) {
      this.setState({
        showLoginModal: true
      });
      return;
    }
    if (!hasIdCard) {
      this.setState({
        showModal: true
      });
      return;
    }
    Taro.switchTab({
      url: '/Healthy/pages/index'
    });
  }

  onShareAppMessage () {
    return {
      title: i18n.chain.common.title,
      imageUrl:
        'https://senro-tree-sleep-1301127519.cos.ap-nanjing.myqcloud.com/img/%E5%AF%B0%E5%AE%87logo.png',
      path: '/pages/user/index/index'
    };
  }

  render () {
    const {
      bannerList,
      allList,
      showLoginModal,
      showModal,
      articleList,
      homeList,
      showNewService,
      serviceList,
      serviceCount,
      policyCount,
      height
    } = this.state;
    return (
      <View>
        <View className='home-custom-bar' style={{ height: height }}>
          {Taro.getEnv() === 'WEAPP'
            ? (
            <Image className='logo' src={`${ossHost}home-logo.png`}></Image>
              )
            : (
                '首页'
              )}
        </View>
        {allList && allList[0] && allList[0].list.length > 1
          ? (
          <Select
            selectNum={allList[0].selectNum}
            list={allList[0].list}
            confirm={list => {
              this.closeModal(list);
            }}
          />
            )
          : null}
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
        {showModal && (
          <AuthModal
            onConfirm={() => {
              this.setState({
                showModal: false
              });
              Taro.navigateTo({
                url: '/pages/register/index?isJump=true'
              });
            }}
            onCancel={() => {
              this.setState({
                showModal: false
              });
            }}
          ></AuthModal>
        )}
        {showNewService
          ? (
          <View className='new-service-modal'>
            <View className='new-service-modal-content'>
              <View className='new-service-modal-content-bg'>
                <View
                  className='btn'
                  onClick={() => {
                    this.setState(
                      {
                        showNewService: false
                      },
                      () => {
                        Taro.navigateTo({
                          url: '/pages/user/service/list/index'
                        });
                      }
                    );
                  }}
                >
                  查看我的服务
                </View>
              </View>
              <View
                className='close-icon'
                onClick={() => {
                  this.setState({
                    showNewService: false
                  });
                }}
              ></View>
            </View>
          </View>
            )
          : null}
        <View className='home-box'>
          <View className='top-box'>
            {bannerList && bannerList.length > 0 && (
              <Swiper
                className='swiper-content'
                indicatorDots={false}
                indicatorColor='rgba(255,255,255, 0.6)}'
                indicatorActiveColor='#fff'
                circular
                autoplay
              >
                {bannerList.map(item => {
                  return (
                    <SwiperItem
                      className='swiper-item'
                      key={item.id}
                      onClick={() => {
                        this.goBanner();
                      }}
                    >
                      <Image className='banner-box' src={item.url}></Image>
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}

            <View className='service-list-index flex'>
              {serviceList.length > 0 &&
                serviceList.map((item, index) => {
                  return (
                    <View
                      className='service-item flex'
                      key={item.text}
                      onClick={() => {
                        this.goService(index);
                      }}
                    >
                      {index === 3 && (
                        <Image
                          src={`${ossHost}go-clock-in.png`}
                          className='go-clock'
                        ></Image>
                      )}
                      <Image className='img' src={item.img}></Image>
                      <Text>{item.text}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
          <View className='service-box'>
            <View
              className='service-item'
              onClick={() => {
                this.goService(9);
              }}
            >
              <View className='flex-box'>
                <View className='service-item-title'>
                  {i18n.chain.homepage.myService}
                  <Text className='service-item-title-little'>
                    ({serviceCount}项)
                  </Text>
                </View>
              </View>
              <View className='service-subTitle'>
                {i18n.chain.homepage.myServiceInfo} {'>'}
              </View>
            </View>
            <View
              className='service-item item-2'
              onClick={() => {
                this.goService(8);
              }}
            >
              <View className='flex-box'>
                <View className='service-item-title'>
                  {i18n.chain.serviceList.service4}
                  <Text className='service-item-title-little'>
                    ({policyCount}份)
                  </Text>
                </View>
              </View>
              <View className='service-subTitle'>
                {i18n.chain.homepage.applyClaims} {'>'}
              </View>
            </View>
          </View>
          <View className='middle-box'>
            <View className='service-title-box flex-between'>
              <View className='service-title'>
                <Text>{i18n.chain.homepage.characteristicService}</Text>
              </View>
              <View
                className='flex-box'
                onClick={() => {
                  Taro.switchTab({ url: '/pages/mall/index/index' });
                }}
              >
                <View className='name'>{i18n.chain.homepage.look}</View>
                <Image
                  className='service-more'
                  src={`${ossHost}images/more.png`}
                ></Image>
              </View>
            </View>
            <View className='service-list-speaic flex'>
              <View
                className='service-item-1 mr-16'
                onClick={() => {
                  this.go(
                    `/pages/mall/detail/index?id=${homeList[0].productId}`
                  );
                }}
              >
                <View className='mb-16 describe'>
                  {homeList.length > 0 && homeList[0].serviceItemName}
                </View>
                <View className='sub-describe'>
                  {homeList.length > 0 && homeList[0].remark}
                </View>
              </View>
              <View>
                <View
                  className='service-item item-2'
                  onClick={() => {
                    this.go(
                      `/pages/mall/detail/index?id=${homeList[1].productId}`
                    );
                  }}
                >
                  <View className='mb-16 describe'>
                    {homeList.length > 0 && homeList[1].serviceItemName}
                  </View>
                  <View className='sub-describe'>
                    {homeList.length > 0 && homeList[1].remark}
                  </View>
                </View>
                <View
                  className='service-item item-3'
                  onClick={() => {
                    this.go(
                      `/pages/mall/detail/index?id=${homeList[2].productId}`
                    );
                  }}
                >
                  <View className='mb-16 describe'>
                    {homeList.length > 0 && homeList[2].serviceItemName}
                  </View>
                  <View className='sub-describe'>
                    {homeList.length > 0 && homeList[2].remark}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='health-box mt-20'>
            <View className='service-title-box flex-between'>
              <View className='service-title'>
                <Text>{i18n.chain.homepage.healthEncyclopedia}</Text>
              </View>
              <View
                className=' flex-box'
                onClick={() => {
                  Taro.navigateTo({ url: '/article/index/index' });
                }}
              >
                <View className='name'>{i18n.chain.homepage.more}</View>
                <Image
                  className='service-more'
                  src={`${ossHost}images/more.png`}
                ></Image>
              </View>
            </View>
            <View className='data-list'>
              {articleList &&
                articleList.length > 0 &&
                articleList.map(item => {
                  return (
                    <View
                      className='data-item mt-48'
                      key={item.id}
                      onClick={() => {
                        let url = '';
                        url = `/article/detail/index?id=${item.id}`;
                        Taro.navigateTo({
                          url
                        });
                      }}
                    >
                      <View className='left flex'>
                        <View className='title'>{item.title}</View>
                        <View className='flex'>
                          <View className='sub-title'>
                            #{item.tags[0] || ''}
                          </View>
                          <View className='time'>
                            {moment(item.updateTime).format('MM-DD HH:mm')}
                          </View>
                        </View>
                      </View>
                      <Image
                        className='right'
                        mode='aspectFill'
                        src={item.advertisPic}
                      ></Image>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Home;
