import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { IStoreProps } from '@reducers/interface';
import * as inquireApi from '@actions/inquire';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import SearchInput from '../../component/searchInput';
import SearchHistory from '../../component/searchHistory';
import SearchResult from '../../component/searchResult';
import { ResultItem } from '../../types';

import { commonQuestion } from '../../common';
import './index.scss';

interface IProps {
  actions: any;
  reducers: any;
}

interface IState {
  historyList: Array<string>;
  resultList: Array<ResultItem>;
  searchState: boolean;
  keyword: string;
}

type PropsType = IStoreProps & IProps;

@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: {
          recordList: state.inquire.recordList
        }
      }
    );
  },
  dispatch => {
    return Object.assign(
      {},
      {
        actions: bindActionCreators(actions, dispatch)
      }
    );
  }
)
class Search extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      historyList: [],
      resultList: [],
      searchState: false,
      keyword: ''
    };
  }

  componentDidMount () {
    // 从缓存中取搜索历史记录
    const historyList = Taro.getStorageSync('searchHistory') || [];
    this.setState({
      historyList
    });
  }

  // 搜索历史改变
  changeHistory = (list: Array<string>) => {
    this.setState(
      {
        historyList: list
      },
      () => {
        Taro.setStorageSync('searchHistory', list);
      }
    );
  };

  // 搜索症状
  searchResult = (keyword: string) => {
    inquireApi
      .searchDisease({
        searchKey: keyword
      })
      .then((res: any) => {
        // 匹配关键字高亮
        res.forEach((value: ResultItem) => {
          const reg = new RegExp(keyword, 'g'); // 定义正则
          value.text = value.name;
          value.name = value.name.replace(
            reg,
            `<div class="keyword">${keyword}</div>`
          ); // 进行替换，并定义高亮的样式
        });
        this.setState({
          resultList: res,
          searchState: true,
          keyword
        });
      });
  };

  // 关键词改变
  keywordChange = (keyword: string) => {
    if (keyword) {
      this.searchResult(keyword);
    } else {
      this.setState({
        resultList: [],
        searchState: true,
        keyword
      });
    }
  };

  // 确认症状跳转智能问诊页面
  navigateToIM = (item: ResultItem) => {
    const { recordList } = this.props.reducers;
    inquireApi
      .commitDisease({
        diseaseId: item.id
      })
      .then((res: any) => {
        recordList.push({
          content: {
            time: new Date().getTime(),
            sendor: 1,
            type: 1,
            localType: [],
            msg: `选择症状为: ${item.text}`
          }
        });
        const { recordId, question, questionId } = res;
        // 继续问诊
        this.props.actions.changeRecordList(
          commonQuestion(recordList, {
            chartRecordId: recordId,
            diagnoseType: 1,
            content: {
              sendor: 2,
              type: 1,
              msg: question,
              questionId
            }
          })
        );
        // 返回问诊页面
        Taro.navigateBack({
          delta: 2
        });
        // Taro.navigateTo({
        //     url: '/Inquire/pages/im/index?first=false'
        // })
      });
  };

  render () {
    const { historyList, resultList, searchState, keyword } = this.state;
    return (
      <Page showBack title='症状搜索'>
        <View className='search'>
          <View className='input'>
            <SearchInput
              searchResult={this.searchResult}
              changeHistory={this.changeHistory}
              keyword={keyword}
              keywordChange={this.keywordChange}
            />
          </View>
          <View className='history'>
            {!searchState
              ? (
              <SearchHistory
                setModal={val => {
                  this.props.actions.setModal(val);
                }}
                historyList={historyList}
                changeHistory={this.changeHistory}
                historyClick={this.keywordChange}
              />
                )
              : (
              <SearchResult
                resultList={resultList}
                callback={this.navigateToIM}
                changeHistory={this.changeHistory}
              />
                )}
          </View>
        </View>
      </Page>
    );
  }
}
export default Search;
