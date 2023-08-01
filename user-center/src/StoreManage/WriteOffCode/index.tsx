import Page from '@components/page';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useEffect, useState } from 'react';
import utils from '@utils/index';
import { getWriteOffCodeList, getStatus, reset } from '../actions';

import './index.scss';

const { ossHost } = utils.appConfig;
export default function WriteOffCode () {
  const { router } = getCurrentInstance();
  const itemId = (router?.params && router.params.itemId) || '';
  const policyNo = (router?.params && router.params.policyNo) || '';

  const [status, setStatus] = useState(-1);
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [order, setOrder] = useState([] as any);
  const [medicineInfos, setMedicineInfos] = useState([] as any);
  const [moreMedicineInfos, setMoreMedicineInfos] = useState([] as any);

  useEffect(() => {
    getWriteOffCodeList(itemId, policyNo)
      .then((res: any) => {
        if (!res.length) {
          Taro.showToast({ title: '已过期，请重新扫码' });
          Taro.navigateBack();
        }
        setOrder(res);

        if (res[index].medicineInfos && res[index].medicineInfos.length > 2) {
          setShowMore(true);
          setMedicineInfos(res[index].medicineInfos.slice(0, 2));
          setMoreMedicineInfos(
            res[index].medicineInfos.slice(2, res[index].medicineInfos.length)
          );
        } else {
          setMedicineInfos(
            res[index].medicineInfos.slice(0, res[index].medicineInfos.length)
          );
        }
      })
      .catch(() => {});
  }, [index, itemId, policyNo]);

  useEffect(() => {
    const timer = setInterval(() => {
      getStatus(itemId, policyNo).then((res: any) => {
        if (res === 4) {
          clearInterval(timer);
          Taro.redirectTo({
            url: '/StoreManage/ClaimSuccess/index'
          });
        }
        setStatus(res);
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [itemId, policyNo]);
  const next = () => {
    if (index === order.length - 1) {
      setIndex(0);
      if (order[0].medicineInfos.length > 2) {
        setShowMore(true);
        setMedicineInfos(order[0].medicineInfos.slice(0, 2));
        setMoreMedicineInfos(
          order[0].medicineInfos.slice(2, order[0].medicineInfos.length)
        );
      } else {
        setShowMore(false);
        setMedicineInfos(
          order[0].medicineInfos.slice(0, order[0].medicineInfos.length)
        );
      }

      return;
    }
    const val = index + 1;
    if (order[val].medicineInfos.length > 2) {
      setShowMore(true);
      setMedicineInfos(order[val].medicineInfos.slice(0, 2));
      setMoreMedicineInfos(
        order[val].medicineInfos.slice(2, order[val].medicineInfos.length)
      );
    } else {
      setShowMore(false);
      setMedicineInfos(
        order[val].medicineInfos.slice(0, order[val].medicineInfos.length)
      );
    }

    setIndex(val);
  };
  const showMoreList = () => {
    const data = medicineInfos.concat(moreMedicineInfos);
    setMedicineInfos([...data]);
    setShowMore(false);
  };
  const handleReset = () => {
    reset(order[index].serviceRecordId).then(() => {
      Taro.redirectTo({
        url: '/StoreManage/IDCode/index'
      });
    });
  };
  return (
    <Page title='我的身份码' showBack>
      <View className='write-off-code-page'>
        <View className='write-off-code-wrap'>
          <View className='write-off-code'>
            <View className='title'>我的核销码</View>

            {order.length > 0
              ? (
              <View className='code-list'>
                <View className='code-item'>{order[index].code}</View>
                {order.length > 1 && (
                  <View
                    className='more'
                    onClick={() => {
                      next();
                    }}
                  >
                    <Image src={`${ossHost}images/next-code.png`}></Image>
                  </View>
                )}
              </View>
                )
              : null}
          </View>
          <View className='drug-info'>
            <View className='title'>理赔信息</View>
            {order.length > 0
              ? (
              <View className='policy-info'>
                <View className='flex-item'>
                  <View className='left'>{order[index].productName}</View>
                  <View className='right'>{order[index].policyNo}</View>
                </View>
                <View className='flex-item'>
                  <View className='left'>{order[index].serviceInfoName}</View>
                  <View className='right'>{order[index].residueTime}</View>
                </View>
              </View>
                )
              : null}
            <View className='title'>理赔药品</View>
            <View className='drug-list'>
              {(medicineInfos.length > 0 || medicineInfos.length <= 2) &&
                medicineInfos.map(item => {
                  return (
                    <View className='drug-item' key={item.productId}>
                      <Image className='img' src={item.headPics}></Image>
                      <View className='right'>
                        <View className='name'>{item.name}</View>
                        <View className='sub-name'>{item.manufacturer}</View>
                        <View className='sub-name'>规格：{item.standard}</View>
                      </View>
                    </View>
                  );
                })}
              {showMore && (
                <View
                  className='more'
                  onClick={() => {
                    showMoreList();
                  }}
                >
                  查看更多<Image className='more-icon' src={`${ossHost}images/more-down.png`}></Image>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          className='what-store'
          onClick={() => {
            Taro.navigateTo({ url: '/StoreManage/StoreDrugClaimInfo/index' });
          }}
        >
          <View className='left'>
            <Image className='img' src={`${ossHost}images/store-notice.png`}></Image>
            <View>什么是门店药品理赔？</View>
          </View>
          <View className='right'>
            <Image className='img' src={`${ossHost}images/store-arrow.png`}></Image>
          </View>
        </View>

        {status === 3 && (
          <View
            className='claim-again'
            onClick={() => {
              handleReset();
            }}
          >
            重新理赔
          </View>
        )}
      </View>
    </Page>
  );
}
