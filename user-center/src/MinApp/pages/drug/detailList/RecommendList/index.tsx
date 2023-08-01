import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import './index.scss';

interface IProps {
  recommend: Array<any>;
  confirm: Function;
  close: Function;
}
interface IState {
  recommendArr: Array<any>;
}
class RecommendList extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      recommendArr: []
    };
  }

  static getDerivedStateFromProps (nextProps, state) {
    if (nextProps.recommend !== state.recommend) {
      return {
        recommendArr: nextProps.recommend
      };
    }
    return null;
  }

  select (index) {
    const { recommendArr } = this.state;
    if (
      recommendArr[index].allergyMedicine ||
      recommendArr[index].disable ||
      !recommendArr[index].onSale
    ) {
      return;
    }
    const selectList = recommendArr.filter(item => {
      return item.select;
    });
    if (selectList.length === 3) {
      Taro.showToast({
        title: '最多选择3类药品',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    if (recommendArr[index].select) {
      recommendArr.forEach(item => {
        if (
          item.type === recommendArr[index].type &&
          item.id !== recommendArr[index].id
        ) {
          item.disable = false;
        }
      });
    } else {
      recommendArr.forEach(item => {
        if (
          item.type === recommendArr[index].type &&
          item.id !== recommendArr[index].id
        ) {
          console.log(true);
          item.disable = true;
        }
      });
    }
    recommendArr[index].select = !recommendArr[index].select;
    this.setState({
      recommendArr: [...recommendArr]
    });
  }

  confirm () {
    const { recommendArr } = this.state;
    console.log(recommendArr);
    this.props.confirm(recommendArr);
    this.props.close();
  }

  render () {
    const { recommendArr } = this.state;
    return (
      <View className='component-recommend-list'>
        <View className='component-recommend-list-content flex'>
          <View className='content-top'>已为您匹配到处方单药品</View>
          <View className='content-center flex'>
            {recommendArr.map((item, index) => {
              return item.allergyMedicine
                ? null
                : (
                <View
                  className={`center-item  ${
                    item.disable || !item.onSale ? 'disable' : ''
                  }`}
                  key={item.id}
                  onClick={() => {
                    this.select(index);
                  }}
                >
                  {item.select
                    ? (
                    <View className='select-icon'></View>
                      )
                    : (
                    <View
                      className={`select ${
                        item.allergyMedicine ? 'allgy' : ''
                      }`}
                    ></View>
                      )}
                  {/* { item.select ? <View className="select-icon"></View> : <View className="select"></View> } */}
                  <Image
                    className='drug-icon'
                    src={item.headPic && item.headPic[0]}
                  ></Image>
                  <View className='left-context'>
                    <View className='context-top flex'>
                      <View
                        className={`type flex ${
                          item.prescription ? 'type-1' : 'type-2'
                        }`}
                      >
                        {item.prescription ? 'Rx' : 'OTC'}
                      </View>
                      {/* {item.existInPatientPrescription ? <View className="rx-bg"></View> : null} */}
                      {!item.allergyMedicine && item.haveBeenUsed
                        ? (
                        <View className='has-used'></View>
                          )
                        : null}
                      {!item.allergyMedicine &&
                      item.existInPatientPrescription
                        ? (
                        <View className='prescription'></View>
                          )
                        : null}
                      {item.allergyMedicine
                        ? (
                        <View className='allergy-tag'></View>
                          )
                        : null}
                    </View>
                    <View className='drug-name'>{item.name}</View>
                    <View className='tag'>{item.standard}</View>
                  </View>
                </View>
                  );
            })}
          </View>
          <View className='content-bottom flex'>
            <View
              className='bottom-item flex'
              onClick={() => {
                this.props.close();
              }}
            >
              再想想
            </View>
            <View
              className='bottom-item select flex'
              onClick={() => {
                this.confirm();
              }}
            >
              立即选择
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default RecommendList;
