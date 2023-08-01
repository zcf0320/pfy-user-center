import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View, Image } from '@tarojs/components';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { timeFormat } from '@utils/time';
import './index.scss';

const { ossHost, xAccessToken, H5_URL } = utils.appConfig;

function FamilyRecord (props: {
  healthyFile: any;
  code: string;
  isRecommend: boolean;
  showLogin?: Function;
  flag: boolean;
}) {
  const healthyFile = props.healthyFile || {};
  const { userInfo } = utils.appConfig;
  const [clockFlag, setClockFlag] = useState(false);
  const [value, setValue] = useState('');
  // 更新用户信息
  const user = Taro.getStorageSync(userInfo) || {};
  const token = Taro.getStorageSync(xAccessToken);
  const healthyDetail = (val: string) => {
    if (!token) {
      props.showLogin && props.showLogin();
      return;
    }
    if (!val) {
      Taro.showToast({
        title: '暂未开放，敬请期待',
        icon: 'none'
      });
      return;
    }
    setValue(val);
    setClockFlag(true);
  };

  // 提醒复制链接
  const handClock = () => {
    setClockFlag(false);

    const url = `${H5_URL}pages/webview/index?url=${utils.appConfig.SERVICE_URL}record/recordDetail&code=${value}`;

    Taro.setClipboardData({
      data: url
    });
  };
  return (
    <View className='family-record'>
      {props.code === 'WEIGHT_HEIGHT' && (
        <View
          className={`record-item base ${
            !healthyFile.bmi
              ? 'no-data'
              : healthyFile.bmi &&
                (healthyFile.bmi < 18.5 || healthyFile.bmi > 23.9)
              ? 'active'
              : ''
          } `}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.basicData}
              </View>
              {healthyFile.bmi &&
                (healthyFile.bmi > 23.9 || healthyFile.bmi < 18.5) && (
                  <View>
                    {healthyFile.bmi > 23.9
                      ? (
                      <Image
                        className='health-height'
                        src={`${ossHost}health-height.png`}
                      ></Image>
                        )
                      : (
                      <Image
                        className='health-height'
                        src={`${ossHost}health-low.png`}
                      ></Image>
                        )}
                  </View>
              )}
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap &&
                healthyFile.updateDateMap.WEIGHT_HEIGHT
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.WEIGHT_HEIGHT,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>
          <View className='record-item-center flex-sb'>
            <View className='record-item-center'>
              <View className='record-item-center-text mr'>
                {healthyFile.bmi}
              </View>
              <View className='record-item-center-sub-text'>
                {i18n.chain.healthyRecordsPage.BMI}
              </View>
              {healthyFile.bmi &&
                (healthyFile.bmi > 23.9 || healthyFile.bmi < 18.5) && (
                  <View>
                    {healthyFile.bmi > 23.9
                      ? (
                      <Image
                        className='health-upward'
                        src={`${ossHost}health-upward.png`}
                      ></Image>
                        )
                      : (
                      <Image
                        className='health-down'
                        src={`${ossHost}health-down.png`}
                      ></Image>
                        )}
                  </View>
              )}

              <View className='record-item-center-text ml-16 mr'>
                {healthyFile.height || '-'}
              </View>
              <View className='record-item-center-sub-text mr'>
                {i18n.chain.healthyRecordsPage.height}
              </View>
              <View className='record-item-center-text ml-5 mr'>
                {healthyFile.weight || '-'}
              </View>
              <View className='record-item-center-sub-text'>
                {i18n.chain.healthyRecordsPage.weight}
              </View>
            </View>

            {props.flag !== false
              ? (
              <View
                className=' ml-12 remind-text'
                onClick={() => healthyDetail(props.code)}
              >
                提醒
              </View>
                )
              : null}
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.bmi
                ? 'no-data'
                : healthyFile.bmi &&
                  (healthyFile.bmi < 18.5 || healthyFile.bmi > 23.9)
                ? 'active'
                : ''
            }`}
          >
            {i18n.chain.healthyRecordsPage.basicDataReferenceValue}
          </View>
        </View>
      )}
      {props.code === 'BLOOD_GLUCOSE' && (
        <View
          className={`record-item blood-sugar ${
            !healthyFile.timeQuantum
              ? 'no-data'
              : (healthyFile.timeQuantum &&
                  healthyFile.fastingBloodGlucose &&
                  healthyFile.timeQuantum === '空腹/餐前' &&
                  (healthyFile.fastingBloodGlucose < 3.9 ||
                    healthyFile.fastingBloodGlucose > 6.1)) ||
                (healthyFile.timeQuantum === '餐后2h' &&
                  (healthyFile.fastingBloodGlucose < 3.9 ||
                    healthyFile.fastingBloodGlucose > 7.8))
              ? 'active'
              : ''
          } `}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.bloodSugar}
              </View>
              {(healthyFile.timeQuantum &&
                healthyFile.fastingBloodGlucose &&
                healthyFile.timeQuantum === '空腹/餐前' &&
                (healthyFile.fastingBloodGlucose < 3.9 ||
                  healthyFile.fastingBloodGlucose > 6.1)) ||
              (healthyFile.timeQuantum === '餐后2h' &&
                (healthyFile.fastingBloodGlucose < 3.9 ||
                  healthyFile.fastingBloodGlucose > 7.8))
                ? (
                <View>
                  {(healthyFile.timeQuantum === '空腹/餐前' &&
                    healthyFile.fastingBloodGlucose > 6.1) ||
                  (healthyFile.timeQuantum === '餐后2h' &&
                    healthyFile.fastingBloodGlucose > 7.8)
                    ? (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-height.png`}
                    ></Image>
                      )
                    : (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-low.png`}
                    ></Image>
                      )}
                </View>
                  )
                : null}
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap &&
                healthyFile.updateDateMap.BLOOD_GLUCOSE
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.BLOOD_GLUCOSE,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>

          <View className='record-item-center flex-sb'>
            <View className='record-item-center '>
              <View className='record-item-center-text mr'>
                {healthyFile.fastingBloodGlucose || '-'}
              </View>
              <View className='record-item-center-sub-text'>
                {healthyFile.timeQuantum && `(${healthyFile.timeQuantum})`}
                mmol/L
              </View>
              {(healthyFile.timeQuantum &&
                healthyFile.fastingBloodGlucose &&
                healthyFile.timeQuantum === '空腹/餐前' &&
                (healthyFile.fastingBloodGlucose < 3.9 ||
                  healthyFile.fastingBloodGlucose > 6.1)) ||
              (healthyFile.timeQuantum === '餐后2h' &&
                (healthyFile.fastingBloodGlucose < 3.9 ||
                  healthyFile.fastingBloodGlucose > 7.8))
                ? (
                <View>
                  {(healthyFile.timeQuantum === '空腹/餐前' &&
                    healthyFile.fastingBloodGlucose > 6.1) ||
                  (healthyFile.timeQuantum === '餐后2h' &&
                    healthyFile.fastingBloodGlucose > 7.8)
                    ? (
                    <Image
                      className='health-upward'
                      src={`${ossHost}health-upward.png`}
                    ></Image>
                      )
                    : (
                    <Image
                      className='health-down'
                      src={`${ossHost}health-down.png`}
                    ></Image>
                      )}
                </View>
                  )
                : null}
            </View>
            {props.flag !== false
              ? (
              <View
                className=' ml-12 remind-text'
                onClick={() => healthyDetail(props.code)}
              >
                提醒
              </View>
                )
              : null}
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.timeQuantum
                ? 'no-data'
                : (healthyFile.timeQuantum &&
                    healthyFile.fastingBloodGlucose &&
                    healthyFile.timeQuantum === '空腹/餐前' &&
                    (healthyFile.fastingBloodGlucose < 3.9 ||
                      healthyFile.fastingBloodGlucose > 6.1)) ||
                  (healthyFile.timeQuantum &&
                    healthyFile.timeQuantum === '餐后2h' &&
                    (healthyFile.fastingBloodGlucose < 3.9 ||
                      healthyFile.fastingBloodGlucose > 7.8))
                ? 'active'
                : ''
            }`}
          >
            {i18n.chain.healthyRecordsPage.bloodSugarReferenceValue}
          </View>
        </View>
      )}
      {props.code === 'BLOOD_PRESSURE' && (
        <View
          className={`record-item blood-pressure ${
            !healthyFile.systolicBloodPressure
              ? 'no-data'
              : healthyFile.systolicBloodPressure &&
                (healthyFile.systolicBloodPressure < 90 ||
                  healthyFile.systolicBloodPressure > 140)
              ? 'active'
              : ''
          }`}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.bloodPressure}
              </View>
              {healthyFile.systolicBloodPressure &&
                (healthyFile.systolicBloodPressure < 90 ||
                  healthyFile.systolicBloodPressure > 140) && (
                  <View>
                    {healthyFile.systolicBloodPressure > 140
                      ? (
                      <Image
                        className='health-height'
                        src={`${ossHost}health-height.png`}
                      ></Image>
                        )
                      : (
                      <Image
                        className='health-height'
                        src={`${ossHost}health-low.png`}
                      ></Image>
                        )}
                  </View>
              )}
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap &&
                healthyFile.updateDateMap.BLOOD_PRESSURE
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.BLOOD_PRESSURE,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>
          <View className='record-item-center flex-sb'>
            <View className='record-item-center'>
              <View className='record-item-center-text mr'>
                {healthyFile.systolicBloodPressure || '-'}
              </View>
              <View className='record-item-center-sub-text'>
                {i18n.chain.healthyRecordsPage.systolicPressure}
              </View>
              {healthyFile.systolicBloodPressure &&
                (healthyFile.systolicBloodPressure < 90 ||
                  healthyFile.systolicBloodPressure > 140) && (
                  <View>
                    {healthyFile.systolicBloodPressure > 140
                      ? (
                      <Image
                        className='health-upward'
                        src={`${ossHost}health-upward.png`}
                      ></Image>
                        )
                      : (
                      <Image
                        className='health-down'
                        src={`${ossHost}health-down.png`}
                      ></Image>
                        )}
                  </View>
              )}

              <View className='record-item-center-text ml-7 mr'>
                {healthyFile.diastolicBloodPressure || '-'}
              </View>
              <View className='record-item-center-sub-text'>
                {i18n.chain.healthyRecordsPage.diastolicPressure}
              </View>
            </View>

            {props.flag !== false
              ? (
              <View
                className=' ml-12 remind-text'
                onClick={() => healthyDetail(props.code)}
              >
                提醒
              </View>
                )
              : null}
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.systolicBloodPressure
                ? 'no-data'
                : healthyFile.systolicBloodPressure &&
                  (healthyFile.systolicBloodPressure < 90 ||
                    healthyFile.systolicBloodPressure > 140)
                ? 'active'
                : ''
            }`}
          >
            {i18n.chain.healthyRecordsPage.bloodPressureReferenceValue}
          </View>
        </View>
      )}

      {props.code === 'HEART_RATE' && (
        <View
          className={`record-item heart-rate ${
            !healthyFile.heartRate
              ? 'no-data'
              : healthyFile.heartRate &&
                (healthyFile.heartRate > 100 || healthyFile.heartRate < 60)
              ? 'active'
              : ''
          } `}
          // onClick={() => healthyDetail('心率')}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.heartRate}
              </View>
              {healthyFile.heartRate &&
              (healthyFile.heartRate > 100 || healthyFile.heartRate < 60)
                ? (
                <View>
                  {healthyFile.heartRate > 100
                    ? (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-height.png`}
                    ></Image>
                      )
                    : (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-low.png`}
                    ></Image>
                      )}
                </View>
                  )
                : null}
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap &&
                healthyFile.updateDateMap.HEART_RATE
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.HEART_RATE,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>
          <View className='record-item-center flex-sb'>
            <View className='record-item-center'>
              <View className='record-item-center-text mr'>
                {healthyFile.heartRate || '-'}
              </View>
              <View className='record-item-center-sub-text'>
                {i18n.chain.healthyRecordsPage.bpm}
              </View>
              {healthyFile.heartRate &&
              (healthyFile.heartRate > 100 || healthyFile.heartRate < 60)
                ? (
                <View>
                  {healthyFile.heartRate > 100
                    ? (
                    <Image
                      className='health-upward'
                      src={`${ossHost}health-upward.png`}
                    ></Image>
                      )
                    : (
                    <Image
                      className='health-down'
                      src={`${ossHost}health-down.png`}
                    ></Image>
                      )}
                </View>
                  )
                : null}
            </View>
            {props.flag !== false
              ? (
              <View
                className=' ml-12 remind-text'
                onClick={() => healthyDetail(props.code)}
              >
                提醒
              </View>
                )
              : null}
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.heartRate
                ? 'no-data'
                : healthyFile.heartRate &&
                  (healthyFile.heartRate > 100 || healthyFile.heartRate < 60)
                ? 'active'
                : ''
            }`}
          >
            参考值：60-100 bpm
          </View>
        </View>
      )}
      {user.sex === 0 && props.code === 'PERIOD' && (
        <View
          className={`record-item period ${
            healthyFile.birth === 0 ? 'active' : ''
          }`}
          onClick={() => healthyDetail('')}
        >
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.period}
              </View>
              {healthyFile.birth === 0
                ? (
                <View>
                  {healthyFile.birth === 0
                    ? (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-height.png`}
                    ></Image>
                      )
                    : (
                    <Image
                      className='health-height'
                      src={`${ossHost}health-low.png`}
                    ></Image>
                      )}
                </View>
                  )
                : null}
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap && healthyFile.updateDateMap.PERIOD
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.PERIOD,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>
          {/*
          <View className='record-item-center'>
            <View>{i18n.chain.healthyRecordsPage.distance}</View>
            <View className='record-item-center-text'>1</View>
            <View>{i18n.chain.healthyRecordsPage.day}</View>
          </View>
           <View
            className={`record-item-foot ${
              healthyFile.birth === 0 ? 'active' : ''
            }`}
          >
            {i18n.chain.healthyRecordsPage.estimate}
          </View>
          */}
        </View>
      )}

      {props.code === 'SPORT' && (
        <View
          className={`record-item motion ${
            !healthyFile.allCalorie || !healthyFile.allSportDuration
              ? 'no-data'
              : ''
          } `}
          onClick={() => healthyDetail(props.code)}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.motion}
              </View>
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap && healthyFile.updateDateMap.SPORT
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.SPORT,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>
          <View className='record-item-center'>
            <View className='record-item-center-text mr'>
              {healthyFile.allSportDuration || '-'}
            </View>
            <View className='record-item-center-sub-text'>
              {i18n.chain.healthyRecordsPage.duration}
            </View>
            <View className='record-item-center-text ml-16 mr'>
              {healthyFile.allCalorie || '-'}
            </View>
            <View className='record-item-center-sub-text'>
              {i18n.chain.healthyRecordsPage.energyconsumptionkcal}
            </View>
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.allCalorie || !healthyFile.allSportDuration
                ? 'no-data'
                : ''
            }`}
          >
            参考值：30-60min
          </View>
        </View>
      )}
      {props.code === 'SLEEP' && (
        <View
          className={`record-item sleep ${
            !healthyFile.healthPunchDuration ? 'active' : ''
          }`}
          onClick={() => healthyDetail(props.code)}
        >
          {props.isRecommend && <View className='recommend'></View>}
          <View className='record-item-top flex-between'>
            <View className='flex-box'>
              <View className='record-item-top-left-title'>
                {i18n.chain.healthyRecordsPage.sleep}
              </View>
            </View>
            <View className='flex-box'>
              <View className='record-item-top-right-title'>
                {healthyFile.updateDateMap && healthyFile.updateDateMap.SLEEP
                  ? `更新时间：${timeFormat(
                      healthyFile.updateDateMap.SLEEP,
                      'y-m-d'
                    )}`
                  : '未记录'}
              </View>
              <Image
                className='service-more'
                src={`${ossHost}images/more.png`}
              ></Image>
            </View>
          </View>

          <View className='record-item-center'>
            <View className='record-item-center-text mr'>
              {healthyFile.healthPunchDuration}
            </View>
            <View className='record-item-center-sub-text'>
              {i18n.chain.healthyRecordsPage.sleepDuration}
            </View>
          </View>
          <View
            className={`record-item-foot ${
              !healthyFile.healthPunchDuration ? 'no-data' : ''
            }`}
          >
            {i18n.chain.healthyRecordsPage.sleepReferenceValue}
          </View>
        </View>
      )}
      {clockFlag
        ? (
        <View className='family-mack'>
          <View className='family-mack-content'>
            <Image
              src={`${ossHost}family-cancel.png`}
              className='family-cancel'
              onClick={() => setClockFlag(false)}
            ></Image>
            <View className='family-title'>打卡提醒</View>
            <View className='family-text mb-32'>
              复制以下链接，微信提醒家人健康打卡
            </View>
            <View className='family-text mb-84'>
              https://*******************
            </View>
            <View className='family-btn' onClick={() => handClock()}>
              复制链接邀请家人
            </View>
          </View>
        </View>
          )
        : null}
    </View>
  );
}

export default FamilyRecord;
