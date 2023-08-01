import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Textarea } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import { setTodaySymptom, getTodaySymptom } from '@actions/healthy';
import DatePicker from '@components/DatePicker';
import Page from '@components/page';
import './index.scss';

interface item {
  select: boolean;
  name: string;
}
interface IState {
  initData: Array<item>;
  value: string;
  isToday: boolean;
  id: string;
  isEdit: boolean;
}
const initData = [
  '无不适',
  '三多',
  '乏力',
  '腹痛呕吐',
  '呼吸快',
  '眼下陷',
  '头痛',
  '昏醉',
  '抽搐',
  '出汗',
  '饥饿',
  '心悸'
];
export default class DiabetesSymptom extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      initData: [],
      value: '',
      isToday: true,
      id: '',
      isEdit: false
    };
  }

  componentDidMount () {
    const arr = [] as any;
    initData.forEach(item => {
      arr.push({
        name: item,
        select: false
      });
    });
    this.setState({ initData: arr }, () => {
      this.getDataByTime(new Date().getTime());
    });
  }

  // 获取数据
  getDataByTime (time) {
    const { router } = getCurrentInstance();
    const { initData } = this.state;
    getTodaySymptom({
      recordTime: time,
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then((res:any) => {
      if (res) {
        this.setState({
          value: res.remark,
          initData: this.adminSelect(res.symptom, initData),
          id: res.id,
          isEdit: !!res
        });
      }
    });
  }

  adminSelect (data, initData) {
    if (data) {
      initData.forEach(ele => {
        ele.select = false;
      });
      data.forEach(item => {
        initData.forEach(ele => {
          if (ele.name === item) {
            ele.select = true;
          }
        });
      });
    } else {
      initData.forEach(ele => {
        ele.select = false;
      });
    }
    return initData;
  }

  itemSelect (index) {
    const { initData, isToday } = this.state;
    if (!isToday) {
      return;
    }
    if (index === 0) {
      initData[index].select = !initData[index].select;
      initData.forEach((item, index) => {
        if (index !== 0) {
          item.select = false;
        }
      });
    } else {
      initData[0].select = false;
      initData[index].select = !initData[index].select;
    }
    this.setState({ initData });
  }

  // 时间改变
  changeTime (time) {
    if (
      utils.timeFormat(time, 'y/m/d') ===
      utils.timeFormat(new Date().getTime(), 'y/m/d')
    ) {
      this.setState({
        isToday: true
      });
    } else {
      this.setState({
        isToday: false
      });
    }
    this.getDataByTime(time);
  }

  saveToday () {
    const { router } = getCurrentInstance();
    if (!this.getBtn()) {
      return;
    }
    const { value, initData, id } = this.state;
    const arr = [] as any;
    initData.forEach(item => {
      if (item.select) {
        arr.push(item.name);
      }
    });
    const params = {
      remark: value,
      symptom: arr,
      recordTime: new Date().getTime(),
      serviceRecordId: router?.params && router.params.serviceRecordId,
      id
    };
    setTodaySymptom(params).then(() => {
      Taro.showToast({
        title: '保存成功',
        icon: 'none'
      });
      this.setState({ isEdit: true });
    });
  }

  getBtn () {
    const { initData, value } = this.state;
    const bol = initData.some(item => {
      return item.select;
    });
    if (bol || value) {
      return true;
    } else {
      return false;
    }
  }

  render () {
    const { initData, value, isToday, isEdit } = this.state;
    return (
      <Page title='糖尿病管理' showBack>
        <View className='diabetes-symptom-page flex'>
          <DatePicker
            change={val => {
              this.changeTime(val);
            }}
          />
          <View className='symptom-content'>
            <View className='symptom-content-title'>
              您的今日症状（可多选）
            </View>
            <View className='symptom-content-list'>
              {initData.map((item, index) => {
                return (
                  <View
                    className={`symptom-content-item ${
                      item.select ? 'active' : ''
                    }`}
                    key={item.name}
                    onClick={this.itemSelect.bind(this, index)}
                  >
                    {item.name}
                  </View>
                );
              })}
            </View>
          </View>
          <View className='symptom-content posiation'>
            <Textarea
              className='symptom-content-input'
              disabled={!isToday}
              placeholder='请输入备注信息...'
              maxlength={150}
              value={value}
              onInput={e => {
                this.setState({ value: e.detail.value });
              }}
            ></Textarea>
            <View className='sumText'>{value ? value.length : '0'}/150</View>
          </View>
          {isToday
            ? (
            <View
              className={`submit-btn ${this.getBtn() ? '' : 'disable'}`}
              onClick={this.saveToday.bind(this)}
            >
              {isEdit ? '修改' : '提交'}
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
