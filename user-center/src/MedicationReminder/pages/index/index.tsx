import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import dayjs from 'dayjs';
import { getTimeList, read } from '@actions/medicationReminder';
import Page from '@components/page';
import DatePicker from '../../component/DatePicker';
import './index.scss';

interface IState {
  time: number;
  list: Array<any>;
}
class Medication extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: [],
      time: dayjs()
        .startOf('day')
        .valueOf()
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: i18n.chain.medicationReminder.medicationReminder
    });
    this.getList();
  }

  getList (val?: number) {
    getTimeList({
      date:
        val ||
        dayjs()
          .startOf('day')
          .valueOf()
    }).then((res: any) => {
      this.setState({
        list: res
      });
    });
  }

  render () {
    const { list, time } = this.state;
    return (
      <Page showBack title={i18n.chain.medicationReminder.medicationReminder}>
        <View className='page-medication flex'>
          <View className='medicatuin-bg flex'>
            <View className='left flex'>
              <Text>{i18n.chain.medicationReminder.todayReminder}</Text>
              <View className='left-title'>
                {i18n.chain.medicationReminder.takeMedication}
              </View>
            </View>
            <View
              className='right flex'
              onClick={() => {
                Taro.navigateTo({
                  url: '/MedicationReminder/pages/plan/index'
                });
              }}
            >
              <Text>{i18n.chain.medicationReminder.medicationPlan}</Text>
              <View className='double-next'></View>
            </View>
          </View>
          <DatePicker
            change={val => {
              this.setState({ time: val });
              this.getList(val);
            }}
          ></DatePicker>
          {list.length
            ? (
                list.map(item => {
                  return (
                <View className='plan-list' key={item.reminderTime}>
                  <View className='list-item'>
                    <View className='item-time flex'>
                      <Text>{utils.timeFormat(item.reminderTime, ' h:m')}</Text>
                      <Text>{utils.timeFormat(time, 'y-m-d')}</Text>
                    </View>
                    <View className='item-content'>
                      {item.list.map(lItem => {
                        return (
                          <View
                            className='medication-item flex'
                            key={lItem.historyId}
                          >
                            <View className='item-left'>
                              <View className='medication-name'>
                                {lItem.medicineName.split(' ')[0]}
                              </View>
                              <View className='medication-tag'>
                                {i18n.chain.medicationReminder.everyTime}
                                {lItem.singleAmount}
                                {lItem.dosageUnit}，{lItem.medicationFrequency}
                              </View>
                            </View>
                            <View
                              className={`item-right flex ${
                                lItem.done ? 'over' : ''
                              } ${!utils.isToday(time) ? 'disable' : ''}`}
                              onClick={() => {
                                if (!lItem.done && utils.isToday(time)) {
                                  read({
                                    historyId: lItem.historyId
                                  }).then(() => {
                                    this.getList(time);
                                  });
                                }
                              }}
                            >
                              {lItem.done
                                ? i18n.chain.medicationReminder.confirmed
                                : i18n.chain.medicationReminder
                                  .confirmMedication}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
                  );
                })
              )
            : (
            <View className='empty'>
              <View className='empty-content flex'>
                <View className='empty-bg'></View>
                <Text>{i18n.chain.medicationReminder.noMedicationPlan}</Text>
              </View>
            </View>
              )}
        </View>
      </Page>
    );
  }
}
export default Medication;
