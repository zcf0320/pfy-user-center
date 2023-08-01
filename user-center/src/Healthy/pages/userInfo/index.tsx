import Taro from '@tarojs/taro';
import { View, Picker, Text } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import _ from 'lodash';
import { getAllProvice } from '@actions/common';
import utils from '@utils/index';
import { getHealthFile, saveHealthFile } from '@actions/healthy';
import Page from '@components/page';
import Drawer from '../../components/Drawer';
import InputItem from '../../components/InputItem';
import BadHabits from '../../components/BadHabits';
import Edema from '../../components/HealthInfo/Edema';
import Hemorrhage from '../../components/HealthInfo/Hemorrhage';
import './index.scss';

interface IState {
  visible: boolean;
  type: number;
  provincePickArr: Array<any>;
  position: Array<number>;
  arrHeight: Array<any>;
  arrWeight: Array<any>;
  setShow: number;
  showNumber: number;
  healthyFile: any;
  heightIndex: number;
  weightIndex: number;
  smoke: string;
  drinkWine: string;
}
const data = {
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

export default class BaseInfo extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      visible: false,
      type: 0,
      provincePickArr: [],
      position: [],
      arrHeight: [],
      arrWeight: [],
      setShow: 0,
      showNumber: 0,
      healthyFile: {},
      heightIndex: 0,
      weightIndex: 0,
      smoke: '',
      drinkWine: ''
    };
  }

  componentDidMount () {
    const arrHeight: any = [];
    for (let i = 150; i <= 200; i++) {
      arrHeight.push(i.toString());
    }
    this.setState({
      arrHeight
    });
    const arrWeight: any = [];
    for (let i = 30; i <= 200; i++) {
      arrWeight.push(i.toString());
    }
    this.setState({
      arrWeight
    });

    getAllProvice().then((res: any) => {
      const arr = [] as any;
      res.forEach(item => {
        item.name = item.provinceName;
        item.id = item.provinceId;
        item.cities.forEach(city => {
          city.name = city.cityName;
          city.id = city.cityId;
          city.districts.forEach(district => {
            district.id = district.districtId;
            district.name = district.districtName;
          });
        });
        arr.push(item);
      });

      this.setState({
        provincePickArr: [arr, arr[0].cities, arr[0].cities[0].districts]
      });
      this.setInit(arr);
    });
  }

  componentDidShow () {
    this.getData();
  }

  // 获取页面数据
  getData () {
    getHealthFile().then((res: any) => {
      this.setState(
        {
          healthyFile: res
        },
        () => {
          const deep = _.cloneDeep(res);

          if (deep.height) {
            this.setState({
              heightIndex: this.state.arrHeight.findIndex(
                item => item === deep.height
              )
            });
          }
          if (deep.weight) {
            this.setState({
              weightIndex: this.state.arrWeight.findIndex(
                item => item === deep.weight
              )
            });
          }

          this.setState({
            smoke: deep.smoke,
            drinkWine: deep.drinkWine
          });
        }
      );
    });
  }

  close = () => {
    this.setState({
      visible: false
    });
  };

  saveForm (key, value) {
    const { arrHeight, arrWeight } = this.state;
    const data = {};
    if (key === 'height') {
      data[key] = arrHeight[value];
    } else if (key === 'weight') {
      data[key] = arrWeight[value];
    } else {
      data[key] = value;
    }

    saveHealthFile(data).then(() => {
      this.getData();
    });
    this.setState({
      visible: false
    });
  }

  columnChange (val) {
    const { column, value } = val;
    const provincePickArr = JSON.parse(
      JSON.stringify(this.state.provincePickArr)
    );
    if (column === 0) {
      const arr = provincePickArr[0][value].cities || [];
      provincePickArr[1] = arr;
      provincePickArr[2] = arr[0].districts;
      this.setState({
        provincePickArr,
        position: [value, 0, 0]
      });
    }
    if (column === 1) {
      const val = this.state.position;
      const arr = provincePickArr[1][value].districts || [];
      provincePickArr[2] = arr;
      this.setState({
        provincePickArr,
        position: [val[0], value, 0]
      });
    }
  }

  saveCity (e) {
    const value = e.detail.value;
    const { province, city, region } = this.getProvinceInfo(value);
    this.setState({
      position: value
    });
    saveHealthFile({ region, city, province });
  }

  // 通过value获取id
  getProvinceInfo (value) {
    let province = '';
    let provinceName = '';
    let city = '';
    let cityName = '';
    let region = '';
    let regionName = '';
    const { provincePickArr } = this.state;
    if (provincePickArr.length === 3 && value.length > 0) {
      if (provincePickArr[0][value[0]]) {
        province = provincePickArr[0][value[0]].id;
        provinceName = provincePickArr[0][value[0]].name;
      }
      if (provincePickArr[1][value[1]]) {
        city = provincePickArr[1][value[1]].id;
        cityName = provincePickArr[1][value[1]].name;
      }
      if (provincePickArr[2][value[2]]) {
        region = provincePickArr[2][value[2]].id;
        regionName = provincePickArr[2][value[2]].name;
      }
    }
    return { province, provinceName, city, cityName, region, regionName };
  }

  setInit (arr) {
    const { province, city, region } = this.state.healthyFile;

    // 如果选中省市区 回写选中值
    if (province && arr.length > 0) {
      const provincePickArr = [arr, [], []];
      const index1 = arr.findIndex(item => item.id === +province);
      const itemData1 = arr[index1];
      const index2 = itemData1.cities.findIndex(item => item.id === +city);
      const itemData2 = itemData1.cities[index2];
      const index3 = itemData2.districts.findIndex(item => item.id === +region);
      provincePickArr[1] = itemData1.cities;
      provincePickArr[2] = itemData2.districts;
      this.setState(
        {
          provincePickArr: provincePickArr
        },
        () => {
          this.setState({
            position: [index1, index2, index3]
          });
        }
      );
    }
  }

  getDatas () {
    this.getData();
    this.setState({
      setShow: 0
    });
  }

  selectItem (key, value) {
    if (key === 'smoke') {
      this.setState({
        smoke: value
      });
    } else {
      this.setState({
        drinkWine: value
      });
    }
  }

  // 保存
  save (key) {
    if (key === 'smoke') {
      if (!this.state.smoke) {
        return;
      }
    } else {
      if (!this.state.drinkWine) {
        return;
      }
    }

    this.saveForm(
      key,
      key === 'smoke' ? this.state.smoke : this.state.drinkWine
    );
    this.setState({ showNumber: 0 });
  }

  render () {
    const {
      visible,
      type,
      provincePickArr,
      position,
      arrHeight,
      arrWeight,
      setShow,
      showNumber,
      healthyFile,
      heightIndex,
      weightIndex,
      smoke,
      drinkWine
    } = this.state;

    const user = Taro.getStorageSync(utils.appConfig.userInfo);
    const { regionName, cityName, provinceName } = this.getProvinceInfo(
      position
    );
    return (
      <Page showBack title='基本信息'>
        <View className='baseInfo-box'>
          <View className='page-baseInfo'>
            <View className='box-item'>
              <View className='title'>{i18n.chain.user.baseInfo}</View>
              <View className='view-item no-border flex-between'>
                <View className='flex-center'>
                  <View className='icon-box user'></View>
                  <View className='left-content ml-24 '>
                    {i18n.chain.appointment.name}
                  </View>
                </View>
                <View className='right-content fc-grey'>
                  {user.name || '-'}
                </View>
              </View>
              <View className='view-item flex-between'>
                <View className='flex-center'>
                  <View className='icon-box sex'></View>
                  <View className='left-content ml-24'>
                    {i18n.chain.appointment.sex}
                  </View>
                </View>
                <View className='right-content  fc-grey'>
                  {user.sex === 1
                    ? i18n.chain.appointment.male
                    : i18n.chain.appointment.female}
                </View>
              </View>
              <View className='view-item flex-between'>
                <View className='flex-center'>
                  <View className='icon-box age'></View>
                  <View className='left-content ml-24 '>出生日期</View>
                </View>
                <View className='right-content fc-grey'>{user.birthday}</View>
              </View>
              <View className='view-item flex-between'>
                <View className='flex-center'>
                  <View className='icon-box age'></View>
                  <View className='left-content ml-24 '>手机号</View>
                </View>
                <View className='right-content fc-grey'>
                  {utils.hidePhone(user.mobile)}
                </View>
              </View>
            </View>
            <View className='box-item'>
              <View className='title'>个人情况</View>
              <Picker
                mode='selector'
                range={arrHeight}
                value={heightIndex}
                onChange={e => {
                  this.setState({ heightIndex: +e.detail.value });
                  this.saveForm('height', e.detail.value);
                }}
              >
                <View className='view-item no-border flex-between'>
                  <View className='flex-center'>
                    <View className='icon-box height'></View>
                    <View className='left-content ml-24 flex-box'>
                      {i18n.chain.user.height}
                      <Text className='required'></Text>
                    </View>
                  </View>
                  <View className='flex-center'>
                    <View className='right-content fc-black '>
                      {healthyFile.height || <View className='red-dot'></View>}
                    </View>
                    <View className='next-page'></View>
                  </View>
                </View>
              </Picker>
              <Picker
                mode='selector'
                range={arrWeight}
                value={weightIndex}
                onChange={e => {
                  this.setState({ weightIndex: +e.detail.value });
                  this.saveForm('weight', e.detail.value);
                }}
              >
                <View className='view-item flex-between'>
                  <View className='flex-center'>
                    <View className='icon-box weight'></View>
                    <View className='left-content ml-24 flex-box'>
                      {i18n.chain.user.weight}
                      <Text className='required'></Text>
                    </View>
                  </View>
                  <View className='flex-center'>
                    <View className='right-content fc-black '>
                      {healthyFile.weight || <View className='red-dot'></View>}
                    </View>
                    <View className='next-page'></View>
                  </View>
                </View>
              </Picker>
              <View className='view-item flex-between'>
                <View className='flex-center'>
                  <View className='icon-box BMI'></View>
                  <View className='left-content ml-24 '>BMI</View>
                  <View className=' calc ml-24 '>
                    BMI={i18n.chain.user.weight}(kg) ÷ {i18n.chain.user.height}
                    (m)²
                  </View>
                </View>
                <View className='flex-center'>
                  <View className='right-content fc-black '>
                    {healthyFile.bmi}
                  </View>
                </View>
              </View>
              <View className='view-item flex-box'>
                <Picker
                  mode='multiSelector'
                  className='picker flex-box'
                  value={position}
                  range={provincePickArr}
                  onColumnChange={e => {
                    this.columnChange(e.detail);
                  }}
                  rangeKey='name'
                  onChange={e => {
                    this.saveCity(e);
                  }}
                  onCancel={() => {
                    this.setInit(provincePickArr[0]);
                  }}
                >
                  <View className='flex-between position-box'>
                    <View className='flex-center'>
                      <View className='icon-box position'></View>
                      <View className='left-content ml-24 '>
                        {i18n.chain.user.livingArea}
                      </View>
                    </View>
                    <View className='flex-center'>
                      <View className='right-content fc-black flex-box'>
                        {provinceName
                          ? (
                          <Text className='cityName flex'>
                            <Text>{provinceName}</Text>
                            <Text className='ml-8'>{cityName}</Text>
                            <Text className='ml-8'>{regionName}</Text>
                          </Text>
                            )
                          : (
                          <View className='red-dot'></View>
                            )}
                      </View>
                      <View className='next-page'></View>
                    </View>
                  </View>
                </Picker>
              </View>
              <View
                className='view-item flex-between'
                onClick={() => {
                  this.setState({ showNumber: 3 });
                }}
              >
                <View className='flex-center'>
                  <View className='icon-box badhabits'></View>
                  <View className='left-content ml-24 '>是否吸烟</View>
                </View>
                <View className='flex-center'>
                  <View className='right-content fc-black '>
                    {healthyFile.smoke
                      ? (
                      <Text className='content-item-text'>
                        {healthyFile.smoke}
                      </Text>
                        )
                      : (
                      <View className='red-dot'></View>
                        )}
                  </View>
                  <View className='next-page'></View>
                </View>
              </View>
              <View
                className='view-item flex-between'
                onClick={() => {
                  this.setState({ showNumber: 4 });
                }}
              >
                <View className='flex-center'>
                  <View className='icon-box badhabits'></View>
                  <View className='left-content ml-24'>是否饮酒</View>
                </View>
                <View className='flex-center'>
                  <View className='right-content fc-black '>
                    {healthyFile.drinkWine
                      ? (
                      <Text className='content-item-text'>
                        {healthyFile.drinkWine}
                      </Text>
                        )
                      : (
                      <View className='red-dot'></View>
                        )}
                  </View>
                  <View className='next-page'></View>
                </View>
              </View>
              <View
                className='view-item flex-between'
                onClick={() => {
                  this.setState({
                    setShow: 5
                  });
                }}
              >
                <View className='flex-center'>
                  <View className='icon-box badhabits'></View>
                  <View className='left-content ml-24 '>是否水肿</View>
                </View>
                <View className='flex-center'>
                  <View className='right-content fc-black '>
                    {healthyFile.edema || <View className='red-dot'></View>}
                  </View>
                  <View className='next-page'></View>
                </View>
              </View>
              <View
                className='view-item flex-between'
                onClick={() => {
                  this.setState({
                    setShow: 6
                  });
                }}
              >
                <View className='flex-center'>
                  <View className='icon-box badhabits'></View>
                  <View className='left-content ml-24 '>是否有皮下出血</View>
                </View>
                <View className='flex-center'>
                  <View className='right-content fc-black '>
                    {healthyFile.subcutaneous || (
                      <View className='red-dot'></View>
                    )}
                  </View>
                  <View className='next-page'></View>
                </View>
              </View>
            </View>
          </View>
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
                  {data.smoke.map(item => {
                    return (
                      <View
                        className={`drawer-tags-item ${
                          smoke === item.name ? 'select' : ''
                        }`}
                        key={item.name}
                        onClick={() => {
                          this.selectItem('smoke', item.name);
                        }}
                      >
                        {item.name}
                      </View>
                    );
                  })}
                </View>
                <View
                  className={`drawer-btn ${smoke ? '' : 'disable'}`}
                  onClick={() => {
                    this.save('smoke');
                  }}
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
                  {data.drinkWine.map(item => {
                    return (
                      <View
                        className={`drawer-tags-item ${
                          drinkWine === item.name ? 'select' : ''
                        }`}
                        key={item.name}
                        onClick={() => this.selectItem('drinkWine', item.name)}
                      >
                        {item.name}
                      </View>
                    );
                  })}
                </View>
                <View
                  className={`drawer-btn ${drinkWine ? '' : 'disable'}`}
                  onClick={() => {
                    this.save('drinkWine');
                  }}
                >
                  {i18n.chain.button.save}
                </View>
              </View>
            </Drawer>
              )
            : null}
          {setShow === 5
            ? (
            <Edema
              healthyFile={healthyFile}
              close={this.getDatas.bind(this)}
            ></Edema>
              )
            : setShow === 6
              ? (
            <Hemorrhage
              healthyFile={healthyFile}
              close={this.getDatas.bind(this)}
            ></Hemorrhage>
                )
              : null}
          {visible
            ? (
            <Drawer
              title={
                type === 1
                  ? i18n.chain.user.height
                  : type === 4
                    ? i18n.chain.user.badHabits
                    : ''
              }
              close={() => {
                this.close();
              }}
            >
              {type === 1
                ? (
                <InputItem
                  keyValue='height'
                  saveForm={(key, value) => {
                    this.saveForm(key, value);
                  }}
                  placeholder={i18n.chain.setHeathly.enterHeight}
                ></InputItem>
                  )
                : type === 4
                  ? (
                <BadHabits
                  keyValue='badHabits'
                  selectVal={healthyFile.badHabits}
                  onSaveForm={(key, value) => {
                    this.saveForm(key, value);
                  }}
                />
                    )
                  : null}
            </Drawer>
              )
            : null}
        </View>
      </Page>
    );
  }
}
