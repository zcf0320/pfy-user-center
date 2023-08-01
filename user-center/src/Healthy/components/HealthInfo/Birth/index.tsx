import { View, Text } from '@tarojs/components';
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
  status: boolean;
}
const yesList = ['足月', '早产', '流产'];
const noList = ['未生育', '未生育、有流产'];
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
class Birth extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: yesList,
      selectText: '',
      status: true
    };
  }

  componentDidMount () {
    const { birth } = this.props.healthyFile;
    let status = false;
    if (yesList.includes(birth)) {
      status = true;
    } else { status = false; };
    this.setState({
      selectText: birth,
      status,
      selectList: status ? yesList : noList
    });
  }

  changeStatus (has) {
    const { status } = this.state;
    if (status === has) {
      return;
    }
    this.setState({
      status: has,
      selectList: has ? yesList : noList
    });
  }

  render () {
    const { selectList, status, selectText } = this.state;
    return (
      <Drawer
        title='生育'
        close={() => {
          this.props.setShowNumber(0);
        }}
      >
        <View className='component-birth'>
          <View className='yes-and-no flex'>
            <Text>有无生育</Text>
            <View className='tag-list flex'>
              <View
                className={`tag-item flex ${status ? 'active' : ''}`}
                onClick={() => {
                  this.changeStatus(true);
                }}
              >
                有
              </View>
              <View
                className={`tag-item flex ${!status ? 'active' : ''}`}
                onClick={() => {
                  this.changeStatus(false);
                }}
              >
                无
              </View>
            </View>
          </View>
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
                this.props.saveData({ birth: selectText });
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
export default Birth;
