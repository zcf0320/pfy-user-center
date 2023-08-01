import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { getAppointment } from '@actions/user';
import { getCouponCode } from '@actions/service';
import { GET_APPOINTMENT_INFO } from '@constants/user';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';

import './index.scss';

const { ossHost } = utils.appConfig;
const statusText = [
  {
    icon: `${ossHost}images/appointment-success-icon.png`,
    title: '预约成功',
    desc: '感谢您的预约，请去门店兑换'
  },
  {
    icon: `${ossHost}images/appointment-reviewed-icon.png`,
    title: '待审核',
    desc: '订单正在审核，请耐心等待'
  },
  {
    icon: `${ossHost}images/appointment-fail-icon.png`,
    title: '预约失败',
    desc: '很抱歉您的预约失败，请核对信息后预约'
  }
];
interface IProps {
  getAppointment: Function;
  getCouponCode: Function;
  appointmentInfo: {
    username: string;
    sex: number;
    mobile: string;
    idCard: string;
    itemName: string;
    address: string;
    reserveTime: number;
    state: number;
    reserveId: string;
    reportId: string;
    url: string;
    urlCode: string;
    city: string;
    validTime: number;
    policyHolderName: string;
    policyHolderIdCard: string;
    insuredAge: string;
    insuredName: string;
    pageCode: string;
    bedNumber: string;
    endDate: number;
    startDate: number;
    startTime: number;
    endTime: number;
    comeCity: number;
    clinicHospital: number;
    clinicDepartment: number;
    illnessState: number;
    reimbursementWay: number;
    hostipalDocuments: number;
    customerAddress: number;
    age: number;
    serviceSitePhone: string;
    serviceSiteName: string;
  };
}
interface IState {
  isDc: boolean;
}
@connect(
  state => state.user,
  dispatch => ({
    getAppointment (params) {
      getAppointment(params).then(res => {
        dispatch({
          type: GET_APPOINTMENT_INFO,
          payload: res
        });
      });
    },
    getCouponCode (params) {
      getCouponCode(params).then(res => {
        dispatch({
          type: GET_APPOINTMENT_INFO,
          payload: res
        });
      });
    }
  })
)
class Detail extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      isDc: false
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: i18n.chain.appointment.appointmentSuccess
    });
    const { isDc } = utils.appConfig;
    const dc = Taro.getStorageSync(isDc);
    this.setState({
      isDc: dc
    });
    this.getInfo();
  }

  // 获取预约信息
  getInfo () {
    const { router } = getCurrentInstance();
    const { reserveId, recordId } = (router?.params && router.params) || {};
    reserveId &&
      this.props.getAppointment({
        id: reserveId
      });
    recordId &&
      this.props.getCouponCode({
        recordId
      });
  }

  goIndex () {
    const { isH5 } = utils.appConfig;
    if (this.state.isDc || isH5) {
      Taro.reLaunch({
        url: '/pages/user/index/index'
      });
    }
  }

  render () {
    const {
      username,
      sex,
      mobile,
      idCard,
      itemName,
      address,
      age,
      reserveTime,
      validTime,
      url,
      urlCode,
      city,
      comeCity,
      serviceSitePhone,
      serviceSiteName,
      pageCode,
      bedNumber,
      startDate,
      startTime,
      endDate,
      endTime,
      clinicHospital,
      clinicDepartment,
      illnessState,
      reimbursementWay,
      hostipalDocuments,
      customerAddress,
      state = 0
    } = this.props.appointmentInfo;
    const { router } = getCurrentInstance();
    const { recordId, reserveId } = (router?.params && router.params) || {};
    const type = utils.appConfig.codeMap[pageCode];
    return (
      <Page showBack title={i18n.chain.appointment.appointmentSuccess}>
        <View className='page-detail'>
          <View className={`header-status status-${state}`}>
            <View className='status-text'>
              <Image className='icon' src={statusText[state].icon}></Image>
              <View>
                <View className='title'>{statusText[state].title}</View>
                <View className='desc'>{statusText[state].desc}</View>
              </View>
            </View>
            {reserveId && (
              <View className='top'>
              <View className='qr-code'>
              <Image className='qr-code' src={url}></Image>
              </View>

                {urlCode ? <View className='url-code'>{urlCode}</View> : null}
              </View>
            )}
            <View className='top'>
              <View className='top-title flex'>
                {i18n.chain.appointment.information}
              </View>
              <View className='info-item flex no-border'>
                <Text>{i18n.chain.appointment.name}</Text>
                <Text>{username || ''}</Text>
              </View>
              {sex !== null
                ? (
                <View className='info-item flex'>
                  <Text>{i18n.chain.appointment.sex}</Text>
                  <Text>
                    {sex
                      ? i18n.chain.appointment.male
                      : i18n.chain.appointment.female}
                  </Text>
                </View>
                  )
                : null}
              {age
                ? (
                <View className='info-item flex'>
                  <Text>{i18n.chain.appointment.age}</Text>
                  <Text>{age || ''}</Text>
                </View>
                  )
                : null}
              {mobile
                ? (
                <View className='info-item flex'>
                  <Text>{i18n.chain.appointment.mobile}</Text>
                  <Text>{mobile || ''}</Text>
                </View>
                  )
                : null}

              {idCard
                ? (
                <View className='info-item flex'>
                  <Text>{i18n.chain.appointment.idCard}</Text>
                  <Text>{idCard || ''}</Text>
                </View>
                  )
                : null}
            </View>
            <View className={`top center ${reserveId ? '' : 'no-img'}`}>
              <View className='top-content'>
                <View className='top-title flex'>
                  {i18n.chain.appointment.serviceCertificate}
                </View>
              </View>
              {!reserveId ? <View className='no-img'></View> : null}
              {recordId
                ? (
                <View className='center-container'>
                  <View className='info-title'>
                    {i18n.chain.appointment.serviceInfo}
                  </View>
                  {urlCode
                    ? (
                    <View className='info-item flex no-border'>
                      <View className='label'>
                        {i18n.chain.appointment.couponCode}
                      </View>
                      <Text>{urlCode}</Text>
                    </View>
                      )
                    : null}
                  <View className='info-item flex'>
                    <View className='label'>
                      {i18n.chain.appointment.service}
                    </View>
                    <Text>{itemName}</Text>
                  </View>
                  {validTime
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.validUntil}
                      </View>
                      <Text>{utils.timeFormat(validTime, 'y/m/d')} 23:59</Text>
                    </View>
                      )
                    : null}
                </View>
                  )
                : (
                <View className='center-container'>
                  <View className='info-title'>
                    {i18n.chain.appointment.information}
                  </View>
                  <View className='info-item flex no-border'>
                    <View className='label'>
                      {i18n.chain.appointment.appointmentService}
                    </View>
                    <Text>{itemName}</Text>
                  </View>
                  {city
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.area}
                      </View>
                      <Text>{city}</Text>
                    </View>
                      )
                    : null}
                  {address
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.siteAddress}
                      </View>
                      <Text className='address'>{address}</Text>
                    </View>
                      )
                    : null}

                  {serviceSiteName
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.siteName}
                      </View>
                      <Text className='address'>{serviceSiteName}</Text>
                    </View>
                      )
                    : null}
                  {serviceSitePhone
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.siteMobile}
                      </View>
                      <Text className='address'>{serviceSitePhone}</Text>
                    </View>
                      )
                    : null}
                  {clinicHospital
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.clinicHospital}
                      </View>
                      <Text className='address'>{clinicHospital}</Text>
                    </View>
                      )
                    : null}
                  {clinicDepartment
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.clinicDepartment}
                      </View>
                      <Text className='address'>{clinicDepartment}</Text>
                    </View>
                      )
                    : null}
                  {illnessState
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.illnessState}
                      </View>
                      <Text className='address'>{illnessState}</Text>
                    </View>
                      )
                    : null}
                  {hostipalDocuments
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.hospitalDocuments}
                      </View>
                      <Text className='address'>{hostipalDocuments}</Text>
                    </View>
                      )
                    : null}
                  {reimbursementWay
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.reimbursementWay}
                      </View>
                      <Text className='address'>{reimbursementWay}</Text>
                    </View>
                      )
                    : null}
                  {comeCity
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.homeCity}
                      </View>
                      <Text className='address'>{comeCity}</Text>
                    </View>
                      )
                    : null}
                  {customerAddress
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.customerLocation}
                      </View>
                      <Text className='address'>{customerAddress}</Text>
                    </View>
                      )
                    : null}

                  {type === 15 && (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.bedNum}
                      </View>
                      <Text>{bedNumber || '-'}</Text>
                    </View>
                  )}
                  {type === 15
                    ? (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.appointment}
                      </View>
                      <Text className='text'>
                        {startDate ? utils.timeFormat(startDate, 'y.m.d') : '-'}
                        -{endDate ? utils.timeFormat(endDate, 'y.m.d') : '-'}
                        {startTime ? utils.timeFormat(startTime, ' h:m') : '-'}-
                        {endTime ? utils.timeFormat(endTime, ' h:m') : '-'}
                      </Text>
                    </View>
                      )
                    : (
                    <View className='info-item flex'>
                      <View className='label'>
                        {i18n.chain.appointment.appointment}
                      </View>
                      <Text>
                        {reserveTime
                          ? utils.timeFormat(reserveTime, 'y/m/d h:m')
                          : '-'}
                      </Text>
                    </View>
                      )}
                </View>
                  )}
            </View>
            {
              /*
            <View className='confirm flex' onClick={this.goIndex.bind(this)}>
              {i18n.chain.button.confirm}
            </View>
            */
          }
          </View>
        </View>
      </Page>
    );
  }
}
export default Detail;
