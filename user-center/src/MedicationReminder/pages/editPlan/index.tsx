import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Input, Picker } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import utils from '@utils/index';
import { connect } from 'react-redux';
import { SAVE_POST_DATA } from '@constants/medicationReminder';
import { SET_MODAL } from '@constants/common';
import { createPlan } from '@actions/medicationReminder';
import './index.scss';

interface IProps {
  postData: any;
  saveData: Function;
  setModal: Function;
  list: Array<any>;
}
interface IState {
  timeList: Array<string>;
  timeValue: number;
  unitList: Array<string>;
  unitValue: number;
  rateList: Array<string>;
  rateValue: number;
  dateValue: string;
  reminderTimeValue: string;
}

@connect(
  state => Object.assign({}, state.medicationReminder),
  dispatch => ({
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    },
    saveData (data) {
      dispatch({
        type: SAVE_POST_DATA,
        payload: data
      });
    }
  })
)
class EditPlan extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      timeList: [],
      timeValue: 0,
      unitList: [
        '片',
        '粒',
        '丸',
        '包',
        '袋',
        '盒',
        '支',
        '贴',
        'mg',
        'g',
        'ml',
        'IU'
      ],
      unitValue: 0,
      rateList: [
        '隔日1次',
        '每日1次',
        '每日2次',
        '每日3次',
        '每日4次',
        '每日5次',
        '每日6次',
        '每日7次',
        '每日8次',
        '每2日1次',
        '每3日1次',
        '每周1次',
        '每周2次',
        '每周3次',
        '每2周1次',
        '每3周1次',
        '每4周1次',
        '每月1次',
        '每小时1次',
        '每2小时1次',
        '每3小时1次',
        '每4小时1次',
        '每5小时1次',
        '每6小时1次',
        '每8小时1次',
        '每12小时1次',
        '每24小时1次',
        '早晚各1次',
        '睡前服用',
        '必要时服用',
        '立即用药'
      ],
      rateValue: 0,
      dateValue: '',
      reminderTimeValue: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const timeList = [] as any;
    for (let i = 0; i < 90; i++) {
      timeList.push(`${i + 1}天`);
    }
    this.setState({
      timeList
    });
    const {
      medicationDetailList,
      daysNumber,
      planId,
      reminderTime
    } = this.props.list[Number(router?.params && router.params.index)];
    let { startDate } = this.props.list[Number(router?.params && router.params.index)];
    if (startDate < new Date().getTime()) {
      startDate = new Date().getTime();
    }
    this.props.saveData({
      medicationDetailList,
      daysNumber,
      planId,
      startDate,
      reminderTime
    });
  }

  saveMedicationDetailList (key, value, index) {
    const { postData } = this.props;
    postData.medicationDetailList[index][key] = value;
    this.props.saveData(postData);
  }

  saveReminderTime (index, value) {
    const { postData } = this.props;
    postData.reminderTime[index] = value;
    this.props.saveData(postData);
  }

  save (key, value) {
    const { postData } = this.props;
    postData[key] = value;
    this.props.saveData(postData);
  }

  del (key, index) {
    const { postData } = this.props;
    this.props.setModal({
      show: true,
      content: '确认要删除吗？',
      clickConfirm: () => {
        postData[key].splice(index, 1);
        this.props.saveData(postData);
      }
    });
  }

  watchData () {
    const { postData } = this.props;
    const {
      medicationDetailList,
      reminderTime,
      startDate,
      daysNumber
    } = postData;
    let result = true;
    // medicationDetailList.every((item, index) => {
    //     const {dosageUnit, medicationFrequency, medicineName, singleAmount} = item
    //     if(!dosageUnit || !medicationFrequency || !medicineName || !singleAmount) {
    //         result = false
    //         return false
    //     } else {
    //         result = true
    //         return true
    //     }
    // })
    // result = result && startDate && daysNumber
    // let selectTime = reminderTime.filter((item) => {
    //     return item !== ''
    // })
    // result = result && selectTime.length
    result = medicationDetailList.every(item => {
      const { medicineName } = item;
      if (!medicineName) {
        return false;
      } else {
        return true;
      }
    });
    result = result && startDate && daysNumber;
    const selectTime = reminderTime.filter(item => {
      return item !== '';
    });
    result = result && selectTime.length;
    return !!result;
  }

  saveData () {
    const { router } = getCurrentInstance();
    if (this.watchData()) {
      const { postData } = this.props;
      let error = '';
      const { medicationDetailList } = postData;
      medicationDetailList.every(item => {
        const { singleAmount } = item;
        if (
          !singleAmount ||
          (Number(singleAmount) > 0 &&
            Number(singleAmount) < 10000 &&
            utils.testNumber(item.singleAmount))
        ) {
          return true;
        } else {
          error = '请输入正确的单次用量';
          console.log('...');
          return false;
        }
      });
      if (error) {
        Taro.showToast({
          title: error,
          icon: 'none'
        });
        return;
      }

      createPlan({ ...postData, planId: router?.params && router.params.planId }).then(
        () => {
          Taro.navigateBack({
            delta: 1
          });
          this.props.saveData({
            daysNumber: 0,
            medicationDetailList: [
              {
                dosageUnit: '',
                medicationFrequency: '',
                medicineName: '',
                singleAmount: ''
              }
            ],
            startDate: 0,
            reminderTime: ['']
          });
        }
      );
    }
  }

  render () {
    const { postData } = this.props;
    const {
      medicationDetailList,
      reminderTime,
      startDate,
      daysNumber
    } = postData;
    const {
      timeList,
      timeValue,
      unitList,
      rateList,
      unitValue,
      rateValue,
      dateValue,
      reminderTimeValue
    } = this.state;
    return (
      <Page showBack title='修改服药计划'>
        <View className='page-add-plan flex'>
          {medicationDetailList.map((item, index) => {
            return (
              <View className='item' key={item.medicineName}>
                {!index
                  ? (
                  <View className='item-title flex'>
                    <View className='icon-1'></View>
                    <Text>吃什么药？</Text>
                  </View>
                    )
                  : null}
                <View
                  className='item-content flex'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/MedicationReminder/pages/searchDrug/index?index=${index}`
                    });
                  }}
                >
                  <View className='left'>药品名称</View>
                  <View className='right flex'>
                    <Text
                      className={`right-text ${
                        item.medicineName ? '' : 'disable'
                      }`}
                    >
                      {item.medicineName || '请选择'}
                    </Text>
                    <View className='next'></View>
                  </View>
                </View>
                <View className='item-content flex'>
                  <View className='left'>单次用量</View>
                  <View className='right flex'>
                    <Input
                      value={item.singleAmount ? item.singleAmount : ''}
                      className='input-number'
                      type='digit'
                      placeholder='请输入用量'
                      onBlur={e => {
                        this.saveMedicationDetailList(
                          'singleAmount',
                          e.detail.value,
                          index
                        );
                      }}
                    ></Input>
                    <Picker
                      className='picker'
                      mode='selector'
                      range={unitList}
                      value={unitValue}
                      onChange={e => {
                        this.setState({
                          unitValue: e.detail.value as number
                        });
                        this.saveMedicationDetailList(
                          'dosageUnit',
                          unitList[e.detail.value],
                          index
                        );
                      }}
                    >
                      <View
                        className={`right-text ${
                          item.dosageUnit ? '' : 'disable'
                        } picker`}
                      >
                        {item.dosageUnit ? item.dosageUnit : '请选择剂量单位'}
                      </View>
                    </Picker>

                    <View className='next'></View>
                  </View>
                </View>
                <View className='item-content flex'>
                  <View className='left'>用药频率</View>
                  <View className='right flex'>
                    <Picker
                      className='picker'
                      mode='selector'
                      range={rateList}
                      value={rateValue}
                      onChange={e => {
                        this.setState({
                          rateValue: e.detail.value as number
                        });
                        this.saveMedicationDetailList(
                          'medicationFrequency',
                          rateList[e.detail.value],
                          index
                        );
                      }}
                    >
                      <View
                        className={`right-text ${
                          item.medicationFrequency ? '' : 'disable'
                        } picker`}
                      >
                        {item.medicationFrequency
                          ? item.medicationFrequency
                          : '请选择频率'}
                      </View>
                    </Picker>

                    <View className='next'></View>
                  </View>
                </View>
                {index === medicationDetailList.length - 1
                  ? (
                  <View className='last flex'>
                    {index
                      ? (
                      <View
                        className='add-item remove-item flex'
                        onClick={() => {
                          this.del('medicationDetailList', index);
                        }}
                      >
                        删除
                      </View>
                        )
                      : null}

                    <View
                      className='add-item flex'
                      onClick={() => {
                        if (medicationDetailList.length === 5) {
                          Taro.showToast({
                            title: '已达最多添加药量！',
                            icon: 'none'
                          });
                          return;
                        }
                        postData.medicationDetailList.push({
                          dosageUnit: '',
                          medicationFrequency: '',
                          medicineName: '',
                          singleAmount: ''
                        });

                        this.props.saveData(postData);
                      }}
                    >
                      +新增药品
                    </View>
                  </View>
                    )
                  : null}
              </View>
            );
          })}
          <View className='item'>
            <View className='item-title flex'>
              <View className='icon-1 icon-2'></View>
              <Text>什么时候吃药？</Text>
            </View>
            <View className='item-content flex'>
              <View className='left'>用药天数</View>
              <View className='right flex'>
                <Picker
                  className='picker'
                  mode='selector'
                  range={timeList}
                  value={timeValue}
                  onChange={e => {
                    this.setState({
                      timeValue: e.detail.value as number
                    });
                    this.save('daysNumber', Number(e.detail.value) + 1);
                  }}
                >
                  <View
                    className={`right-text ${
                      daysNumber ? '' : 'disable'
                    } picker`}
                  >
                    {daysNumber ? `${daysNumber}天` : '请选择'}
                  </View>
                </Picker>
                <View className='next'></View>
              </View>
            </View>
            <View className='item-content flex'>
              <View className='left'>开始用药时间</View>
              <View className='right flex'>
                <Picker
                  className='picker'
                  mode='date'
                  value={dateValue}
                  start={utils.timeFormat(new Date().getTime(), 'y-m-d')}
                  onChange={e => {
                    this.setState({
                      dateValue: e.detail.value
                    });
                    this.save('startDate', new Date(e.detail.value).getTime());
                  }}
                >
                  <View
                    className={`right-text ${
                      startDate ? '' : 'disable'
                    } picker`}
                  >
                    {startDate
                      ? `${utils.timeFormat(startDate, 'y.m.d')}`
                      : '请选择'}
                  </View>
                </Picker>
                <View className='next'></View>
              </View>
            </View>
            {reminderTime.map((item, index) => {
              return (
                <View key={item} className='item-content flex'>
                  <View className='left flex'>
                    <Text>服药提醒</Text>
                    {index
                      ? (
                      <View
                        className='remove'
                        onClick={() => {
                          this.del('reminderTime', index);
                        }}
                      ></View>
                        )
                      : null}
                  </View>
                  <View className='right flex'>
                    <Picker
                      className='picker'
                      mode='time'
                      value={reminderTimeValue}
                      onChange={e => {
                        this.setState({
                          reminderTimeValue: e.detail.value
                        });
                        this.saveReminderTime(
                          index,
                          new Date(`1970/01/01 ${e.detail.value}`).getTime()
                        );
                      }}
                    >
                      <View
                        className={`right-text ${
                          item !== '' ? '' : 'disable'
                        } picker`}
                      >
                        {item !== ''
                          ? utils.timeFormat(item, ' h:m')
                          : '设置提醒时间'}
                      </View>
                    </Picker>
                    <View className='next'></View>
                  </View>
                </View>
              );
            })}

            <View
              className='last flex'
              onClick={() => {
                if (reminderTime.length === 8) {
                  Taro.showToast({
                    title: '已达最多提醒次数！',
                    icon: 'none'
                  });
                  return;
                }
                postData.reminderTime.push('');
                this.props.saveData(postData);
              }}
            >
              <View className='add-item flex'>+新增时间</View>
            </View>
          </View>
          <View
            className={`add-plan flex ${
              this.watchData() ? '' : 'disable'
            }`}
            onClick={this.saveData.bind(this)}
          >
            保存
          </View>
        </View>
      </Page>
    );
  }
}
export default EditPlan;
