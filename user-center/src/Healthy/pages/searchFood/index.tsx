import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { SAVE_POST_DATA } from '@constants/medicationReminder';
import Page from '@components/page';
import SearchResult from '@components/searchResult';
import { getFoodListByName } from '@actions/healthy';
import './index.scss';

interface IProps {
  postData: any;
  saveData: Function;
}
interface IState {
  resultList: Array<any>;
  value: string;
}
@connect(
  state => Object.assign({}, state.medicationReminder),
  dispatch => ({
    saveData (data) {
      dispatch({
        type: SAVE_POST_DATA,
        payload: data
      });
    }
  })
)
class SearchFood extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      resultList: [],
      value: ''
    };
  }

  getFoodList = () => {
    const { value } = this.state;
    if (!value) {
      return;
    }
    getFoodListByName(value).then((res: any) => {
      res.forEach(item => {
        const reg = new RegExp(value, 'g'); // 定义正则
        item.oldName = item.name;
        item.name = item.name.replace(
          reg,
          `<div class="keyword">${value}</div>`
        ); // 进行替换，并定义高亮的样式
      });
      this.setState({
        resultList: res
      });
    });
  };

  save (name, id) {
    const { postData } = this.props;
    postData.foodName = name;
    this.props.saveData(postData);
    Taro.navigateTo({
      url: `/Healthy/pages/foodResult/index?pid=${id}`
    });
    // Taro.navigateBack({
    //     delta: 1
    // })
  }

  render () {
    const { resultList } = this.state;
    return (
      <Page showBack title='食物库'>
        <View className='page-search-drug flex'>
          <View className='search-content flex'>
            <View className='search-left flex'>
              <View className='search-icon'></View>
              <Input
                className='search-input'
                placeholder='请输入食物名称'
                placeholderClass='placeholder'
                focus
                onInput={e => {
                  this.setState({ value: e.detail.value });
                }}
              ></Input>
            </View>
            <View
              className='search-right'
              onClick={() => {
                this.getFoodList();
              }}
            >
              搜索
            </View>
          </View>

          {resultList.length
            ? (
            <View className='search-result'>
              <SearchResult
                resultList={resultList}
                from='drug'
                callback={(item: any) => {
                  this.save(item.name, item.id);
                }}
              ></SearchResult>
            </View>
              )
            : (
            <View className='no-result flex'>
              <View className='no-result-img'></View>
              {/* <View className="no-result-text">暂无相关搜索</View> */}
            </View>
              )}
        </View>
      </Page>
    );
  }
}
export default SearchFood;
