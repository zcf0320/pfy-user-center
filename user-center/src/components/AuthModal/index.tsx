import { View, Image } from '@tarojs/components';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  onCancel: Function;
  onConfirm: Function;
}

const AuthModal = (props: IProps) => {
  return (
    <View className='auth-modal'>
      <View className='auth-modal-content'>
        <View className='auth-modal-content-title'>{i18n.chain.userInfo.verifyInformation}</View>
        <View className='auth-modal-content-subtitle'>
          {i18n.chain.userInfo.receiveService}
        </View>
        <View className='auth-modal-content-center'>
          <Image
            className='auth-modal-content-center-image'
            src={`${ossHost}auth-bg.png`}
          ></Image>
        </View>
        <View className='auth-modal-content-bottom'>
          <View
            className='auth-modal-content-bottom-cancel'
            onClick={() => {
              props.onCancel();
            }}
          >
            {i18n.chain.button.forgoAnOpportunity}
          </View>
          <View
            className='auth-modal-content-bottom-confirm'
            onClick={() => {
              props.onConfirm();
            }}
          >
            {i18n.chain.button.claimAndReceive}
          </View>
        </View>
      </View>
    </View>
  );
};
export default AuthModal;
