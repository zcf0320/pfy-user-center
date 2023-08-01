import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import i18n from '@i18n/index';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

function OrderItem (props:any) {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]as any);
  const {
    aiConclusions,
    patientDisease,
    createTime,
    serviceRecordId,
    selectisease,
    type,
    recordId,
    diseaseId,
    patientHospitalDepartment
  } = props.item;
  useEffect(() => {
    if (type === 2) {
      diseaseId &&
        setList([
          {
            diseaseName: patientDisease,
            diseaseId: diseaseId,
            hospitalDepartment: patientHospitalDepartment
          }
        ]);
    } else {
      setList(aiConclusions || []);
    }
  }, [
    aiConclusions,
    diseaseId,
    patientDisease,
    patientHospitalDepartment,
    type
  ]);
  return (
    <View className='component-order-item-new'>
      <View className='top '>
        <View className='order-title'>
          {type === 1 ? selectisease : '人工问诊'}
        </View>
        <View className='time'>
          问诊时间：{utils.timeFormat(createTime, 'y-m-d h:m')}
        </View>
        {show
          ? (
          <View
            className='hide'
            onClick={() => {
              setShow(false);
            }}
          ></View>
            )
          : null}
      </View>
      {!show
        ? (
        <View
          className='bottom flex'
          onClick={() => {
            if (list.length) {
              setShow(true);
            }
          }}
        >
          <Text>{list.length ? i18n.chain.serviceComponent.viewDetails : i18n.chain.aiConsulation.noDetails}</Text>
          {list.length ? <View className='show'></View> : null}
        </View>
          )
        : null}
      {show
        ? (
        <View className='ai-conclusion'>
          <View className='ai-title'>{i18n.chain.aiConsulation.possibleDiseases}</View>
          <View className='ai-sub-title'>
            {i18n.chain.aiConsulation.resultTips}
          </View>
          {list.length &&
            list.map((item, index) => {
              return index < 3
                ? (
                <View
                  className='ai-item'
                  key={item.id}
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/Inquire/pages/detail/index?diseaseId=${item.diseaseId}&recordId=${recordId}&serviceRecordId=${serviceRecordId}`
                    });
                  }}
                >
                  <View className='ai-item-top flex'>
                    <View className='top-left flex'>
                      <View className='name'>{item.diseaseName}</View>
                      {item.probability
                        ? (
                        <View className='number'>{item.probability}%</View>
                          )
                        : null}
                    </View>
                    <View className='top-right flex'>
                      <Text>{i18n.chain.button.detail}</Text>
                      <View className='next'></View>
                    </View>
                  </View>
                  <Text>{item.hospitalDepartment}</Text>
                </View>
                  )
                : null;
            })}
        </View>
          )
        : null}
    </View>
  );
}
export default OrderItem;
