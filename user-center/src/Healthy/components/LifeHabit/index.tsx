import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { saveHealthFile } from '@actions/healthy';
import _ from 'lodash';
import Taro from '@tarojs/taro';
import Drawer from '../Drawer';
import './index.scss';

interface IProps {
  healthyFile: object;
  getHealthFile: Function;
}
interface Item {
  name: string;
  select: boolean;
}
interface IHealthyFile {
  food: string; // 饮食情况
  flavor: any; // 口味
  sportFrequency: string; // 运动频率
  sleepDuration: string; // 睡眠时长
  smoke: string;
  drinkWine: string;
}
interface ISinitialData {
  food: Array<Item>;
  flavor: Array<Item>;
  sleepDuration: Array<Item>;
  sportFrequency: Array<Item>;
  smoke: Array<Item>;
  drinkWine: Array<Item>;
}
interface IState {
  showNumber: number;
  selectData: IHealthyFile;
  initialData: ISinitialData;
}

const data = {
  food: [
    { name: i18n.chain.user.normal, select: false },
    { name: i18n.chain.user.partialEclipse, select: false }
  ],
  flavor: [
    { name: i18n.chain.setHeathly.partialSweet, select: false },
    { name: i18n.chain.setHeathly.salty, select: false },
    { name: i18n.chain.setHeathly.spicy, select: false },
    { name: i18n.chain.setHeathly.light, select: false },
    { name: i18n.chain.user.normal, select: false }
  ],
  sleepDuration: [
    { name: i18n.chain.setHeathly.sleepDuration1, select: false },
    { name: i18n.chain.setHeathly.sleepDuration2, select: false },
    { name: i18n.chain.setHeathly.sleepDuration3, select: false },
    { name: i18n.chain.setHeathly.sleepDuration4, select: false }
  ],
  sportFrequency: [
    { name: i18n.chain.setHeathly.sportFrequency1, select: false },
    { name: i18n.chain.setHeathly.sportFrequency2, select: false },
    { name: i18n.chain.setHeathly.sportFrequency3, select: false },
    { name: i18n.chain.setHeathly.sportFrequency4, select: false }
  ],
  smoke: [
    { name: '偶尔', select: false },
    { name: '经常', select: false },
    { name: '已戒', select: false },
    { name: '从不', select: false }
  ],
  drinkWine: [
    { name: '偶尔', select: false },
    { name: '经常', select: false },
    { name: '已戒', select: false },
    { name: '从不', select: false }
  ]
};
const arr = [
  'food',
  'sleepDuration',
  'sportFrequency',
  'sportDuration',
  'smoke',
  'drinkWine'
];
class LifeHabit extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showNumber: 0,
      initialData: data,
      selectData: {
        food: '', // 饮食情况
        flavor: '', // 口味
        sportFrequency: '', // 运动频率
        sleepDuration: '', // 睡眠时长
        smoke: '',
        drinkWine: ''
      }
    };
  }

  componentDidMount () {
    this.getData();
  }

  // 获取页面数据
  getData () {
    const deep: any = _.cloneDeep(this.props.healthyFile);
    deep.flavor && (deep.flavor = deep.flavor.split(','));

    this.setState({
      selectData: deep,
      initialData: this.adminSelect(deep)
    });
  }

  // 处理默认选择数据
  adminSelect (obj) {
    const { initialData } = this.state;
    for (const key in initialData) {
      if (key === 'flavor') {
        initialData[key].forEach(item => {
          obj[key] &&
            obj[key].forEach(ele => {
              if (ele === item.name) {
                item.select = true;
              }
            });
        });
      } else {
        initialData[key].forEach(item => {
          if (obj[key] === item.name) {
            item.select = true;
          }
        });
      }
    }
    this.setState({
      initialData
    });
    return initialData;
  }

  selectItem (key, index) {
    const { initialData } = this.state;

    if (arr.includes(key)) {
      initialData[key].forEach(item => {
        item.select = false;
      });
      initialData[key][index].select = true;
    }
    if (key === 'flavor') {
      initialData[key][index].select = !initialData[key][index].select;
    }
    this.setState({
      initialData
    });
  }

  isDisable (key) {
    const { initialData } = this.state;
    const bol = initialData[key].some(item => {
      if (item.select) {
        return true;
      } else {
        return false;
      }
    });
    return bol;
  }

  // 保存
  save (key: string) {
    if (!this.isDisable(key)) {
      Taro.showToast({
        title: i18n.chain.appointment.pickerPlaceholder,
        icon: 'none',
        duration: 1000
      });
      return;
    }
    const { initialData, selectData } = this.state;
    if (arr.includes(key)) {
      initialData[key].some(item => {
        if (item.select) {
          selectData[key] = item.name;
          return true;
        } else {
          return false;
        }
      });
    } else {
      const arr2 = [] as any;
      initialData[key].forEach(item => {
        if (item.select) {
          arr2.push(item.name);
        }
      });
      selectData[key] = arr2;
    }
    this.setState(
      {
        selectData,
        showNumber: 0
      },
      () => {
        const deep = _.cloneDeep(selectData);
        deep.flavor
          ? (deep.flavor = deep.flavor.join(','))
          : (deep.flavor = '');
        const param = {};
        param[key] = deep[key];
        saveHealthFile(param).then(() => {
          this.props.getHealthFile();
        });
      }
    );
  }

  render () {
    const { showNumber, initialData, selectData } = this.state;
    return (
      <View className='component-life-habit'>
        <View className='life-habit-content'>
          <View
            className='content-item'
            onClick={() => {
              this.setState({ showNumber: 1 });
            }}
          >
            <View className='content-item-top'>
              <View className='content-item-left'>
                <Text className='content-item-text'>
                  {i18n.chain.user.eatingHabits}
                </Text>
              </View>
              <View className='content-item-right'>
                {selectData.food
                  ? (
                  <Text className='content-item-text'>{selectData.food}</Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='icon-next'
                  src={`${utils.appConfig.ossHost}next.png`}
                ></Image>
              </View>
            </View>
          </View>
          {selectData.food !== '正常'
            ? (
            <View
              className='content-item'
              onClick={() => {
                this.setState({ showNumber: 2 });
              }}
            >
              <View className='content-item-top'>
                <View className='content-item-left'>
                  <Text className='content-item-text'>
                    {i18n.chain.user.flavor}
                  </Text>
                </View>
                <View className='content-item-right'>
                  {selectData &&
                  selectData.flavor &&
                  selectData.flavor.length > 0
                    ? null
                    : (
                    <View className='red-dot'></View>
                      )}
                  <Image
                    className='icon-next'
                    src={`${utils.appConfig.ossHost}next.png`}
                  ></Image>
                </View>
              </View>
              <View className='content-item-bottom'>
                {selectData && selectData.flavor && selectData.flavor.length
                  ? selectData.flavor.map(item => {
                    return (
                        <View className='content-tag' key={item}>
                          {item}
                        </View>
                    );
                  })
                  : null}
              </View>
            </View>
              )
            : null}

          <View
            className='content-item'
            onClick={() => {
              this.setState({ showNumber: 3 });
            }}
          >
            <View className='content-item-top'>
              <View className='content-item-left'>
                <Text className='content-item-text'>是否吸烟</Text>
              </View>
              <View className='content-item-right'>
                {selectData.smoke
                  ? (
                  <Text className='content-item-text'>
                    {selectData.smoke || '-'}
                  </Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='icon-next'
                  src={`${utils.appConfig.ossHost}next.png`}
                ></Image>
              </View>
            </View>
          </View>
          <View
            className='content-item'
            onClick={() => {
              this.setState({ showNumber: 4 });
            }}
          >
            <View className='content-item-top'>
              <View className='content-item-left'>
                <Text className='content-item-text'>是否饮酒</Text>
              </View>
              <View className='content-item-right'>
                {selectData.drinkWine
                  ? (
                  <Text className='content-item-text'>
                    {selectData.drinkWine}
                  </Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='icon-next'
                  src={`${utils.appConfig.ossHost}next.png`}
                ></Image>
              </View>
            </View>
          </View>
          <View
            className='content-item'
            onClick={() => {
              this.setState({ showNumber: 5 });
            }}
          >
            <View className='content-item-top'>
              <View className='content-item-left'>
                <Text className='content-item-text'>运动习惯</Text>
              </View>
              <View className='content-item-right'>
                {selectData.sportFrequency
                  ? (
                  <Text className='content-item-text'>
                    {selectData.sportFrequency}
                  </Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='icon-next'
                  src={`${utils.appConfig.ossHost}next.png`}
                ></Image>
              </View>
            </View>
          </View>
          <View
            className='content-item'
            onClick={() => {
              this.setState({ showNumber: 6 });
            }}
          >
            <View className='content-item-top'>
              <View className='content-item-left'>
                <Text className='content-item-text'>
                  {i18n.chain.user.sleepDuration}
                </Text>
              </View>
              <View className='content-item-right'>
                {selectData.sleepDuration
                  ? (
                  <Text className='content-item-text'>
                    {selectData.sleepDuration || '-'}
                  </Text>
                    )
                  : (
                  <View className='red-dot'></View>
                    )}
                <Image
                  className='icon-next'
                  src={`${utils.appConfig.ossHost}next.png`}
                ></Image>
              </View>
            </View>
          </View>
        </View>
        {showNumber === 1
          ? (
          <Drawer
            title={i18n.chain.user.eatingHabits}
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.food.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(this, 'food', index)}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('food') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'food')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}
        {showNumber === 2
          ? (
          <Drawer
            title={i18n.chain.setHeathly.taste}
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.flavor.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(this, 'flavor', index)}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('flavor') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'flavor')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}

        {showNumber === 3
          ? (
          <Drawer
            title='是否吸烟'
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.smoke.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(this, 'smoke', index)}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('smoke') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'smoke')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}
        {showNumber === 4
          ? (
          <Drawer
            title='是否饮酒'
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.drinkWine.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(this, 'drinkWine', index)}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('drinkWine') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'drinkWine')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}
        {showNumber === 5
          ? (
          <Drawer
            title='运动习惯(每周)'
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.sportFrequency.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(
                        this,
                        'sportFrequency',
                        index
                      )}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('sportFrequency') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'sportFrequency')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}
        {showNumber === 6
          ? (
          <Drawer
            title={i18n.chain.user.sleepDuration}
            close={() => {
              this.setState({ showNumber: 0 });
            }}
          >
            <View>
              <View className='drawer-tags'>
                {initialData.sleepDuration.map((item, index) => {
                  return (
                    <View
                      className={`drawer-tags-item ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.name}
                      onClick={this.selectItem.bind(
                        this,
                        'sleepDuration',
                        index
                      )}
                    >
                      {item.name}
                    </View>
                  );
                })}
              </View>
              <View
                className={`drawer-btn ${
                  this.isDisable('sleepDuration') ? '' : 'disable'
                }`}
                onClick={this.save.bind(this, 'sleepDuration')}
              >
                {i18n.chain.button.save}
              </View>
            </View>
          </Drawer>
            )
          : null}
      </View>
    );
  }
}
export default LifeHabit;
