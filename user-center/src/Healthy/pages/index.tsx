import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import {
  closeHealthyDialog,
  gerRecommendCard,
  getHealthFile,
  getHealthyCard
} from '@actions/healthy';
import { needSelect } from '@actions/service';
import { getHealthScore } from '@actions/healthManage';
import LoginModal from '@components/loginModal';
import AuthModal from '@components/AuthModal';
import i18n from '@i18n/index';
import utils from '@utils/index';
import whiteClose from '@assets/white-close.png';
import editIcon from '@assets/edit-user-info.png';
import HealthInfo from '../components/HealthInfo';
import LifeHabit from '../components/LifeHabit';
import Record from '../components/Record';
import './index.scss';

const { xAccessToken, ossHost } = utils.appConfig;

interface IState {
  healthyFile: any;
  showLoginModal: boolean;
  showModal: boolean;
  activeIndex: number;
  userInfo: any;
  dialogueFlag: boolean;
  response: {
    createTime?: number;
    score?: number;
  };
  height: string;
  recommend: Array<any>;
  recordList: Array<any>;
}
export default class Healthy extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showLoginModal: false,
      showModal: false,
      activeIndex: 0,
      dialogueFlag: true,
      response: {},
      userInfo: {},
      healthyFile: {},
      height: '',
      recommend: [],
      recordList: []
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
  }

  componentDidShow () {
    const token = Taro.getStorageSync(xAccessToken);
    this.setState({
      recommend: [],
      recordList: [
        {
          code: 'WEIGHT_HEIGHT'
        },
        {
          code: 'BLOOD_GLUCOSE'
        },
        {
          code: 'BLOOD_PRESSURE'
        },
        {
          code: 'HEART_RATE'
        },
        {
          code: 'SPORT'
        },
        {
          code: 'SLEEP'
        }
      ]
    });
    if (token) {
      this.getNeedSelect();
      this.getHealthFile();
      getHealthScore().then((res: any) => {
        res &&
          this.setState({
            response: res
          });
      });
      const { userInfo } = utils.appConfig;
      // 更新用户信息
      const user = Taro.getStorageSync(userInfo) || {};
      this.setState({
        userInfo: user
      });
      gerRecommendCard().then((res: any) => {
        this.setState(
          {
            recommend: res
          },
          () => {
            getHealthyCard().then((res: any) => {
              this.setState({
                recordList: res
              });
            });
          }
        );
      });
    } else {
      this.setState({
        dialogueFlag: false
      });
    }
  }

  getNeedSelect () {
    needSelect()
      .then((res: any) => {
        this.setState({
          // dialogueFlag: false
          dialogueFlag: res.dialogueFlag
        });
      })
      .catch(() => {});
  }

  getHealthFile () {
    getHealthFile().then(res => {
      this.setState({
        healthyFile: res
      });
    });
  }

  // 不登陆
  noLogin (show) {
    this.setState({
      showLoginModal: show
    });
  }

  healthTab (ind) {
    const { userInfo } = utils.appConfig;
    // 更新用户信息
    const user = Taro.getStorageSync(userInfo) || {};
    const { token } = user;
    if (!token) {
      this.setState({
        showLoginModal: true
      });
    } else {
      this.setState({
        activeIndex: ind
      });
    }
    return true;
  }

  goIM () {
    const { userInfo } = utils.appConfig;
    const { token, hasIdCard } = Taro.getStorageSync(userInfo);
    if (token) {
      if (!hasIdCard) {
        this.setState({
          showModal: true
        });
        return;
      }
      Taro.navigateTo({
        url: '/IM/pages/index'
      });
    } else {
      this.noLogin(true);
    }
  }

  closeDialog () {
    const token = Taro.getStorageSync(xAccessToken);
    if (token) {
      closeHealthyDialog().then(() => {
        this.setState({
          dialogueFlag: true
        });
      });
    } else {
      this.noLogin(true);
    }
  }

  render () {
    const {
      showLoginModal,
      showModal,
      activeIndex,
      dialogueFlag,
      response,
      userInfo,
      healthyFile,
      height,
      recommend,
      recordList
    } = this.state;
    const token = Taro.getStorageSync(xAccessToken);
    const { score } = response;
    return (
      <View>
        <View className='healthy-custom-bar' style={{ height: height }}>
          健康档案
        </View>
        <View className='health-content'>
          <View className='health-content-top'>
            <View className='health-top'>
              <View className='health-top-left flex-box'>
                <View className='health-top-left-avatar'>
                  <Image
                    src={userInfo.avatarUrl || `${ossHost}defaultHeader.png`}
                    className='health-top-left-img'
                    onClick={() => {
                      if (!token) {
                        this.noLogin(true);
                        return;
                      }
                      Taro.navigateTo({
                        url: '/Healthy/pages/userInfo/index'
                      });
                    }}
                  ></Image>
                  <Image
                    className='health-top-left-avatar-edit'
                    src={editIcon}
                  ></Image>
                </View>

                <View className='health-top-left-text-content'>
                  <View
                    className='health-top-left-text'
                    onClick={() => {
                      if (!token) {
                        this.noLogin(true);
                        return;
                      }
                      Taro.navigateTo({
                        url: '/Healthy/pages/family/index'
                      });
                    }}
                  >
                    {i18n.chain.healthyPage.myFamily}
                    <Image
                      className='health-more-img'
                      src={`${ossHost}health-more.png`}
                    ></Image>
                  </View>
                  <View className='health-top-left-text-img'></View>
                </View>
              </View>
              <View
                className='health-top-right'
                onClick={() => {
                  if (!token) {
                    this.noLogin(true);
                    return;
                  }
                  Taro.navigateTo({
                    url: '/healthManage/score/index'
                  });
                }}
              >
                <View className='health-top-right-fraction'>{score || 0}</View>
                <View className='health-top-right-content'>
                  <View className='health-top-right-grade'>
                    {i18n.chain.healthyPage.healthScore}
                  </View>
                  <View className='health-top-right-grade-explain'></View>
                </View>
              </View>
            </View>
          </View>
          <View className='health-init'>
            <View className='health-tap'>
              <View className='flex-box'>
                <View
                  className={`health-tap-left ${
                    activeIndex === 0 ? 'active' : ''
                  }`}
                  onClick={() => this.healthTab(0)}
                >
                  {i18n.chain.healthyPage.healthRecords}
                </View>
                <View
                  className={`health-tap-content ${
                    activeIndex === 1 ? 'active' : ''
                  } `}
                  onClick={() => this.healthTab(1)}
                >
                  {i18n.chain.healthyPage.healthHistory}
                </View>
                <View
                  className={`health-tap-right ${
                    activeIndex === 2 ? 'active' : ''
                  }`}
                  onClick={() => this.healthTab(2)}
                >
                  {i18n.chain.healthyPage.habitsCustoms}
                </View>
              </View>
              <View className='scroll-view'>
                {activeIndex === 0
                  ? (
                  <View className='record-view'>
                    {recommend.length > 0 &&
                      recommend.map(item => {
                        return (
                          <Record
                            isRecommend
                            key={item.code}
                            healthyFile={healthyFile}
                            code={item.code}
                            showLogin={() => {
                              this.noLogin(true);
                            }}
                          ></Record>
                        );
                      })}
                    {recordList.length > 0 &&
                      recordList.map(item => {
                        return (
                          <Record
                            isRecommend={false}
                            key={item.code}
                            healthyFile={healthyFile}
                            code={item.code}
                            showLogin={() => {
                              this.noLogin(true);
                            }}
                          ></Record>
                        );
                      })}
                  </View>
                    )
                  : activeIndex === 1
                    ? (
                  <HealthInfo
                    healthyFile={healthyFile}
                    getHealthFile={() => {
                      this.getHealthFile();
                    }}
                  ></HealthInfo>
                      )
                    : activeIndex === 2
                      ? (
                  <LifeHabit
                    healthyFile={healthyFile}
                    getHealthFile={() => {
                      this.getHealthFile();
                    }}
                  ></LifeHabit>
                        )
                      : null}
              </View>
              {activeIndex === 0 && (
                <View
                  className='health-understand'
                  onClick={() => {
                    const { userInfo } = utils.appConfig;
                    const user = Taro.getStorageSync(userInfo) || {};
                    const { token } = user;
                    Taro.navigateTo({
                      url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/hra/start&code=BoRTUK&token=${token}`
                    });
                  }}
                ></View>
              )}
            </View>
          </View>
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
          {!dialogueFlag && (
            <View className='dialog-tips'>
              <View className='dialog-tips-content'>
                <Image
                  className='dialog-tips-content-img'
                  src={`${ossHost}open-dialog.png`}
                  onClick={() => {
                    this.goIM();
                  }}
                ></Image>
                <Image
                  src={whiteClose}
                  className='dialog-tips-content-close'
                  onClick={() => {
                    this.setState({
                      dialogueFlag: true
                    });
                  }}
                ></Image>
              </View>
            </View>
          )}

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
        </View>
      </View>
    );
  }
}
