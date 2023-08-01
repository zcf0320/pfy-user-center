import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import { readMessage } from '@actions/user';
import i18n from '@i18n/index';
import './index.scss';

// 路由白名单
const routerUrl = ['/pages/user/index/index', '/pages/mall/index/index', '/Healthy/pages/index', '/pages/user/setting/index/index'];
const MessageItem = (props: { item: any; read: (arg0: any) => void; index: any; }) => {
  const {
    createTime,
    detailsLink,
    expirationTime,
    mainTitle,
    moduleId,
    id,
    state,
    subTitle
  } = props.item || {};
  return (
    <View className='message-item flex'>
      <View className='time flex'>
        {utils.timeFormat(createTime, 'y-m-d h:m:s')}
      </View>
      <View className='message-item-content'>
        <View className='message-item-top'>
          <View className='top-top flex'>
            <View className={`icon icon-${moduleId}`}>
              {!state ? <View className='dot'></View> : null}
            </View>
            <Text>{mainTitle}</Text>
          </View>
          <View className={`top-center ${expirationTime ? '' : 'no-bottom'}`}>
            {subTitle}
          </View>
          {expirationTime
            ? (
            <View className='top-bottom'>
              {i18n.chain.userMessage.validDate}{utils.timeFormat(expirationTime, 'y-m-d')}
            </View>
              )
            : null}
        </View>
        <View
          className='message-item-bottom flex'
          onClick={() => {
            if (!state) {
              readMessage({
                messageId: id
              }).then(() => {
                props.read(props.index);
              });
            }
            if (routerUrl.indexOf(detailsLink) !== -1) {
              Taro.switchTab({ url: detailsLink });
            } else {
              Taro.navigateTo({ url: detailsLink });
            }
          }}
        >
          <View className='bottom-content flex'>
            <Text>{i18n.chain.userMessage.detail}</Text>
            <View className='next'></View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default MessageItem;
