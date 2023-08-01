
import { View, Text, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
function ServiceModal (props: {
    serviceInfoNames: any;
    closeModal: Function;
}) {
  return (
        <View className='service-modal'>
            <View className='modal-content'>
                <View className='modal-title flex'>
                    <Text>增值服务</Text>
                    <Image src={`${ossHost}images/icon_close.png`} className='close' onClick={() => {
                      props.closeModal();
                    }}
                    ></Image>
                </View>
                {
                    props.serviceInfoNames.length && props.serviceInfoNames.map((item) => {
                      return <View key={item} className='service-item flex'>{item}</View>;
                    })
                }

            </View>
        </View>
  );
}
export default ServiceModal;
