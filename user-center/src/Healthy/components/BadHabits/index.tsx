import { View } from '@tarojs/components';
import { Component } from 'react';
import './index.scss';

interface IProps {
  onSaveForm: Function;
    selectVal: string;
    keyValue: string;
    check?: Function;
    checkItem?: Function;
    isDisable?: Function;
}
interface IState {
    badHabits: Array<any>;

}
export default class BadHabits extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      badHabits: []
    };
  }

  componentDidMount () {
    // 拿到已选中的不良习惯
    const badHabitsStr = this.props.selectVal;
    console.log(badHabitsStr);

    if (badHabitsStr) {
      const badHabits = badHabitsStr.split('、');
      if (!badHabits.includes('无')) {
        badHabits.push('有');
      }
      this.setState({
        badHabits
      });
      console.log(badHabits);
    }
  }

  isYes () {
    const { badHabits } = this.state;
    // 是否选中的是否
    return badHabits.includes('有');
  }

  isNo () {
    const { badHabits } = this.state;
    // 是否选中的是否
    return badHabits.includes('无');
  }

    checkItem = (item) => {
      const { badHabits } = this.state;
      const index = badHabits.findIndex(data => data === item);
      // 不存在的时候添加进去
      if (index === -1) {
        badHabits.push(item);
      } else {
        badHabits.splice(index, 1);
      }
      this.setState({
        badHabits
      });
    };

    check = (isYes) => {
      if (isYes) {
        // 如果已经选中有 不处理
        if (this.isYes()) {
          return;
        }

        this.setState({
          badHabits: ['有']
        });
      } else {
        this.setState({
          badHabits: ['无']
        });
      }
    };

    saveForm () {
      let { badHabits } = this.state;
      if (this.isDisable()) {
        return;
      }
      badHabits = badHabits.filter(item => item !== '有');
      const str = badHabits.join('、');
      this.props.onSaveForm(this.props.keyValue, str);
    }

    // 禁用保存
    isDisable () {
      const { badHabits } = this.state;
      return badHabits.length === 0 || (this.isYes() && (!badHabits.includes('吸烟') && !badHabits.includes('喝酒')));
    }

    render () {
      const { badHabits } = this.state;
      const hasSmoke = badHabits.includes('吸烟');
      const hasDrink = badHabits.includes('喝酒');
      return <View className='BadHabits-page'>
            <View className='flex-between title-option'>
                <View className='title'>是否有其他不良习惯？</View>
                <View className='options flex'>
                    <View className={`options-item flex-center small ${this.isYes() ? 'active' : ''}`}
                      onClick={() => { this.check(true); }}
                    >
                        有
                    </View>
                    <View className={`options-item ml-64 flex-center small ${this.isNo() ? 'active' : ''}`}
                      onClick={() => { this.check(false); }}
                    >
                        无
                    </View>
                </View>
            </View>
            {
                this.isYes()
                  ? <View className='options flex mb-148'>
                    <View className={`options-type-item flex-center large ${hasSmoke ? 'active' : ''} `}
                      onClick={() => { this.checkItem('吸烟'); }}
                    >
                        吸烟
                    </View>
                    <View className={`options-type-item ml-64 flex-center large ${hasDrink ? 'active' : ''}`}
                      onClick={() => { this.checkItem('喝酒'); }}
                    >
                        喝酒
                    </View>
                </View>
                  : null
            }
            <View className='flex-center'>
                <View className={`btn-box flex-center ${this.isDisable() ? 'disable' : ''}`}
                  onClick={() => {
                    this.saveForm();
                  }}
                > 确认</View>
            </View>
        </View>;
    }
}
