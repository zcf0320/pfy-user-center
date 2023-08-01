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
class BloodColor extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: ['鲜红色', '暗红色', '淡红色', '都不是'],
      selectText: ''
    };
  }

  componentDidMount () {
    const { menstrualColor } = this.props.healthyFile;
    this.setState({
      selectText: menstrualColor
    });
  }

  render () {
    const { selectList, selectText } = this.state;
    return (
      <Drawer
        title='颜色'
        close={() => {
          this.props.setShowNumber(0);
        }}
      >
        <View className='component-blood-color'>
          <View className='select-list flex'>
            {selectList.map((item, index) => {
              return (
                <View
                  className='select-item flex'
                  key={item}
                  onClick={() => {
                    this.setState({ selectText: item });
                  }}
                >
                  <View className={`item-bg bg-${index}`}></View>
                  <View
                    className={`item-name flex ${
                      selectText === item ? 'active' : ''
                    }`}
                  >
                    {item}
                  </View>
                </View>
              );
            })}
          </View>
          <View
            className={`save flex ${selectText ? 'active' : ''}`}
            onClick={() => {
              if (selectText) {
                this.props.saveData({ menstrualColor: selectText });
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
export default BloodColor;
