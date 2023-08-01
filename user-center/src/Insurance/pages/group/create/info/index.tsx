
import { Component } from 'react';
import { View, Text, Image, Picker } from '@tarojs/components';
import { connect } from 'react-redux';
import { SET_INSURANCE_INFO } from '@constants/insurance';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    setInfo: Function;
}
interface IState{
    time: string;
    startTime: string;
}
@connect(state => state, dispatch => ({
  setInfo (time) {
    dispatch({
      type: SET_INSURANCE_INFO,
      payload: {
        startDate: utils.getZeroTime(time)
      }
    });
  }
}))
class Info extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      time: '',
      startTime: utils.timeFormat(new Date().getTime() + 2 * 24 * 3600 * 1000, 'y-m-d')
    };
  }

  onDateChange (e) {
    const time = e.detail.value.replace(/-/g, '/');
    this.setState({
      time: utils.timeFormat(new Date(time).getTime(), 'y/m/d')
    });
    this.props.setInfo(utils.getZeroTime(time));
  }

  render () {
    const { time, startTime } = this.state;
    return (
            <View className='component-product'>
            <View className='input-item flex'>
                <View className='left flex'>
                    <Text>起保日期</Text>
                    <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <View className='right flex'>
                <Picker mode='date'
                  onChange={this.onDateChange.bind(this)}
                  start={startTime}
                  value={startTime}
                    // start={utils.timeFormat(new Date().getTime() + 2 * 24 * 3600 * 1000, 'y-m-d')}
                  className='picker flex'
                >
                    <View className='picker'>
                        {
                            time ? (<View className='date'>{time}</View>) : (<View className='placeholder date'>请选择起保日期</View>)
                        }
                    </View>
                </Picker>
                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                </View>
            </View>
        </View>
    );
  }
}

export default Info;
