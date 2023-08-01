import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import i18n from '@i18n/index';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    item: any;
}

function ManageItem (props: IProps) {
  const statusMap = {
    1: i18n.chain.insurance.underGuarantee,
    2: i18n.chain.user.expired,
    3: i18n.chain.serviceComponent.notEffective,
    4: i18n.chain.insurance.cancelled
  };
  const { policyState, policyNo, insuranceProductName, insuranceType } = props.item || {};
  return (
        <View className='manage-item' onClick={
            () => {
              Taro.navigateTo({ url: `/Insurance/pages/details/index?policyNo=${policyNo}&insuranceType=${insuranceType}` });
            }
        }
        >
            <View className='bottom'>
                <View className='common'>
                <View>{i18n.chain.myServicePage.policyNo}:{policyNo}</View>
               <Image className='qrcode' src={`${ossHost}images/policy-no.png`} onClick={(e) => {
                 e.stopPropagation();
                 Taro.navigateTo({ url: `/StoreManage/IDCode/index?policyNo=${policyNo}` });
               }}
               ></Image>
                </View>
                <View className='company'>{i18n.chain.insurance.insuranceName}——{insuranceProductName}</View>

            </View>
            <View className='top flex'>
                <Text className={`left flex left-${policyState}`}>{statusMap[policyState]}</Text>
                <View className='right flex'>
                    <Text>{i18n.chain.serviceComponent.viewDetails}</Text>
                    <View className='next-weight'></View>
                </View>
            </View>

        </View>
  );
}
export default ManageItem;
