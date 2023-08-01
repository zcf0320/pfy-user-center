import Taro, { getCurrentInstance } from '@tarojs/taro';
import { PureComponent } from 'react';
import { View } from '@tarojs/components';
import Page from '@components/page';
import { getProtocol } from '@actions/claimsSettle';
import './index.scss';

class Process extends PureComponent {
  next = () => {
    const { router } = getCurrentInstance();
    const serviceInfoId = (router?.params && router.params.serviceInfoId) || '';
    const insuranceProductId = (router?.params && router.params.insuranceProductId) || '';
    const serviceRecordId = (router?.params && router.params.serviceRecordId) || '';
    const rightsId = (router?.params && router.params.rightsId) || '';
    const insurancePlanId = (router?.params && router.params.insurancePlanId) || '';
    const policyNo = (router?.params && router.params.policyNo) || '';
    getProtocol({
      serviceInfoId,
      insuranceProductId,
      rightId: rightsId
    }).then((res: any) => {
      Taro.navigateTo({
        url: res.protocolType
          ? `/ClaimsSettle/pages/proto/index?serviceRecordId=${serviceRecordId}&serviceInfoId=${serviceInfoId}&insuranceProductId=${insuranceProductId}&rightsId=${rightsId}&insurancePlanId=${insurancePlanId}&policyNo=${policyNo}`
          : `/ClaimsSettle/pages/step/index?serviceRecordId=${serviceRecordId}&insuranceProductId=${insuranceProductId}&rightsId=${rightsId}`
      });
    });
  };

  render () {
    const { router } = getCurrentInstance();
    const itemName = decodeURI(
      (router?.params && router.params.itemName) || ''
    );
    return (
      <Page title='理赔服务' showBack>
        <View className='page-process'>
          <View className='process-title'>{itemName}服务需要审核后使用</View>
          <View className='process-tips flex'>
            <View className='left'></View>
            <View className='right'>使用说明</View>
          </View>
          <View className='text-content flex'>
            <View className='dot'></View>
            <View className='text'>
              {itemName}
              服务为需要审核的理赔服务，您提交理赔材料后的3个工作日内及时为您审核，审核成功后即可使用本项服务。
            </View>
          </View>
          <View className='text-content flex'>
            <View className='dot'></View>
            <View className='text'>
              如您的材料错误导致审核失败，可审新提交，本次不扣减您的权益次数。
            </View>
          </View>
          <View className='process-tips flex'>
            <View className='left'></View>
            <View className='right'>使用流程</View>
          </View>
          <View className='process-bg'></View>
          <View className='bottom flex' onClick={this.next}>
            开始使用
          </View>
        </View>
      </Page>
    );
  }
}
export default Process;
