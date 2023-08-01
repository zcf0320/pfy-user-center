import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

function VirtualItem (props: any) {
  const { itemName, commentId, pageCode, createTime } = props.item || {};
  const goResult = () => {
    const { resultId, score } = props.item;
    const type = utils.appConfig.codeMap[pageCode];
    let url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newResult&code=${pageCode}&score=${score}`;
    type === 5 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}healthyHeight/result&resultId=${resultId}&code=${pageCode}`);
    type === 23 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/depressed/result&resultId=${resultId}&code=${pageCode}`);
    type === 24 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/anxious/result&resultId=${resultId}&code=${pageCode}`);
    Taro.navigateTo({
      url
    });
  };
  const goEvaluate = () => {
    const { serviceRecordId } = props.item;
    let url = `/service/evaluate/detail/index?serviceRecordId=${serviceRecordId}`;
    !commentId &&
      (url = `/service/evaluate/index/index?serviceRecordId=${serviceRecordId}&itemName=${itemName}`);
    Taro.navigateTo({
      url
    });
  };
  const goCode = () => {
    const { recordId } = props.item;
    Taro.navigateTo({
      url: `/pages/user/appointment/detail/index?recordId=${recordId}`
    });
  };
  return (
    <View className='online-item'>
      <View className='top'>
        <View className='name'>{itemName}</View>
        <View className='time'>
          服务时间：{utils.timeFormat(createTime, 'y/m/d h:m')}
        </View>
      </View>
      <View className='bottom'>
        <View className='actions flex'>
          <View
            className='action-item white flex'
            onClick={() => {
              goEvaluate();
            }}
          >
            <Text>{commentId ? '查看评价' : '立即评价'}</Text>
            {!commentId ? <View className='integral'></View> : null}
          </View>

          {utils.appConfig.codeMap[pageCode] === 8
            ? (
            <View
              className='action-item flex'
              onClick={() => {
                goCode();
              }}
            >
              查看券码
            </View>
              )
            : (
            <View
              className='action-item flex'
              onClick={() => {
                goResult();
              }}
            >
              查看报告
            </View>
              )}
        </View>
      </View>
    </View>
  );
}
export default VirtualItem;
