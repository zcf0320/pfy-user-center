import { View } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { SET_SHOW_NUMBER, SET_HEALTHY_FILE } from '@constants/healthy';
import Drawer from '../../Drawer';
import './index.scss';

interface IProps {
  setShowNumber: Function;
  healthyFile?: any;
  saveData: Function;
}
interface IState {
  selectList: Array<string>;
  selectText: string;
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
    saveData (data) {
      dispatch({
        type: SET_HEALTHY_FILE,
        payload: data
      });
    }
  })
)
class MenstrualCycle extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: ['<21天', '21-35天', '>35天', '无规律'],
      selectText: ''
    };
  }

  componentDidMount () {
    const { menstrualCycle } = this.props.healthyFile;
    this.setState({
      selectText: menstrualCycle
    });
  }

  render () {
    const { selectList, selectText } = this.state;
    return (
      <Drawer
        title='月经周期（天）'
        close={() => {
          this.props.setShowNumber(0);
        }}
      >
        <View className='component-menstrual-duration'>
          <View className='select-list flex'>
            {selectList.map(item => {
              return (
                <View
                  className={`select-item flex ${
                    selectText === item ? 'active' : ''
                  }`}
                  key={item}
                  onClick={() => {
                    this.setState({ selectText: item });
                  }}
                >
                  {item}
                </View>
              );
            })}
          </View>
          <View
            className={`save flex ${selectText ? 'active' : ''}`}
            onClick={() => {
              if (selectText) {
                this.props.saveData({ menstrualCycle: selectText });
                this.props.setShowNumber(0);
              }
            }}
          >
            保存
          </View>
        </View>
      </Drawer>
    );
  }
}
export default MenstrualCycle;
