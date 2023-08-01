import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import Page from '@components/page';
import EmptyBox from '@components/emptyBox';
import utils from '@utils/index';
import { getArticle } from '@actions/minApp';
import ArticleItem from '../../component/articleItem';
import './index.scss';

interface IState {
  title: string;
  scrollHeight: number;
  articleList:Array<any>;
  pageNum:number;
  loadAll:boolean;
}
const pageSize = 10;
class Article extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      scrollHeight: 0,
      articleList: [],
      pageNum: 1,
      loadAll: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const title = decodeURI((router?.params && router.params.title) || '');
    Taro.setNavigationBarTitle({
      title
    });
    this.setState({
      title
    });
    const vm = this;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 44 : 0;
        vm.setState({
          scrollHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });
    this.getList();
  }

  getList () {
    const { router } = getCurrentInstance();
    let pageNum = this.state.pageNum;
    const params = {
      pageSize,
      pageNum: pageNum++,
      typeId: router?.params && router.params.id
    };
    getArticle(params).then((res: any) => {
      const data = this.state.articleList.concat(res.records);
      this.setState({
        pageNum: pageNum++,
        articleList: data
      });
      if (pageSize > res.records.length) {
        this.setState({
          loadAll: true
        });
      }
    });
  }

  toLower () {
    if (this.state.loadAll) {
      return;
    }
    this.getList();
  }

  render () {
    const { title, scrollHeight, articleList, loadAll } = this.state;
    return (
      <Page showBack title={title}>
        <View className='page-min-app-article'>
          <ScrollView
            scrollY
            style={{ height: `${scrollHeight}px` }}
            onScrollToLower={() => { this.toLower(); }}
          >
            {articleList.length
              ? articleList.map(item => {
                return (
                    <ArticleItem item={item} key={item.articleId}></ArticleItem>
                );
              })
              : <View
                  className='empty flex'
                  style={{ height: `${scrollHeight}px` }}
              >
              <EmptyBox title={i18n.chain.common.noArticle}></EmptyBox>
            </View>}
              { loadAll
                ? (
                <View className='load-text'>-{i18n.chain.common.noMore}-</View>
                  )
                : null}
          </ScrollView>
        </View>
      </Page>
    );
  }
}
export default Article;
