import { saveHealthFile } from '@actions/healthy';
import { View, Text, Input } from '@tarojs/components';
import { Component } from 'react';
import Drawer from '../../Drawer';
import './index.scss';

interface IProps {
  healthyFile: any;
  close: Function;
}
interface IState {
  selectList: Array<string>;
  selectText: string;
  status: boolean;
  focus: boolean;
  addValue: string;
}
const yesList = ['脸肿', '脚肿'];

class Edema extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectList: yesList,
      selectText: '',
      status: true,
      addValue: '',
      focus: false
    };
  }

  componentDidMount () {
    const edema = this.props.healthyFile.edema || '';

    // let edema = '脚肿,fkd'
    this.setState({
      selectText: edema,
      status: edema !== '否'
    });
    if (edema && edema !== '否') {
      const list: [] = edema.split(',');
      const newArr = Array.from(new Set([...yesList, ...list]));
      this.setState({
        selectList: newArr
      });
    }
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
    const name = selectList[index];
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
      this.props.close();
    });
  }

  render () {
    const { selectList, status, selectText, addValue, focus } = this.state;
    return (
      <Drawer
        title='是否容易水肿'
        close={() => {
          this.props.close(0);
        }}
      >
        <View className='component-edema'>
          <View className='yes-and-no flex'>
            <Text>有无水肿</Text>
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
            {status &&
              selectList.map((item, index) => {
                return (
                  <View
                    className={`select-item flex ${
                      selectText.indexOf(item) > -1 ? 'active' : ''
                    }`}
                    key={item}
                    onClick={() => {
                      this.clickItem(index);
                    }}
                  >
                    {item}
                  </View>
                );
              })}
          </View>
          {selectText !== '否' && (
            <View className='modal-input flex '>
              <View className='label'>添加其他水肿部位</View>
              <View className='add-content flex'>
                <Input
                  className='left'
                  placeholder='请输入您的水肿部位'
                  value={addValue}
                  onInput={value => {
                    this.setState({
                      addValue: value.detail.value
                    });
                  }}
                  onFocus={() => {
                    this.setState({
                      focus: true
                    });
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      this.setState({
                        focus: false
                      });
                    }, 500);
                  }}
                ></Input>
                <View className='right flex'>
                  {focus
                    ? (
                    <View
                      className='del'
                      onClick={() => {
                        this.setState({
                          addValue: ''
                        });
                      }}
                    ></View>
                      )
                    : null}
                  <View
                    className='add'
                    onClick={() => {
                      if (addValue) {
                        const { selectList } = this.state;
                        selectList.push(addValue);
                        this.setState({
                          addValue: ''
                        });
                      }
                    }}
                  >
                    确认
                  </View>
                </View>
              </View>
            </View>
          )}
          <View
            className={`save flex ${selectText ? 'active' : ''}`}
            onClick={() => {
              if (selectText) {
                this.saveData({ edema: selectText });
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
export default Edema;
