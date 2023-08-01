import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { getFoodListByCid, getFoodListByPid } from '@actions/healthy';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  saveData: Function;
}
interface IState {
  foodList: Array<any>;
  title: string;
}
const classify = [
  '水果类',
  '蔬菜类',
  '五谷根茎类',
  '蛋豆鱼肉类',
  '乳类',
  '零食点心类',
  '糖类',
  '饮料类'
];
export default class FoodResult extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      foodList: [],
      title: '食物库'
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    if (router?.params && router.params.cid) {
      getFoodListByCid(router?.params && router.params.cid).then((res:any) => {
        this.setState({
          foodList: res,
          title: classify[Number(router?.params && router.params.cid) - 1]
        });
        Taro.setNavigationBarTitle({ title: classify[Number(router?.params && router.params.cid) - 1] });
      });
    }
    if (router?.params && router.params.pid) {
      getFoodListByPid(router?.params && router.params.pid).then((res:any) => {
        this.setState({
          foodList: res,
          title: classify[res[0].foodClassifyId - 1]
        });
        Taro.setNavigationBarTitle({ title: classify[res[0].foodClassifyId - 1] });
      });
    }
  }

  render () {
    const { foodList, title } = this.state;
    return (
      <Page title={title} showBack>
        <View className='page-food-result flex'>
          <View className='food-result-table'>
            <View className='table-head'>
              <View className='table-head-item'>品名</View>
              <View className='table-head-item'>GI值</View>
              <View className='table-head-item'>净碳水(g)</View>
              <View className='table-head-item flex-125'>热量/100g</View>
            </View>
            {foodList.map(item => {
              return (
                <View className='table-tr' key={item.id}>
                  <View className='table-td'>{item.name || '-'}</View>
                  <View className='table-td'>{item.gi || '-'}</View>
                  <View className='table-td'>{item.carbonWater || '-'}</View>
                  <View className='table-td flex-125'>
                    <View className='calories'>
                      <View>{item.calories || '-'}</View>
                      <View className='suggestion'>
                        {item.suggestion === 1 && <Image className='img' src={`${ossHost}images/suggestion1.png`} />}
                        {item.suggestion === 2 && <Image className='img' src={`${ossHost}images/suggestion2.png`} />}
                        {item.suggestion === 3 && <Image className='img' src={`${ossHost}images/suggestion3.png`} />}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    );
  }
}
