import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import { SELECT_LIST } from '@constants/minApp';
import { connect } from 'react-redux';
import './index.scss';

interface IProps {
  item: any;
  serviceRecordId: string;
  cIndex?: number;
  rIndex: number;
  setList: Function;
  selectRecommendList: Array<any>;
  selectGroupList: Array<any>;
  buyNum: number;
}

@connect(
  state => state.minApp,
  dispatch => ({
    setList (data) {
      dispatch({
        type: SELECT_LIST,
        payload: data
      });
    }
  })
)
class Recommend extends Component<IProps> {
  selectItem = () => {
    const { disable, onSale, select, allergyMedicine } = this.props.item;
    const {
      cIndex,
      rIndex,
      selectRecommendList,
      selectGroupList,
      buyNum
    } = this.props;
    if (!onSale || disable || allergyMedicine) {
      return;
    }
    if (
      selectRecommendList.length + selectGroupList.length === buyNum &&
      !select
    ) {
      Taro.showToast({
        title: `最多选择${buyNum}类药品`,
        icon: 'none',
        duration: 3000
      });
      return;
    }
    this.props.setList({ cIndex, rIndex });
  };

  render () {
    const {
      name,
      standard,
      headPic,
      prescription,
      haveBeenUsed,
      allergyMedicine,
      disable,
      existInPatientPrescription,
      onSale,
      select
    } = this.props.item;
    const { cIndex } = this.props;
    return (
      <View className='item-detail flex'>
        <View
          className={`recommend-item flex ${
            disable || allergyMedicine ? 'disable' : ''
          }`}
          onClick={this.selectItem}
        >
          {!onSale
            ? (
            <View className='none-bg flex'>
              <View className='none-image'></View>
            </View>
              )
            : null}
          {cIndex === undefined
            ? (
            <View className='recommond-icon'></View>
              )
            : null}
          {select
            ? (
            <View className='select-icon'></View>
              )
            : (
            <View className={`select ${allergyMedicine ? 'allgy' : ''}`}></View>
              )}

          <View className='left flex'>
            <Image className='drug-icon' src={headPic && headPic[0]}></Image>
            <View className='left-context'>
              <View className='context-top flex'>
                <View
                  className={`type flex ${prescription ? 'type-1' : 'type-2'}`}
                >
                  {prescription ? 'Rx' : 'OTC'}
                </View>
                {allergyMedicine ? <View className='allergy-tag'></View> : null}
                {!allergyMedicine && haveBeenUsed
                  ? (
                  <View className='has-used'></View>
                    )
                  : null}
                {!allergyMedicine && existInPatientPrescription
                  ? (
                  <View className='prescription'></View>
                    )
                  : null}
              </View>
              <View className='drug-name'>{name}</View>
              <View className='tag'>{standard}</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Recommend;
