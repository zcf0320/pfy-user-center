import Taro, { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { getClaimsInfo } from '@api/claims';
import './index.scss';

export default function MoreInfo () {
  const { router } = getCurrentInstance();
  const type = (router?.params && router.params.type) || '1';
  const [claimInfo, setClaimInfo] = useState({
    settlementClassifyVO: {} as any
  });
  useEffect(() => {
    const claimRecordId = (router?.params && router.params.claimRecordId) || '';

    if (type === '1') {
      Taro.setNavigationBarTitle({
        title: '处方单药品'
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '检验检查单'
      });
    }
    if (claimRecordId) {
      getClaimsInfo(claimRecordId)
        .then((res: any) => {
          setClaimInfo(res);
        })
        .catch(() => {});
    }
  }, [router?.params, type]);
  return (
    <Page showBack title='处方单药品'>
      <View className='more-info'>
        {
          type === '1'
            ? claimInfo.settlementClassifyVO &&
            claimInfo.settlementClassifyVO.drugsList &&
            claimInfo.settlementClassifyVO.drugsList.length &&
            claimInfo.settlementClassifyVO.drugsList.map(item => {
              return (
                <View key={Math.random()} className='card'>
                  <View className='card-item'>
                    <View className='left'>药品名称</View>
                    <View className='right'>{item.name || '-'}</View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品规格</View>
                    <View className='right'>{item.specifications || '-'}</View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品单价(元)</View>
                    <View className='right'>{item.unitPrice || '-'}</View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品数量</View>
                    <View className='right'>{item.num || '-'}</View>
                  </View>
                </View>
              );
            })
            : claimInfo.settlementClassifyVO &&
            claimInfo.settlementClassifyVO.checkList &&
            claimInfo.settlementClassifyVO.checkList.length &&
            claimInfo.settlementClassifyVO.checkList.map(item => {
              return (
                <View key={Math.random()} className='card'>
                  <View className='card-item'>
                    <View className='left'>项目名称</View>
                    <View className='right'>{item.checkName || '-'}</View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品单价(元)</View>
                    <View className='right'>{item.checkUnitPrice || '-'}</View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品数量</View>
                    <View className='right'>{item.checkNum || '-'}</View>
                  </View>
                </View>
              );
            })}
      </View>
    </Page>
  );
}
