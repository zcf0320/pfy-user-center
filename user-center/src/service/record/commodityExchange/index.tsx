import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { getPhysicalGoodsRecords, getVirtualRecord } from '@actions/service';
import { GET_COMMODITY_EXCHANGE } from '@constants/service';
import EmptyBox from '@components/emptyBox';
import Page from '@components/page';
import ExchangeItem from './component/exchangeItem';
import VirtualItem from './component/virtualItem';
import './index.scss';

let pageNum = 1;
const pageSize = 10;
let loadAll = false;
interface IProps {
  service: any;
  getList: Function;
  getVirtualList: Function;
  onLineList: Array<any>;
}
interface IState {
  status: number;
}
@connect(
  state => state,
  dispatch => ({
    getList (params) {
      getPhysicalGoodsRecords(params).then(res => {
        dispatch({
          type: GET_COMMODITY_EXCHANGE,
          payload: res.records,
          pageNum: pageNum
        });
        if (pageSize > res.records.length) {
          loadAll = true;
        }
      });
    },
    getVirtualList (params) {
      getVirtualRecord(params).then(res => {
        dispatch({
          type: GET_COMMODITY_EXCHANGE,
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
class CommodityExchange extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 1
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();

    pageNum = 1;
    // 根据url的type 判断那个是虚拟产品 实物产品
    // 显示头部栏的内容
    Taro.setNavigationBarTitle({
      title: (router?.params && router.params.title) || ''
    });
    this.setState(
      {
        status: Number(router?.params && router.params.type) === 8 ? 2 : 1
      },
      () => {
        this.getRecordList();
      }
    );
  }

  getRecordList () {
    const { router } = getCurrentInstance();
    const params = {
      pageSize,
      pageNum,
      serviceRecordId: router?.params && router.params.serviceRecordId
    };
    pageNum === 1 && (loadAll = false);
    const { status } = this.state;
    status === 1 && this.props.getList(params);
    status === 2 && this.props.getVirtualList(params);
    // this.props.getList(params)
  }

  tolower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getRecordList();
  }

  watch () {
    return !!this.props.service.commodityExchangeList.length;
  }

  switchTab (val) {
    if (val === this.state.status) {
      return;
    }
    pageNum = 1;
    this.setState(
      {
        status: val
      },
      () => {
        this.getRecordList();
      }
    );
  }

  render () {
    const { router } = getCurrentInstance();
    return (
      <Page showBack title='商品兑换'>
        <View className='page-service-record'>
          <ScrollView
            className={`service-list flex ${this.watch() ? '' : 'none'}`}
            scrollY
            onScrollToLower={this.tolower.bind(this)}
          >
            {
              this.props.service.commodityExchangeList.length
                ? (
                    this.props.service.commodityExchangeList.map(item => {
                      // const {serviceInfoName, createTime, expressCompanyName, trackingNumber} = item || {}
                      return this.state.status === 1
                        ? (
                  <ExchangeItem
                    item={item}
                    key={item.id}
                    type={(router?.params && router.params.type) || ''}
                  ></ExchangeItem>
                          )
                        : (
                  <VirtualItem item={item} key={item.id}></VirtualItem>
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
export default CommodityExchange;
