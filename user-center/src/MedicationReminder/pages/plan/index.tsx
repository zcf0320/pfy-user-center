import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import Page from '@components/page';
import { connect } from 'react-redux';
import { GET_LIST } from '@constants/medicationReminder';
import { getList } from '@actions/medicationReminder';
import utils from '@utils/index';
import './index.scss';

interface IProps {
  list: Array<any>;
  getList: Function;
}
@connect(
  state => Object.assign({}, state.medicationReminder),
  dispatch => ({
    getList (data) {
      dispatch({
        type: GET_LIST,
        payload: data
      });
    }
  })
)
class Plan extends Component<IProps> {
  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.medicationReminder.medicationPlan });
  }

  componentDidShow () {
    getList().then(res => {
      this.props.getList(res);
    });
  }

  watchData () {
    const { list } = this.props;
    return list && list.length;
  }

  render () {
    const { list } = this.props;

    return (
      <Page showBack title={i18n.chain.medicationReminder.medicationPlan}>
        <View
          className={`page-plan flex ${
            this.watchData() ? '' : 'none'
          }`}
        >
          {!list || !list.length
            ? (
            <View className='empty flex'>
              <View className='empty-content flex'>

                <View className='empty-bg'></View>
                <Text>{i18n.chain.medicationReminder.noMedicineReminder}</Text>
              </View>
            </View>
              )
            : null}

          <View
            className='add-plan flex'
            onClick={() => {
              Taro.navigateTo({
                url: '/MedicationReminder/pages/addPlan/index'
              });
            }}
          >
            {i18n.chain.medicationReminder.addMedicationPlan}
          </View>
          { list.length
            ? list.map((item, index) => {
              return (
                  <View className='plan-item' key={item.planId}>
                    <View className={`status status-${item.state} ${i18n.getLocaleName() === 'zh' ? '' : 'en'}`}></View>
                    <View className='plan-item-top'>
                      <View className='date'>
                        {i18n.chain.medicationReminder.medicationCycle}:{utils.timeFormat(item.startDate, 'y.m.d')}-
                        {utils.timeFormat(item.endDate, 'y.m.d')}
                      </View>
                      <View className='date-dot flex'>
                        <View className='date-title'>{i18n.chain.medicationReminder.medicationReminder}:</View>
                        <View className='dot-list flex'>
                          {item.reminderTime.map(rItem => {
                            return (
                              <View key={rItem} className='dot-item'>
                                {utils.timeFormat(rItem, ' h:m')}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                    <View className='plan-item-center'>
                      <View className='medication-list'>
                        {item.medicationDetailList.map((mItem, mIndex) => {
                          return (
                            <View
                              key={mItem.medicineName}
                              className='medication-item'
                            >
                              <View className='name'>
                                {mIndex + 1}、{mItem.medicineName}
                              </View>
                              <View className='tag'>
                              {i18n.chain.medicationReminder.everyTime}{mItem.singleAmount}
                                {mItem.dosageUnit}，{mItem.medicationFrequency}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View className='plan-item-bottom flex'>
                      <View className='left'>{i18n.chain.medicationReminder.planSource}:{item.source}</View>
                      <View
                        className='right flex'
                        onClick={() => {
                          Taro.navigateTo({
                            url: `/MedicationReminder/pages/planDetail/index?index=${index}`
                          });
                        }}
                      >
                        <Text>{i18n.chain.serviceComponent.viewDetails}</Text>
                        <View className='next'></View>
                      </View>
                    </View>
                  </View>
              );
            })
            : null}
        </View>
      </Page>
    );
  }
}
export default Plan;
