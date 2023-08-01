import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const RecordItem = (props:any) => {
  const {
    serviceRecordId,
    needCheck,
    checkTime,
    failReason,
    serviceInfoName,
    state
  } = props.recordDetail || {};
  const [show, setShow] = useState(false);
  const again = () => {
    Taro.navigateTo({
      url: `/ServicesItems/pages/seconds/index?serviceRecordId=${serviceRecordId}`
    });
  };
  const goReport = () => {
    Taro.navigateTo({
      url: `/ServicesItems/pages/seconds/report/index?serviceRecordId=${serviceRecordId}`
    });
  };
  // const goUse = () => {
  //     Taro.navigateTo({
  //         url:`/ServicesItems/pages/seconds/useConsultation/index?serviceRecordId=${serviceRecordId}`
  //     });
  // };
  return (
    <View className='component-record-item'>
      <View className='top'>
        <View className='record-item-title flex'>
          <Text className='left'>{serviceInfoName}</Text>
          <View
            className={`right status-${needCheck} ${state ? '' : ''}`}
          ></View>
        </View>
        {/* <View className='address'>预约网点：{address}</View> */}
        <View className='time flex'>
          <View>
            审核时间：
            {checkTime ? utils.timeFormat(checkTime, 'y.m.d h:m') : '-'}
          </View>
          {needCheck === 3
            ? (
            <View className='btn flex' onClick={again}>
              重新提交
            </View>
              )
            : null}
        </View>
      </View>
      <View className={`bottom flex ${needCheck === 2 ? 'none-reason' : ''}`}>
        <View className='reason'>
          <Text>
            {needCheck === 1 ? '工作人员将会尽快与您联系，请耐心等待' : ''}
          </Text>
          {/* <View>{needCheck === 3  ? `失败原因：${failReason}` : ''}</View> */}
          {needCheck === 3
            ? (
            <View className='fail-reason'>
              <View className='reason-title flex'>
                <Text className='left'> 失败原因：</Text>
                <View
                  className='right flex'
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  <Text>{show ? '收起' : '展开'}</Text>
                  <Image
                    src={`${utils.appConfig.ossHost}top_icon.png`}
                    className={`top-icon ${show ? '' : 'hide'}`}
                  ></Image>
                </View>
              </View>
              {show ? <View className='reason-text'>{failReason}</View> : null}
            </View>
              )
            : null}
        </View>
        {needCheck === 2
          ? (
          <View className='btn flex' onClick={goReport}>
            查看报告
          </View>
            )
          : null}
        {/* {
                !state ? <View className="btn-list flex">
                    {needCheck === 2 ? <View className="btn flex btn-in" onClick={goUse}>使用服务</View>: null}

                </View>:  <View className="btn flex" onClick={goReport}>查看报告</View>}   */}
      </View>
    </View>
  );
};
export default RecordItem;
