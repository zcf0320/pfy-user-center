import { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Pages from '@components/page';
import DatePick from '@components/DatePick';
import utils from '@utils/index';
import lifeApi from '@actions/life';
import dayjs from 'dayjs';
import './index.scss';

const currentDate = dayjs().format('MM.DD');
interface TState {
  isDisable: boolean;
  // flag: boolean
  dateList: [];
  infoData: {
    bodyTemperature: number | string; // 体温
    diastolicBloodPressure: number | string; // 舒张压
    heartRate: number | string; // 心率
    numberOfBreaths: number | string; // 呼吸次数
    systolicBloodPressure: number | string; // 收缩压
  };
  basicInformation: {
    height: number | string;
    weight: number | string;
    bloodType: number | string;
    diseaseName: string;
    reserveId: string;
  };
  list: Array<any>;
  dayNumber: number;
  isEdit: boolean;
}
interface Data {
  bodyTemperature: number | string; // 体温
  dayNumber: number | string; // 显示的天数序号
  diastolicBloodPressure: number | string; // 舒张压
  heartRate: number | string; // 心率
  numberOfBreaths: number | string; // 呼吸次数
  systolicBloodPressure: number | string; // 收缩压
}

class LifeInfo extends Component<Data, TState> {
  constructor (props) {
    super(props);
    this.state = {
      isDisable: false,
      dateList: [],
      infoData: {
        bodyTemperature: '', // 体温
        diastolicBloodPressure: '', // 舒张压
        heartRate: '', // 心率
        numberOfBreaths: '', // 呼吸次数
        systolicBloodPressure: '' // 收缩压
      },
      basicInformation: {
        height: 0,
        weight: 0,
        bloodType: 0,
        diseaseName: '',
        reserveId: ''
      },
      list: [] as any,
      dayNumber: 0,
      // flag: false,
      isEdit: false
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount () {
    this.getList();
  }

  testNumber (value) {
    const reg = /([1-9][0-9]*)$/;
    const flag = reg.test(value);
    if (flag) {
      return value;
    } else {
      return value.slice(0, value.length - 1);
    }
  }

  onChange (event: any, name: string) {
    const infoData = this.state.infoData;
    infoData[name] = event.target.value;
    this.isEmpty(infoData);
  }

  isEmpty (infoData: any) {
    const flag = true;
    for (const key in infoData) {
      if (infoData[key] !== '0' && !infoData[key]) {
        this.setState({ infoData, isDisable: false });
        return false; // 终止程序
      }
    }
    this.setState({ infoData });
    return flag;
  }

  selectDate = (index: number, date: string) => {
    const { list } = this.state;
    let i: number | string;
    let j: number | string;
    const initData: any = {
      bodyTemperature: '-', // 体温
      diastolicBloodPressure: '-', // 舒张压
      heartRate: '-', // 心率
      numberOfBreaths: '-', // 呼吸次数
      systolicBloodPressure: '-' // 收缩压
    };
    let emptyData: any = {
      bodyTemperature: '', // 体温
      diastolicBloodPressure: '', // 舒张压
      heartRate: '', // 心率
      numberOfBreaths: '', // 呼吸次数
      systolicBloodPressure: '' // 收缩压
    };
    if (currentDate === date) {
      this.setState({
        infoData: emptyData,
        isEdit: true,
        isDisable: false,
        dayNumber: index
      });
      for (j in list) {
        if (list[j].dayNumber === index) {
          emptyData = list[j];
          this.setState({
            infoData: emptyData,
            isEdit: true
          });
        }
      }
    } else {
      if (!list.length) {
        // this.setState({
        //     infoData: initData
        // })
        return;
      }
      for (i in list) {
        if (list[i].dayNumber === index) {
          emptyData = list[i];
          this.setState({
            infoData: emptyData,
            isEdit: false
          });
          return;
        } else {
          this.setState({
            infoData: initData,
            isEdit: false
          });
        }
      }
    }
  };

  setInfo (res) {
    const days: any[] = [];
    if (res.list) {
      res.list.forEach(element => {
        return days.push(element.dayNumber);
      });
      this.setState({
        dateList: utils.createAccompanyDate(res.startDate, res.endDate, days)
      });
    }
  }

  getList () {
    const { router } = getCurrentInstance();
    const params = { serviceRecordId: (router?.params && router.params.serviceRecordId) || '' };
    lifeApi.getDailyInfo(params).then(async (res: any) => {
      await this.setInfo(res);
      this.setState({
        basicInformation: res.basicInformation,
        list: res.list
      });
    });
  }

  submit () {
    const params: any = this.state.infoData;
    Object.assign(params, {
      reserveId: this.state.basicInformation.reserveId,
      dayNumber: this.state.dayNumber
    });
    // 未声明接口暂时注释
    // lifeApi
    //     .setDailyInfo(params)
    //     .then(async (res: any) => {
    //         await this.getList();
    //         Taro.showToast({
    //             title: '提交成功',
    //             icon: 'none',
    //             duration: 3000
    //         });
    //     })
    //     .catch(() => {
    //         this.getList();
    //     });
  }

  render () {
    const {
      isDisable,
      dateList,
      infoData,
      basicInformation,
      isEdit
    } = this.state;
    const blood = {
      1: 'A',
      2: 'B',
      3: 'AB',
      4: 'O',
      5: ''
    };
    return (
      <Pages title='查看数据'>
        <View className='lifeInfo'>
          <View className='pd32'>
            <View className='card'>
              <View className='peroson'></View>
              <View>
                <View className='top flex'>
                  <View className='green box'>
                    <View className='height white '>
                      <View className='fs28 mb12'>身高</View>
                      <View className='fs24 '>{basicInformation.height}cm</View>
                    </View>
                  </View>
                  <View className='line'></View>
                  <View className='green box'>
                    <View className='weight white '>
                      <View className='fs28 mb12'>体重</View>
                      <View className='fs24 '>{basicInformation.weight}KG</View>
                    </View>
                  </View>
                </View>
                <View className='bottom flex'>
                  <View className='pink box'>
                    <View className='blood white '>
                      <View className='fs28 mb12'>血型</View>
                      <View className='fs24 '>
                        {blood[basicInformation.bloodType]}
                      </View>
                    </View>
                  </View>
                  <View className='line'></View>
                  <View className='pink box'>
                    <View className='disaster white '>
                      <View className='fs28 mb12'>疾病</View>
                      <View className='fs24 overflow'>
                        {basicInformation.diseaseName}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className='steps-date'>
                {dateList.length && (
                  <DatePick
                    dateList={dateList}
                    isClick
                    selectDate={this.selectDate}
                  />
                )}
              </View>
            </View>
            <View className='info'>
              <View className='item-info flex'>
                <View className='flex label'>
                  <View className='tem bg'></View>
                  <Text className=' fs28'>
                    体温
                    <Text className='fs24'>（℃）</Text>
                  </Text>
                  <View className='star'></View>
                </View>
                <View className='input'>{infoData.bodyTemperature || '-'}</View>
              </View>
              <View className='dividing'></View>
              <View className='item-info flex'>
                <View className='flex label'>
                  <View className='breath bg'></View>
                  <Text className='temperature fs28'>
                    呼吸频率
                    <Text className='fs24'>（次/分钟）</Text>
                  </Text>
                  <View className='star'></View>
                </View>
                <View className='input'>{infoData.numberOfBreaths || '-'}</View>
              </View>
              <View className='dividing'></View>
              <View className='item-info flex'>
                <View className='flex label'>
                  <View className='heart bg'></View>
                  <Text className='temperature fs28'>
                    心率
                    <Text className='fs24'>（次/分钟）</Text>
                  </Text>
                  <View className='star'></View>
                </View>
                <View className='input'>{infoData.heartRate || '-'}</View>
              </View>
            </View>
            <View className='pressure'>
              <View className='flex title'>
                <View className='preIcon'></View>
                <Text className='fs28'>血压信息</Text>
              </View>
              <View className='item-info flex'>
                <View className='flex label'>
                  <Text className=' fs28'>舒张压（mmHg）</Text>
                  <View className='star'></View>
                </View>
                <View className='input'>
                  {infoData.diastolicBloodPressure || '-'}
                </View>
              </View>
              <View className='dividing'></View>
              <View className='item-info flex'>
                <View className='flex label'>
                  <Text className=' fs28'>收缩压（mmHg）</Text>
                  <View className='star'></View>
                </View>
                <View className='input'>
                  {infoData.systolicBloodPressure || '-'}
                </View>
              </View>
            </View>
            {isEdit && (
              <Button
                type='primary'
                disabled={isDisable}
                className={`btn ${isDisable ? 'disabled' : 'active'}`}
                onClick={this.submit}
              >
                提交
              </Button>
            )}
          </View>
        </View>
      </Pages>
    );
  }
}
export default LifeInfo;
