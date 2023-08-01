import Page from '@components/page';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useEffect, useState, useRef } from 'react';
import utils from '@utils/index';
import { getQrCode, getStatus } from '../actions';

import './index.scss';

const { ossHost } = utils.appConfig;

export default function IDCode () {
  const { router } = getCurrentInstance();
  const [itemId, setItemId] = useState('');
  const policyNo = (router?.params && router.params.policyNo) || '';
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const timer: any = useRef(null);
  useEffect(() => {
    if (!itemId) {
      getQrCode(itemId, policyNo)
        .then((res: any) => {
          if (res.itemId) {
            setItemId(res.itemId);
          }
          setQrCodeUrl(res.qrCodeUrl);
        })
        .catch(() => {});
    }
  }, [itemId, policyNo]);

  useEffect(() => {
    timer.current = setInterval(() => {
      getStatus(itemId, policyNo).then((res: any) => {
        if (res === 3) {
          clearInterval(timer.current);
          timer.current = null;

          Taro.navigateTo({
            url: `/StoreManage/WriteOffCode/index?itemId=${itemId}&policyNo=${policyNo}`
          });
        }
      });
    }, 5000);

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [itemId, policyNo]);

  return (
    <Page title='我的身份码' showBack>
      <View id='myCode' className='my-qrcode'>
        <View className='qr-code'>
          <View className='title'>门店药品理赔</View>
          <View className='image-title'>药房现场扫码换药</View>
          <View className='code-image'>
            <Image src={qrCodeUrl}></Image>
          </View>
        </View>

        <View
          className='what-store'
          onClick={() => {
            clearInterval(timer.current);
            timer.current = null;
            Taro.navigateTo({ url: '/StoreManage/StoreDrugClaimInfo/index' });
          }}
        >
          <View className='left'>
            <Image
              className='img'
              src={`${ossHost}images/store-notice.png`}
            ></Image>
            <View>什么是门店药品理赔？</View>
          </View>
          <View className='right'>
            <Image
              className='img'
              src={`${ossHost}images/store-arrow.png`}
            ></Image>
          </View>
        </View>

        <View
          className='store-map'
          onClick={() => {
            clearInterval(timer.current);
            timer.current = null;
            Taro.navigateTo({
              url: '/StoreManage/StoreMapList/index'
            });
          }}
        >
          查看附近药房
        </View>
      </View>
    </Page>
  );
}
