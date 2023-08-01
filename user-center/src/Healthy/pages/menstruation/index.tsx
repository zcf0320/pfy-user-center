import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { getOneDayFile } from '@actions/healthy';
import { SET_SHOW_NUMBER, GET_OLD_HEALTHY_FILE } from '@constants/healthy';
import utils from '@utils/index';
import Page from '@components/page';
import Calendar from '../../components/Calendar';
import BloodColor from '../../components/HealthInfo/BloodColor';
import BloodVolume from '../../components/HealthInfo/BloodVolume';
import Clot from '../../components/HealthInfo/Clot';
import YesAndNo from '../../components/HealthInfo/YesAndNo';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  showNumber: number;
  setShowNumber: Function;
  healthyFile?: any;
  setOldData: Function;
  oldHealthyFile: any;
}
interface IState {
  showTips: boolean;
  selectTime: number;
}
@connect(
  state => state.healthy,
  dispatch => ({
    setShowNumber (data) {
      dispatch({
        type: SET_SHOW_NUMBER,
        payload: data
      });
    },
    setOldData (data) {
      dispatch({
        type: GET_OLD_HEALTHY_FILE,
        payload: data
      });
    }
  })
)
class Menstruation extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showTips: false,
      selectTime: new Date().getTime()
    };
  }

  componentDidShow () {
    // this.getOldData();
  }

  setShowNumber (index) {
    const { selectTime } = this.state;
    if (utils.isToday(selectTime)) {
      this.props.setShowNumber(index);
    }
  }

  getOldData () {
    const { selectTime } = this.state;
    getOneDayFile({
      createDate: selectTime
    }).then(res => {
      this.props.setOldData(res);
    });
  }

  filter (key) {
    const { healthyFile, oldHealthyFile } = this.props;
    let text = '';
    const { selectTime } = this.state;
    const isToday = utils.isToday(selectTime);
    text = isToday ? healthyFile[key] : oldHealthyFile[key];
    return text || '-';
  }

  render () {
    const { showTips, selectTime } = this.state;
    const isToday = utils.isToday(selectTime);
    const { showNumber } = this.props;
    return (
      <Page showBack title='月经'>
        {showNumber === 4 ? <YesAndNo></YesAndNo> : null}
        {showNumber === 5 ? <BloodColor></BloodColor> : null}
        {showNumber === 6 ? <Clot></Clot> : null}
        {showNumber === 7 ? <BloodVolume></BloodVolume> : null}
        {showNumber === 8 ? <YesAndNo></YesAndNo> : null}
        {/* <BloodColor></BloodColor> */}
        <View className='page-menstruation flex'>
          <Calendar
            change={val => {
              this.setState({ selectTime: val });
            }}
          ></Calendar>
          <View className='health-info-content'>
            <View className='content-title flex'>
              <View className='title-icon'></View>
              <Text>当日月经情况</Text>
            </View>
            <View
              className='common-item'
              onClick={() => {
                this.setShowNumber(4);
              }}
            >
              <View className='common-item-content flex no-border'>
                <View className='left flex icon-left-4'>
                  <View className='icon-left'></View>
                  <Text>是否来月经</Text>
                </View>
                <View className='right flex'>
                  <Text>{this.filter('menses')}</Text>
                  {isToday
                    ? (
                    <Image
                      className='next'
                      src={`${ossHost}images/next.png`}
                    ></Image>
                      )
                    : null}
                </View>
              </View>
            </View>
            {this.filter('menses') === '否'
              ? null
              : (
              <View>
                <View
                  className='common-item'
                  onClick={() => {
                    this.setShowNumber(5);
                  }}
                >
                  <View className='common-item-content flex '>
                    <View className='left flex'>
                      <View className='icon-left icon-left-5'></View>
                      <Text>颜色</Text>
                    </View>
                    <View className='right flex'>
                      <Text>{this.filter('menstrualColor')}</Text>
                      {isToday
                        ? (
                        <Image
                          className='next'
                          src={`${ossHost}images/next.png`}
                        ></Image>
                          )
                        : null}
                    </View>
                  </View>
                </View>
                <View
                  className='common-item'
                  onClick={() => {
                    this.setShowNumber(6);
                  }}
                >
                  <View className='common-item-content flex '>
                    <View className='left flex '>
                      <View className='icon-left icon-left-6'></View>
                      <Text>血块</Text>
                    </View>
                    <View className='right flex'>
                      <Text>{this.filter('bloodClot')}</Text>
                      {isToday
                        ? (
                        <Image
                          className='next'
                          src={`${ossHost}images/next.png`}
                        ></Image>
                          )
                        : null}
                    </View>
                  </View>
                </View>
                <View
                  className='common-item'
                  onClick={() => {
                    this.setShowNumber(7);
                  }}
                >
                  <View className='common-item-content flex '>
                    <View className='left flex '>
                      <View className='icon-left icon-left-7'></View>
                      <Text>血量</Text>
                      <View className='explain'>
                        <View
                          className='explain-bg'
                          onClick={() => {
                            this.setState({ showTips: !showTips });
                          }}
                        ></View>
                        {showTips
                          ? (
                          <View className='explain-text flex'>
                            每次月经按照每天4-5次更换卫生巾计算
                          </View>
                            )
                          : null}
                      </View>
                    </View>
                    <View className='right flex'>
                      <Text>{this.filter('bloodVolume')}</Text>
                      {isToday
                        ? (
                        <Image
                          className='next'
                          src={`${ossHost}images/next.png`}
                        ></Image>
                          )
                        : null}
                    </View>
                  </View>
                </View>
                <View
                  className='common-item'
                  onClick={() => {
                    this.setShowNumber(8);
                  }}
                >
                  <View className='common-item-content flex'>
                    <View className='left flex'>
                      <View className='icon-left icon-left-8'></View>
                      <Text>是否痛经</Text>
                    </View>
                    <View className='right flex'>
                      <Text>{this.filter('dysmenorrhea')}</Text>
                      {isToday
                        ? (
                        <Image
                          className='next'
                          src={`${ossHost}images/next.png`}
                        ></Image>
                          )
                        : null}
                    </View>
                  </View>
                </View>
              </View>
                )}
          </View>
        </View>
      </Page>
    );
  }
}
export default Menstruation;
