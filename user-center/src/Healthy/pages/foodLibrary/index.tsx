import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import './index.scss';

interface IProps {
  saveData: Function;
}
export default class FoodLibrary extends Component<IProps> {
  toSearchFood (e) {
    Taro.navigateTo({
      url: '/Healthy/pages/searchFood/index'
    });
    e.stopPropagation();
  }

  toFoodCause (type) {
    Taro.navigateTo({
      url: `/Healthy/pages/foodResult/index?cid=${type}`
    });
  }

  render () {
    return (
      <Page title='食物库' showBack>
        <View className='page-food flex'>
          <View
            className='search-content flex'
            onClick={this.toSearchFood.bind(this)}
          >
            <View className='search-left flex'>
              <View className='search-icon'></View>
              <Input
                className='search-input'
                placeholder='请输入食物名称'
                placeholderClass='placeholder'
              ></Input>
            </View>
            <View className='search-right'>搜索</View>
          </View>
          <View className='page-food-list flex'>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 1)}
            >
              <View className='item-img-1'></View>
              <View className='item-text'>水果类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 2)}
            >
              <View className='item-img-2'></View>
              <View className='item-text'>蔬菜类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 3)}
            >
              <View className='item-img-3'></View>
              <View className='item-text'>五谷根茎类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 4)}
            >
              <View className='item-img-4'></View>
              <View className='item-text'>蛋豆鱼肉类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 5)}
            >
              <View className='item-img-5'></View>
              <View className='item-text'>乳类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 6)}
            >
              <View className='item-img-6'></View>
              <View className='item-text'>零食点心类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 7)}
            >
              <View className='item-img-7'></View>
              <View className='item-text'>糖类</View>
            </View>
            <View
              className='page-food-item'
              onClick={this.toFoodCause.bind(this, 8)}
            >
              <View className='item-img-8'></View>
              <View className='item-text'>饮料类</View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
