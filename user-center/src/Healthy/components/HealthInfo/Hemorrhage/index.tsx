import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import { saveHealthFile } from '@actions/healthy';
import Drawer from '../../Drawer';
import './index.scss';

interface IProps {
  healthyFile: any;
  close: Function;
}
interface IState {
  selectList: Array<any>;
  selectText: string;
  status: boolean;
}
const yesList = [
  {
    name: '瘀点',
    text: '有直径2mm的出血点'
  },
  {
    name: '血肿',
    text: '有直径约3-5mm的出血点'
  },
  {
    name: '紫癜',
    text: '有直径5mm的出血点'
  },
  {
    name: '瘀斑',
    text: '片状出血并伴有皮肤显著隆起'
  }
];
class Hemorrhage extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: yesList,
      selectText: '',
      status: true
    };
  }

  componentDidMount () {
    const subcutaneous = this.props.healthyFile.subcutaneous || '';
    this.setState({
      selectText: subcutaneous,
      status: subcutaneous !== '否'
    });
  }

  changeStatus (has) {
    const { status } = this.state;
    if (status === has) {
      return;
    }
    this.setState({
      status: has,
      selectText: has ? '' : '否'
    });
  }

  clickItem = index => {
    const { selectList, selectText } = this.state;
    // 判断是否有值
    const name = selectList[index].name;
    let newSelect = '';
    if (selectText) {
      if (selectText !== '否') {
        const selectArr = selectText.split(',');
        const inIndex = selectArr.indexOf(name);
        if (inIndex > -1) {
          selectArr.splice(inIndex, 1);
        } else {
          selectArr.push(name);
        }
        newSelect = selectArr.join(',');
      }
    } else {
      newSelect = name;
    }
    this.setState({
      selectText: newSelect
    });
  };

  saveData (data) {
    saveHealthFile(data).then(() => {
      this.props.close(0);
    });
  }

  render () {
    const { selectList, status, selectText } = this.state;
    return (
      <Drawer
        title='是否有皮下出血'
        close={() => {
          this.props.close();
        }}
      >
        <View className='component-hemorrhage'>
          <View className='yes-and-no flex'>
            <Text>是否有皮下出血</Text>
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
          <View className='select-list'>
            {status &&
              selectList.map((item, index) => {
                return (
                  <View
                    className={`select-item flex ${
                      selectText.indexOf(item.name) > -1 ? 'active' : ''
                    }`}
                    key={item.name}
                    onClick={() => {
                      this.clickItem(index);
                    }}
                  >
                    <View className='name'>{item.name}</View>
                    <Text>{item.text}</Text>
                  </View>
                );
              })}
          </View>
          <View
            className={`save flex ${selectText ? 'active' : ''}`}
            onClick={() => {
              if (selectText) {
                this.saveData({ subcutaneous: selectText });
              }
            }}
          >
            确认
          </View>
        </View>
      </Drawer>
    );
  }
}
export default Hemorrhage;
