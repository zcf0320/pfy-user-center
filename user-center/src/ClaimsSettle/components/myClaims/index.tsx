import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Image } from '@tarojs/components';
import * as claimsApi from '@actions/claimsSettle';
import utils from '@utils/index';
import NoResult from '../noResult';
import './index.scss';

const { ossHost } = utils.appConfig;

function MyClaims () {
  const [list, setList] = useState([]);
  useEffect(() => {
    claimsApi.insuranceClaimRecordList().then((res:any) => {
      setList(res);
    });
  }, []);
  const goUrl = () => {
    Taro.navigateTo({
      url: '/pages/user/service/exchange/index'
    });
  };
  return (
    <View className='claims-my'>
      {list.length !== 0 &&
        list.map((item: any) => {
          return (
            <View key={item.insuranceProductId}>
              <View>
                <View className='claims-my-box'>
                  <View className='claims-my-name claims-ellipsis'>
                    {item.insuranceProductName}
                  </View>
                  <View className='claims-my-text claims-ellipsis'>
                    {item.rightsName}
                  </View>
                  {/* 1待审核、2成功、3失败、4未提交过申请 */}
                  {item.state === 3 && (
                    <View className='claims-my-reason claims-ellipsis'>
                      失败原因：{item.failReason}
                    </View>
                  )}
                  {item.state === 2 && (
                    <Image
                      src={`${ossHost}claims_sucess.png`}
                      className='claims-my-img'
                    />
                  )}
                  {item.state === 1 && (
                    <Image
                      src={`${ossHost}claims_standby.png`}
                      className='claims-my-img'
                    />
                  )}
                  {item.state === 3 && (
                    <Image
                      src={`${ossHost}claims_fail.png`}
                      className='claims-my-img'
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      {list.length < 1 && <NoResult goUrl={goUrl} text='暂无理赔记录' />}
    </View>
  );
}
export default MyClaims;
