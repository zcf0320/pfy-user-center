import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  type?: number;
  item: {
    createTime: number;
    diseaseId: string;
    patientDisease: string;
    patientHospitalDepartment: string;
    recordId: string;
    selectisease: string;
    type: number;
    serviceRecordId: string;
  };
}
const typeList = {
  1: '智能问诊',
  2: '人工问诊',
  3: '电话问诊'
};
function OrderItem (props: IProps) {
  const {
    createTime,
    patientDisease,
    patientHospitalDepartment,
    diseaseId,
    type,
    recordId,
    serviceRecordId
  } = props.item || {};
  return (
    <View
      className='component-order-item flex'
      onClick={() => {
        if (diseaseId) {
          Taro.navigateTo({
            url: `/Inquire/pages/detail/index?diseaseId=${diseaseId}&serviceRecordId=${serviceRecordId}&recordId=${recordId}`
          });
        }
      }}
    >
      <View className='top flex'>
        <View className='left'>{typeList[type]}</View>
        {/* <View className="right">推荐科室：{patientHospitalDepartment || '暂无'}</View> */}
      </View>
      <View className='center flex'>
        <View className='left'>{patientDisease || '暂无'}</View>
        <View className='right flex'>
          {props.type ? '疾病介绍' : '查看详情'}
        </View>
      </View>
      <View className='bottom flex'>
        <View className='left'>
          推荐科室：{patientHospitalDepartment || '暂无'}
        </View>
        <View className='right'>
          {utils.timeFormat(createTime, 'y.m.d h:m')}
        </View>
      </View>
    </View>
  );
}
export default OrderItem;
