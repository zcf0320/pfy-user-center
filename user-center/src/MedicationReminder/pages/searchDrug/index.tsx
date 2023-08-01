import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { SAVE_POST_DATA } from '@constants/medicationReminder';
import Page from '@components/page';
import SearchResult from '@components/searchResult';
import { searchDrug } from '@actions/common';
import { getDrugHistory } from '@actions/medicationReminder';
import './index.scss';

interface IProps {
  postData: any;
  saveData: Function;
}
interface IState {
  resultList: Array<any>;
  value: string;
  historyList: Array<string>;
  isShow: boolean;
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
class SearchDrug extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      resultList: [],
      value: '',
      historyList: [],
      isShow: true
    };
  }

  componentDidMount () {
    getDrugHistory().then((res: any) => {
      this.setState({
        historyList: res
      });
    });
  }

  getDrugList = () => {
    const { value } = this.state;
    if (!value) {
      return;
    }
    searchDrug({
      searchKey: value
    }).then((res: any) => {
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

  save (name) {
    const { router } = getCurrentInstance();
    const { postData } = this.props;
    postData.medicationDetailList[
      Number(router?.params && router.params.index)
    ].medicineName = name;
    console.log(postData);
    this.props.saveData(postData);
    Taro.navigateBack({
      delta: 1
    });
  }

  render () {
    const { resultList, historyList, isShow } = this.state;
    return (
      <Page showBack title='服药计划'>
        <View className='page-search-drug flex'>
          <View className='search-content flex'>
            <View className='search-left flex'>
              <View className='search-icon'></View>
              <Input
                className='search-input'
                placeholder='请输入药品名称进行查询'
                placeholderClass='placeholder'
                onInput={e => {
                  this.setState({ value: e.detail.value });
                }}
              ></Input>
            </View>
            <View
              className='search-right'
              onClick={() => {
                this.getDrugList();
              }}
            >
              搜索
            </View>
          </View>
          {!resultList.length
            ? (
            <View className='history'>
              <View className='history-title flex'>
                <View className='left'>历史购药记录</View>
                <View
                  className='right'
                  onClick={() => {
                    this.setState({ isShow: !isShow });
                  }}
                >
                  {isShow ? '收起' : '展开'}
                </View>
              </View>
              {isShow && historyList.length
                ? historyList.map(item => {
                  return (
                      <View
                        className='history-item flex'
                        key={item}
                        onClick={() => {
                          this.save(item);
                        }}
                      >
                        {item}
                      </View>
                  );
                })
                : null}
            </View>
              )
            : null}

          {resultList.length
            ? (
            <View className='search-result'>
              <SearchResult
                resultList={resultList}
                from='drug'
                callback={(item: any) => {
                  this.save(item.oldName);
                }}
              ></SearchResult>
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default SearchDrug;
