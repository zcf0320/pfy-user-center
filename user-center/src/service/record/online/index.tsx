import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { onLineServiceList } from '@actions/user';
import { GET_ONLINE_SERVICE } from '@constants/user';
import EmptyBox from '@components/emptyBox';
import Page from '@components/page';
import VirtualItem from '../commodityExchange/component/virtualItem';
import './index.scss';

let pageNum = 1;
const pageSize = 10;
let loadAll = false;
interface IProps {
  getOnLineServiceList: Function;
  onLineList: Array<any>;
}
interface IState {
  title: string;
}
@connect(
  state => state.user,
  dispatch => ({
    getOnLineServiceList (params) {
      onLineServiceList(params).then((res: any) => {
        dispatch({
          type: GET_ONLINE_SERVICE,
          payload: res.records,
          pageNum: pageNum
        });
        if (pageSize > res.records.length) {
          loadAll = true;
        }
      });
    }
  })
)
class OnlineRecord extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      title: ''
    };
  }

  // componentDidMount () {
  //     pageNum = 1
  //     this.getRecordList()
  // }
  componentDidMount () {
    const { router } = getCurrentInstance();
    pageNum = 1;
    Taro.setNavigationBarTitle({
      title: (router?.params && router.params.title) || ''
    });
    this.setState({
      title: (router?.params && router.params.title) || ''
    });

    this.getRecordList();
  }

  getRecordList () {
    const { router } = getCurrentInstance();
    const params = {
      pageSize,
      pageNum,
      serviceRecordId: router?.params && router.params.serviceRecordId
    };
    pageNum === 1 && (loadAll = false);
    this.props.getOnLineServiceList(params);
  }

  tolower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getRecordList();
  }

  goResult (item) {
    const { resultId, score, pageCode } = item;
    const type = utils.appConfig.codeMap[pageCode];
    let url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newResult&code=${pageCode}&score=${score}`;
    type === 2 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/newResult&code=${pageCode}&score=${score}`);
    type === 5 &&
      (url = `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}healthyHeight/result&resultId=${resultId}&code=${pageCode}`);
    Taro.navigateTo({
      url
    });
  }

  goEvaluate (item) {
    const { commentId, serviceRecordId, itemName } = item;
    let url = `/service/evaluate/detail/index?serviceRecordId=${serviceRecordId}`;
    !commentId &&
      (url = `/service/evaluate/index/index?serviceRecordId=${serviceRecordId}&itemName=${itemName}`);
    Taro.navigateTo({
      url
    });
  }

  goCode (item) {
    const { recordId } = item;
    Taro.navigateTo({
      url: `/pages/user/appointment/detail/index?recordId=${recordId}`
    });
  }

  watch () {
    return !!this.props.onLineList.length;
  }

  render () {
    return (
      <Page showBack title={this.state.title}>
        <View className='page-service-record '>
          <ScrollView
            className={`service-list flex ${this.watch() ? '' : 'none'}`}
            scrollY
            onScrollToLower={this.tolower.bind(this)}
          >
            {this.props.onLineList.length
              ? (
                  this.props.onLineList.map(item => {
                    return (
                  <VirtualItem item={item} key={item.commentId}></VirtualItem>
                    );
                  })
                )
              : (
              <View className='empty flex'>
                <EmptyBox title='暂无记录'></EmptyBox>
              </View>
                )}
          </ScrollView>
        </View>
      </Page>
    );
  }
}
export default OnlineRecord;
