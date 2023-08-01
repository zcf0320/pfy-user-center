import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import Page from '@components/page';
import { connect } from 'react-redux';
import { GET_LIST } from '@constants/medicationReminder';
import { SET_MODAL } from '@constants/common';
import { getList, removePlan } from '@actions/medicationReminder';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  list: Array<any>;
  getList: Function;
  setModal: Function;
}
@connect(
  state => Object.assign({}, state.medicationReminder),
  dispatch => ({
    getList (data) {
      dispatch({
        type: GET_LIST,
        payload: data
      });
    },
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class PlanDetail extends Component<IProps> {
  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.medicationReminder.medicationPlanDetail });
    getList().then(res => {
      this.props.getList(res);
    });
  }

  render () {
    const { router } = getCurrentInstance();
    const {
      medicationDetailList,
      daysNumber,
      planId,
      startDate,
      reminderTime,
      source
    } = this.props.list[Number(router?.params && router.params.index)];
    return (
      <Page showBack title={i18n.chain.medicationReminder.medicationPlanDetail}>
        <View className='page-plan-detail flex'>
          <View
            className='del-plan flex'
            onClick={() => {
              this.props.setModal({
                show: true,
                content: i18n.chain.common.confirmDeletion,
                cancelText: i18n.chain.button.confirm,
                confirmText: i18n.chain.button.cancel,
                clickCancel: () => {
                  removePlan({ planId }).then(() => {
                    Taro.navigateBack({
                      delta: 1
                    });
                  });
                }
              });
            }}
          >
            {i18n.chain.medicationReminder.deletePlan}
          </View>
          <View
            className='add-plan flex'
            onClick={() => {
              Taro.navigateTo({
                url: `/MedicationReminder/pages/editPlan/index?planId=${planId}&index=${router?.params && router.params.index}`
              });
            }}
          >
            {i18n.chain.medicationReminder.modifyPlan}
          </View>
          <View className='item'>
            <View className='item-title flex'>
              <View className='icon-1'></View>
              <Text>{i18n.chain.medicationReminder.whatMedicine}</Text>
            </View>
            {medicationDetailList && medicationDetailList.length && medicationDetailList.map(item => {
              return (
                <View className='list' key={item}>
                  <View className='item-content flex m-t-32'>
                    <Text>{i18n.chain.medicationReminder.drugName}</Text>
                    <Text>{item.medicineName}</Text>
                  </View>
                  <View className='item-content flex'>
                    <Text>{i18n.chain.medicationReminder.singleDosage}</Text>
                    <Text>
                      {item.singleAmount}
                      {item.dosageUnit}
                      <Text className='every'>{item.medicationFrequency}</Text>
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View className='line'></View>
          <View className='item'>
            <View className='item-title flex'>
              <View className='icon-1 icon-2'></View>
              <Text>{i18n.chain.medicationReminder.whenMedicine}</Text>
            </View>
            <View className='item-content flex m-t-32'>
              <Text>{i18n.chain.medicationReminder.medicationDays}</Text>
              <Text>{daysNumber}{i18n.chain.user.day}</Text>
            </View>
            <View className='item-content flex m-b-0'>
              <Text>{i18n.chain.medicationReminder.startMedicationTime}</Text>
              <Text>{utils.timeFormat(startDate, 'y.m.d')}</Text>
            </View>
            <View className='item-content flex'>
              <View className='text'>{i18n.chain.medicationReminder.medicationReminder}</View>
              <View className='time-list flex'>
                {reminderTime.map(item => {
                  return (
                    <Text className='time-item' key={item}>
                      {utils.timeFormat(item, ' h:m')}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
          <View className='line'></View>
          <View className='item'>
            <View className='item-title flex'>
              <View className='icon-1 icon-3'></View>
              <Text>{i18n.chain.medicationReminder.remark}</Text>
            </View>
            <View className='item-content flex m-t-32'>
              <Text>
                {i18n.chain.medicationReminder.planSource}<Text className='custom'>{source}</Text>
              </Text>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default PlanDetail;
