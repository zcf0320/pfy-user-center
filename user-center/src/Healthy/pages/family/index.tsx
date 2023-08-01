import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import { useState, useEffect, useCallback } from 'react';
import {
  getFamilyHealthyFiles,
  getFamilyHealthyCard,
  getShareInformation,
  getUserFamilyList,
  unbindFamilyAccount
} from '@actions/healthy';
import utils from '@utils/index';
import LoginModal from '@components/loginModal';
import FamilyRecord from '../../components/FamilyRecord';
import './index.scss';

const { ossHost, xAccessToken, H5_URL, isH5 } = utils.appConfig;

const Family = () => {
  const [height, setHeight]: any = useState();
  const [healthyFile, setHealthyFile]: any = useState();
  const [recordList, setRecordList]: Array<any> = useState([]);
  const [activeIndex, setActiveIndex] = useState(32);
  const [flag, setFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [unbinding, setUnbinding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userInfo, setUserInfo]: any = useState({});
  const [list, setList]: any = useState([]);
  const [listFlag, setListFlag] = useState(true);
  const [linkToken, setLinkToken] = useState();
  const getFamilyList = useCallback(() => {
    getUserFamilyList()
      .then((res: any) => {
        setList(res);
        if (res.length > 0) {
          getFamilyData(res[0].fuserId);
          setActiveIndex(0);
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const token = Taro.getStorageSync(xAccessToken);

    if (Taro.getEnv() === 'WEAPP') {
      const rect = Taro.getMenuButtonBoundingClientRect();
      const { statusBarHeight } = Taro.getSystemInfoSync();
      setHeight(rect.bottom + statusBarHeight + 'px');
    }

    if (!token) {
      setShowLoginModal(true);
    } else {
      getFamilyList();
      getShareInformation()
        .then((res: any) => {
          setLinkToken(res);
        })
        .catch(() => {});
    }
  }, [getFamilyList]);

  useEffect(() => {
    if (list.length === 0) {
      setListFlag(true);
    } else {
      setListFlag(false);
    }
  }, [list, listFlag]);

  const getFamilyData = fuserId => {
    getFamilyHealthyFiles(fuserId).then((res: any) => {
      setHealthyFile(res);
    });
    getFamilyHealthyCard(fuserId).then((res: any) => {
      setRecordList(res);
    });
  };

  const handActiveIndex = (v, i) => {
    if (isH5) {
      let scrollIndex = activeIndex > i ? i - 4 : i + 4;
      // 边界判定
      if (scrollIndex > list.length - 1) {
        scrollIndex = list.length - 1;
      }
      if (scrollIndex < 0) {
        scrollIndex = 0;
      }
      const element = document.getElementsByClassName('family-content-list')[
        scrollIndex
      ];
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }

    setActiveIndex(i);
    setUserInfo(v);
    getFamilyData(v.fuserId);
  };
  const noLogin = show => {
    setShowLoginModal(show);
  };
  // 邀请
  const handAddFamily = () => {
    if (list.length >= 12) {
      setAddFlag(true);
    } else {
      setFlag(true);
    }
  };

  // 复制邀请链接
  const handLink = () => {
    setFlag(false);
    const url = `${H5_URL}Healthy/pages/relatedFamily/index?linkToken=${linkToken}`;
    Taro.setClipboardData({
      data: url
    });
  };

  // 确认解绑
  const handUnbinding = () => {
    const unbindFamilyAccountReq = {
      fuserId: userInfo.fuserId
    };
    unbindFamilyAccount(unbindFamilyAccountReq).then(() => {
      setUnbinding(false);
      getFamilyList();
    });
  };
  const renderList = () => {
    return (
      <View className='family-list'>
        {recordList.map(item => {
          if (item.code === 'SPORT') {
            // delete item.code;
            item.code = 'sport';
          } else if (item.code === 'SLEEP') {
            item.code = 'sleep';
          }
          return (
            <FamilyRecord
              isRecommend={false}
              flag
              key={item.code}
              healthyFile={healthyFile}
              code={item.code}
              showLogin={() => {
                noLogin(true);
              }}
            ></FamilyRecord>
          );
        })}
      </View>
    );
  };
  return (
    <View className='family'>
      <View className='family-header' style={{ height: height }}>
        <View
          onClick={() =>
            Taro.switchTab({
              url: '/Healthy/pages/index'
            })
          }
        >
          <Image
            className='family-header-left'
            src={`${ossHost}family-header-left.png`}
          ></Image>
        </View>
        <View>家庭成员</View>
        <View></View>
      </View>
      <View className='family-main'>
        <View className='family-main-content'>
          <View className='family-main-bottom-content'>
            <View className='family-main-bottom-title'>我的家人</View>
            <View className='family-main-content-list'>
              <View className='family-main-list'>
                {list.length > 0 &&
                  list.map((v, i) => {
                    return (
                      <View
                        className={`family-content-list ${
                          activeIndex === i ? 'active' : ''
                        }`}
                        key={v.id}
                        onClick={() => handActiveIndex(v, i)}
                      >
                        <Image
                          src={
                            v.ftype === '父亲'
                              ? `${ossHost}parent-boy.png`
                              : v.ftype === '儿子'
                                ? `${ossHost}family-boy.png`
                                : v.ftype === '母亲'
                                  ? `${ossHost}parent-girl.png`
                                  : v.ftype === '女儿'
                                    ? `${ossHost}family-girl.png`
                                    : v.ftype === '丈夫'
                                      ? `${ossHost}spouse-boy.png`
                                      : v.ftype === '妻子'
                                        ? `${ossHost}spouse-girl.png`
                                        : `${ossHost}related-family-user.png`
                          }
                          className='family-avatar'
                        ></Image>
                        <Image
                          src={`${ossHost}family-list-cancel.png`}
                          className='family-list-cancel'
                          onClick={() => setUnbinding(true)}
                        ></Image>
                        <View className='family-name'>{v.name}</View>
                        <View
                          className={`${
                            activeIndex === i ? 'family-bottom-list' : ''
                          }`}
                        ></View>
                      </View>
                    );
                  })}
              </View>
              <View
                className='family-main-add'
                onClick={() => handAddFamily()}
                style={{ width: utils.appConfig.isH5 ? '' : '72px' }}
              >
                <Image
                  src={`${ossHost}family-add.png`}
                  className='family-add'
                ></Image>
                <View className='family-text'>
                  <View className='family-add-text'>添加</View>
                  {list.length > 0 && (
                    <View className='family-add-number'>
                      ({list.length}/12)
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className='family-footer'>
        <View className='family-footer-content'>
          {list.length > 0
            ? (
                renderList()
              )
            : (
            <View className='family-footer-img'>
              <Image
                className='family-nodata'
                src={`${ossHost}family-nodata.png`}
              ></Image>
              <View className='family-nodata-text'>
                您还没有添加家人信息呦～
              </View>
            </View>
              )}
        </View>
      </View>
      {flag && (
        <View className='family-mack'>
          <View className='family-mack-content'>
            <Image
              src={`${ossHost}family-cancel.png`}
              className='family-cancel'
              onClick={() => setFlag(false)}
            ></Image>
            <View className='family-title'>邀请家人共享健康信息</View>
            <View className='family-text mb-32'>
              复制链接，微信发送家人共享健康信息
            </View>
            <View className='family-text mb-84'>
              https://*******************
            </View>
            <Button
              className='family-btn'
              onClick={() => handLink()}
              // openType='share'
            >
              复制链接邀请家人
            </Button>
          </View>
        </View>
      )}
      {addFlag && (
        <View className='family-add-mack'>
          <View className='family-content'>
            <Image
              src={`${ossHost}family-cancel.png`}
              className='family-cancel'
              onClick={() => setAddFlag(false)}
            ></Image>
            <View className='family-content-title-top'>
              您的家庭成员已到达上限人数
            </View>
            <View className='family-content-title-bottom '>
              如需添加新成员，请先解绑原有成员
            </View>
            <View className='family-btn' onClick={() => setAddFlag(false)}>
              确定
            </View>
          </View>
        </View>
      )}
      {unbinding
        ? (
        <View className='family-unbinding-mack'>
          <View className='family-content'>
            <View className='family-content-title'>
              确认解绑家庭成员<View>{userInfo.name}</View>吗？
            </View>
            <View className='family-btn'>
              <View
                className='family-btn-left'
                onClick={() => setUnbinding(false)}
              >
                取消
              </View>
              <View
                className='family-btn-right'
                onClick={() => handUnbinding()}
              >
                确认
              </View>
            </View>
          </View>
        </View>
          )
        : null}

      {showLoginModal && (
        <LoginModal
          showState={showLoginModal}
          noLogin={() => {
            noLogin(false);
          }}
          goLogin={() => {
            setShowLoginModal(false);
          }}
        ></LoginModal>
      )}
    </View>
  );
};

export default Family;
