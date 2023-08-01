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
class BloodVolume extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: ['<10片', '10-20片', '>20片', '不清楚'],
      selectText: ''
    };
  }

  componentDidMount () {
    const { bloodVolume } = this.props.healthyFile;
    this.setState({
      selectText: bloodVolume
    });
  }

  render () {
    const { selectList, selectText } = this.state;
    return (
      <Drawer
        title='血量'
        explain='每次月经按照每天4-5次更换卫生巾计算'
        close={() => {
          this.props.setShowNumber(0);
        }}
      >
        <View className='component-blood-volume'>
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
                this.props.saveData({ bloodVolume: selectText });
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
export default BloodVolume;
