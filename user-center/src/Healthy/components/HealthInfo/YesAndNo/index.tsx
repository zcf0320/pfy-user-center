import { Component } from 'react';
import { View } from '@tarojs/components';
import Drawer from '../../Drawer';
import './index.scss';

interface IProps {
  setShowNumber: Function;
  healthyFile: any;
  saveData: Function;
  showNumber: number;
}
interface IState {
  selectList: Array<string>;
  selectText: string;
  title: string;
}

const selectList = ['是', '否'];
const selectTwoList = ['正常', '异常'];

class YesAndNo extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: [],
      selectText: '',
      title: ''
    };
  }

  componentDidMount () {
    const {
      menses,
      dysmenorrhea,
      renalFunction,
      liverFunction
    } = this.props.healthyFile;
    const { showNumber } = this.props;
    let selectText = '';
    let title = '';
    if (showNumber === 4) {
      selectText = menses;
      title = '是否来月经';
    }
    if (showNumber === 8) {
      selectText = dysmenorrhea;
      title = '是否来痛经';
    }
    if (showNumber === 15) {
      selectText = liverFunction;
      title = '肝功能';
    }
    if (showNumber === 16) {
      selectText = renalFunction;
      title = '肾功能';
    }

    this.setState({
      selectText,
      title,
      selectList:
        showNumber === 15 || showNumber === 16 ? selectTwoList : selectList
    });
  }

  save () {
    const { selectText } = this.state;
    const { showNumber } = this.props;
    if (selectText) {
      const obj: any = {};
      showNumber === 4 && (obj.menses = selectText);
      showNumber === 8 && (obj.dysmenorrhea = selectText);
      showNumber === 15 && (obj.liverFunction = selectText);
      showNumber === 16 && (obj.renalFunction = selectText);

      this.props.saveData(obj);
      this.props.setShowNumber(0);
    }
  }

  render () {
    // eslint-disable-next-line no-shadow
    const { selectList, selectText, title } = this.state;
    return (
      <Drawer
        title={title}
        close={() => {
          this.props.setShowNumber(0);
        }}
      >
        <View className='component-yes-and-no'>
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
              this.save();
            }}
          >
            保存
          </View>
        </View>
      </Drawer>
    );
  }
}
export default YesAndNo;
