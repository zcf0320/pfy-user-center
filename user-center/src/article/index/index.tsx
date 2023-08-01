import React, { Component } from 'react';
import Taro, { Config } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import Page from '@components/page';
// import _ from 'lodash';
import { getType, getList } from '@actions/article';
import utils from '@utils/index';
import EmptyBox from '@components/emptyBox';
import i18n from '@i18n/index';
import ArticleItem from '../components/articleItem';
import './index.scss';

interface IState {
  status: number;
  scrollHeight: number;
  showTop: boolean;
  articleType: Array<any>;
  articleList: Array<any>;
  articleListAll: boolean;
  showTags: boolean;
  // scrollPageTop: number;
  scrollTop:number;
}
const pageSize = 10;
let pageNum = 1;

class ArticleList extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      scrollHeight: 0,
      showTop: false,
      showTags: true,
      // scrollPageTop: 0,
      articleType: [],
      articleList: [],
      articleListAll: false,
      scrollTop: 0
    };
    this.scrollView = React.createRef();
  }

  componentDidMount () {
    pageNum = 1;

    this.getArticleType();
    // h5
    // if (utils.appConfig.isH5) {
    //   const scrollEle = this.scrollView.current; // 获取滚动元素
    //   scrollEle.addEventListener(
    //     'scroll',
    //     _.debounce(this.scrollPageH5.bind(this), 100)
    //   );
    // }
    const { windowHeight } = Taro.getSystemInfoSync() || {};
    const height = 130;
    this.setState({
      scrollHeight: windowHeight - 3 / 4 * height
    });
  }

  scrollView: React.RefObject<any>;

  config: Config = {
    navigationBarTitleText: i18n.chain.serviceList.service1
  };

  scrollPageH5 (e) {
    if (e.srcElement.scrollTop > 200) {
      this.setState({
        showTop: true
      });
    } else {
      this.setState({
        showTop: false
      });
    }
  }

  scrollPrev = 0;
  scrollNext = 0;
  scrollArr: Array<number> = [0, 0, 0];
  scrollPage (e: any) {
    if (e.target.scrollTop > 200) {
      this.setState({
        showTop: true
      });
    } else {
      this.setState({
        showTop: false
      });
    }
  }

  scrollToTop () {
    this.setState({
      scrollTop: Math.random()
    });
  }

  // getScrollHeight = () => {
  //   const { windowHeight } = Taro.getSystemInfoSync() || {};
  //   const height = 130;
  //   const vm = this;
  //   Taro.createSelectorQuery().select('#tagsView').boundingClientRect(function (rect) {
  //     console.log(rect);
  //     if (utils.appConfig.isH5) {
  //       vm.setState({
  //         scrollPageTop: rect.height + 10 + 48

  //       });
  //     } else {
  //       vm.setState({
  //         scrollPageTop: rect.bottom - (rect.height - rect.top) + 10 + 48
  //       });
  //     }
  //   }).exec();
  // };

  getArticleType () {
    getType().then((res: any) => {
      this.setState(
        {
          articleType: res
        },
        () => {
          this.getArticleList();
          // this.getScrollHeight();
        }
      );
    }).catch(() => {});
  }

  changeTab (status) {
    if (status === this.state.status) {
      return;
    }

    pageNum = 1;
    this.setState(
      {
        showTags: true,
        articleList: [],
        status,
        articleListAll: false
      },
      () => {
        this.getArticleList();

        // 更改scroll高度
        // this.getScrollHeight();

        // 回到顶部
        // this.scrollToTop();
      }
    );
  }

  // 获取列表
  getArticleList () {
    // 加载全部 就不需要加载了
    this.setState({
      articleListAll: false
    });
    const { status, articleType } = this.state;
    let tagIds = '';
    const { id, tags } = articleType[status] || {};
    tags.forEach((item: any) => {
      if (item.select) {
        tagIds += `${tagIds ? ',' : ''}${item.id}`;
      }
    });
    const params: any = {
      pageNum,
      pageSize,
      id: id
    };
    tagIds && (params.tagIds = tagIds);
    getList(params).then((res: any) => {
      this.setState({
        articleList: this.state.articleList.concat(res.records),
        articleListAll: pageSize > res.total
      });
    });
  }

  tolower () {
    if (this.state.articleListAll) {
      return;
    }
    pageNum++;
    this.getArticleList();
  }

  // 筛选tag
  selectTag (tagIndex) {
    const { status, articleType } = this.state;
    articleType[status].tags[tagIndex].select = !articleType[status].tags[
      tagIndex
    ].select;
    pageNum = 1;
    this.setState(
      {
        showTags: true,
        articleList: [],
        status,
        articleListAll: false
      },
      () => {
        this.getArticleList();
      }
    );
  }

  // 手指触摸变化
  touchMove (e) {
    if (this.scrollArr.length >= 3) {
      this.scrollArr.shift();
      this.scrollArr.push(e.touches[0].clientY);
    } else {
      this.scrollArr.push(e.touches[0].clientY);
    }
    this.changeTags();
  }

  // 开始位置
  touchStart (e) {
    this.scrollArr.shift();
    this.scrollArr.shift();
    this.scrollArr.push(e.touches[0].clientY);
    this.scrollArr.push(e.touches[0].clientY);
  }

  // 移动改变
  changeTags () {
    this.scrollPrev = this.scrollArr[1];
    this.scrollNext = this.scrollArr[2];
    const { showTags } = this.state;
    // const { windowHeight } = Taro.getSystemInfoSync() || {};
    if (showTags && this.scrollNext - this.scrollPrev <= -1) {
      this.setState({
        showTags: false

      });
    }
    if (!showTags && this.scrollNext - this.scrollPrev >= 1) {
      this.setState({
        showTags: true
      });
    }
  }

  onShareAppMessage () {
    return {
      title: i18n.chain.common.title,
      imageUrl:
        'https://senro-tree-sleep-1301127519.cos.ap-nanjing.myqcloud.com/img/%E5%AF%B0%E5%AE%87logo.png',
      path: '/article/index/index'
    };
  }

  render () {
    const { status, articleType, articleList, articleListAll } = this.state;
    return (
      <Page showBack title={i18n.chain.serviceList.service1}>
        <View className='page-article-list'>
          <View className='mask'></View>
          <View className='page-title'>
            <View className='tab-list'>
              {articleType.length > 0 &&
                articleType.map((item, index) => {
                  return (
                    <View
                      className={`tab-item flex ${
                        status === index ? 'active' : ''
                      }`}
                      key={item.id}
                      onClick={this.changeTab.bind(this, index)}
                    >
                      <Text>{item.name}</Text>
                      {status === index && <View className='line'></View>}
                    </View>
                  );
                })}
            </View>
          </View>
          <View id='tagsView' className='tags flex'>
            {articleType.length > 0 &&
              articleType[status].tags.map((item, index) => {
                return (
                  <View
                    className={`tag-item flex ${item.select ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => {
                      this.selectTag(index);
                    }}
                  >
                    {item.tagName}
                  </View>
                );
              })}
          </View>
          <ScrollView
            id='scrollView'
            ref={this.scrollView}
            scrollY
            style={{
              height: `${this.state.scrollHeight}px`
              // top: `${
              //   this.state.showTags ? this.state.scrollPageTop + 'px' : '48px'
              // }`
            }}
            scrollTop={this.state.scrollTop}
            onScroll={this.scrollPage.bind(this)}
            onScrollToLower={this.tolower.bind(this)}
            className='scroll-page'
            scrollWithAnimation
          >
            <View
              onTouchMove={this.touchMove.bind(this)}
              onTouchStart={this.touchStart.bind(this)}
              className='article-list flex'
            >
              {articleList.length
                ? (
                    articleList.map(item => {
                      return <ArticleItem key={item.id} info={item}></ArticleItem>;
                    })
                  )
                : (
                <View
                  className='empty flex'
                  style={{ height: `${this.state.scrollHeight}px` }}
                >
                  <EmptyBox title={i18n.chain.common.noArticle}></EmptyBox>
                </View>
                  )}
              { articleListAll
                ? (
                <Text className='load-text'>-{i18n.chain.common.noMore}-</Text>
                  )
                : null}
            </View>
          </ScrollView>
          {this.state.showTop && (
            <View
              className={`${utils.appConfig.isH5 ? 'goTop' : 'goTop weapp'}`}
              onClick={this.scrollToTop.bind(this)}
            ></View>
          )}
        </View>
      </Page>
    );
  }
}
export default ArticleList;
