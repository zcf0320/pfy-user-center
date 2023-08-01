import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { agreeNotification } from '@actions/common';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  close: () => void;
  agree: () => void;
}
const ProtoModal = (props: IProps) => {
  const goProto = index => {
    Taro.navigateTo({
      url: `/pages/protocal/all/index?index=${index}`
    });
  };
  return (
    <View className='compontent-proto-modal flex'>
      <View className='proto-modal-content'>
        <View className='proto-title'>用户协议及隐私政策</View>
        <View className='proto-text'>
          <Text>
            感谢您信任并使用寰宇关爱！我们依据最新法律法规及监管政策要求，更新了
          </Text>
          <Text className='blod'>
            《隐私权保护声明》、《寰宇关爱用户注册及使用协议》
          </Text>
          <Text>
            ，并根据您使用服务的具体功能对您的个人信息进行收集、使用和共享、转让、公开和保护。
            请您务必仔细阅读并透彻理解相关条款内容，在确认充分理解并同意后使用寰宇关爱相关产品或服务。如您同意
          </Text>
          <Text
            className='color'
            onClick={() => {
              goProto(1);
            }}
          >
            《隐私权保护声明》
          </Text>
          <Text>、</Text>
          {/* <Text className='color' onClick={()=>{goProto(2)}}>《寰宇关爱用户授权使用协议》</Text><Text>、</Text> */}
          <Text
            className='color'
            onClick={() => {
              goProto(2);
            }}
          >
            《寰宇关爱用户注册及使用协议》
          </Text>
          <Text>
            请点击“同意”
            后使用我们的产品和服务，我们依法尽全力保护您的个人信息。
          </Text>
        </View>
        <View className='agree-list flex'>
          <View
            className='agree-btn flex'
            onClick={() => {
              props.close();
              const { userInfo, xAccessToken } = utils.appConfig;
              Taro.removeStorageSync(userInfo);
              Taro.removeStorageSync(xAccessToken);
            }}
          >
            不同意
          </View>
          <View
            className='agree-btn flex active'
            onClick={() => {
              agreeNotification().then(() => {
                props.agree();
                props.close();
              });
            }}
          >
            同意
          </View>
        </View>
      </View>
    </View>
  );
};
export default ProtoModal;
