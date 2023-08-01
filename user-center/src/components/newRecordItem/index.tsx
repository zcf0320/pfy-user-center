import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import i18n from '@i18n/index';
import utils from '@utils/index';
import './index.scss';

const RecordItem = (props:any) => {
  const {
    pageCode,
    itemName,
    state,
    comment,
    serviceRecordId,
    reserveTime,
    commentId,
    reserveId,
    address,
    startDate,
    reportId,
    startTime,
    endTime
  } = props.recordDetail || {};
  const type = utils.appConfig.codeMap[pageCode];
  const again = () => {
    const url = `/service/appointment/newCommon/index?serviceRecordId=${serviceRecordId}`;
    Taro.navigateTo({
      url
    });
  };
  const goReport = () => {
    Taro.navigateTo({
      url: `/pages/user/appointment/report/index?reportId=${reportId ||
        ''}&reserveId=${reserveId}`
    });
  };
  const goData = () => {
    Taro.navigateTo({
      url: `/service/result/supplier/index?serviceRecordId=${serviceRecordId}`
    });
  };
  const goEvaluate = () => {
    let url = `/service/evaluate/detail/index?serviceRecordId=${serviceRecordId}`;
    !commentId &&
      (url = `/service/evaluate/index/index?serviceRecordId=${serviceRecordId}&itemName=${itemName}`);
    Taro.navigateTo({
      url
    });
  };
  const goCode = () => {
    Taro.navigateTo({
      url: `/pages/user/appointment/detail/index?reserveId=${reserveId}`
    });
  };
  return (
    <View className='component-record-item'>
      <View className='top' onClick={goCode}>
        <View className='record-item-title flex' >
          <Text className='left'>{itemName}</Text>
          <View className={`right status-${state}`} ></View>
        </View>
        <View className='address'>
          {i18n.chain.recordPage.reservationOutlets}：{address}
        </View>
        {type !== 15
          ? (
          <View className='time'>
            {i18n.chain.recordPage.time}：
            {utils.timeFormat(reserveTime, 'y.m.d h:m')}
          </View>
            )
          : null}
        {type === 15
          ? (
          <View className='time'>
            {i18n.chain.recordPage.time}：{utils.timeFormat(startDate, 'y.m.d')}
            {utils.timeFormat(startTime, ' h:m')}-
            {utils.timeFormat(endTime, ' h:m')}
          </View>
            )
          : null}
      </View>
      <View className='bottom flex'>
        <View className='reason'>
          <Text>{state === 1 ? i18n.chain.recordPage.staffWillContact : ''}</Text>
          <Text>
            {state === 2 ? `${i18n.chain.recordPage.failureReason}：${comment}` : ''}
          </Text>
        </View>
        {!state
          ? (
          <View className='btn-list flex'>
            {type !== 6 && type !== 15
              ? (
              <View className='btn flex btn-in' onClick={goReport}>
                <Text>
                  {reportId
                    ? i18n.chain.recordPage.viewReport
                    : i18n.chain.recordPage.uploadReport}
                </Text>
                {!reportId ? <View className='integral'></View> : null}
              </View>
                )
              : null}
            <View className='btn flex btn-in' onClick={goEvaluate}>
              <Text>
                {commentId
                  ? i18n.chain.recordPage.viewComments
                  : i18n.chain.recordPage.immediateEvaluation}
              </Text>
              {
                // !commentId ? (
                //     <View className='integral'></View>
                // ): null
              }
            </View>

            {type === 15 && (
              <View className='btn flex' onClick={goData}>
                {i18n.chain.recordPage.viewData}
              </View>
            )}
            <View className='btn flex' onClick={goCode}>
              {i18n.chain.recordPage.reservationVoucher}
            </View>
          </View>
            )
          : state === 2
            ? (
          <View className='btn flex' onClick={again}>
            {i18n.chain.recordPage.anotherAppointment}
          </View>
              )
            : null}
      </View>
    </View>
  );
};
export default RecordItem;
