import {
  getAcceptInvitation,
  getUserFamilyList,
  getUserNameById
} from '@actions/healthy';
import Page from '@components/page';
import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index';
import { useEffect, useState } from 'react';
import './index.scss';
import { getUrlParams } from '../../../utils/strTool';

const { ossHost, userInfo } = utils.appConfig;
const list = [
  {
    title: '父母',
    id: 1
  },
  {
    title: '配偶',
    id: 2
  },
  {
    title: '子女',
    id: 3
  }
];
const RelatedFamily = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  const [addFlag, setAddFlag] = useState(false);
  const [user, setUser]: any = useState({});
  const [familyType, setFamilyType]: any = useState();
  const linkToken = getUrlParams('linkToken');
  useEffect(() => {
    const param = {
      id: linkToken
    };
    getUserNameById(param).then((res: any) => {
      setUser(res);
    });
  }, [linkToken]);

  const handTab = (v: { title: any; id?: number }, i: number) => {
    setActiveIndex(i);
    if (v.title === '父母') {
      setFamilyType('PARENT');
    } else if (v.title === '配偶') {
      setFamilyType('SPOUSE');
    } else if (v.title === '子女') {
      setFamilyType('CHILDREN');
    }
  };

  const handOk = () => {
    const { token, hasIdCard } = Taro.getStorageSync(userInfo);
    if (activeIndex === 3) {
      Taro.showToast({
        title: '请选择你与TA的家庭关系',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (!token) {
        Taro.navigateTo({
          url: '/pages/h5/login/index'
        });
      } else if (!hasIdCard) {
        Taro.navigateTo({
          url: '/pages/register/index'
        });
      } else {
        // 获取成员数，满的时候
        getUserFamilyList().then((res: any) => {
          if (res.length >= 12) {
            setAddFlag(true);
          } else {
            const vo = {
              familyTypeCode: familyType,
              id: linkToken
            };
            getAcceptInvitation(vo)
              .then(res => {
                console.log(res);
                setActiveIndex(3);
                Taro.redirectTo({
                  url: '/Healthy/pages/family/index'
                });
              })
              .catch(res => {
                console.log(res);
              });
          }
        });
      }
    }
  };

  return (
    <Page showBack={false} title='关联家人'>
      <View className='relatedFamily'>
        <View className='relatedFamily-content'>
          <Image
            className='related-family-user'
            src={user.avatarUrl || `${ossHost}related-family-user.png`}
          ></Image>
          <View className='relatedFamily-content-main'>
            <View className='relatedFamily-title'>
              <Image
                src={`${ossHost}related-family-title-left.png`}
                className='related-family-title-left'
              ></Image>
              <View className='related-family-title'>
                {user.name}
                邀请你加入TA的家庭
              </View>
              <Image
                src={`${ossHost}related-family-title-right.png`}
                className='related-family-title-right'
              ></Image>
            </View>
            <View className='relatedFamily-choice'>
              <View className='relatedFamily-choice-title'>
                请选择TA与你的家庭关系
              </View>
              <View className='relatedFamily-choice-list'>
                {list.length > 0 &&
                  list.map((v, i) => {
                    return (
                      <View
                        key={v.id}
                        onClick={() => handTab(v, i)}
                        className={`relatedFamily-choice-list-txet ${
                          activeIndex === i ? 'active' : ''
                        }`}
                      >
                        {v.title}
                      </View>
                    );
                  })}
              </View>
            </View>
            <View className='relatedFamily-img'>
              <View className='relatedFamily-img-left'>
                <Image
                  src={`${ossHost}related-family-main-left.png`}
                  className='related-family-main-left'
                ></Image>
                <View className='relatedFamily-img-text'>共享家人健康信息</View>
              </View>
              <View className='relatedFamily-img-right'>
                <Image
                  src={`${ossHost}related-family-main-right.png`}
                  className='related-family-main-right'
                ></Image>
                <View className='relatedFamily-img-text'>监督健康打卡</View>
              </View>
            </View>
            <View
              className='relatedFamily-btn'
              onClick={() => {
                handOk();
              }}
            >
              确认并接受邀请
            </View>
          </View>
        </View>
        {addFlag && (
          <View className='family-add-mack'>
            <View className='family-content'>
              <View className='family-content-title'>
                家庭成员已满，请与邀请人沟通
              </View>
              <View className='family-btn' onClick={() => setAddFlag(false)}>
                确定
              </View>
            </View>
          </View>
        )}
      </View>
    </Page>
  );
};

export default RelatedFamily;
