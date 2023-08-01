import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { getRecordsList } from '@actions/mall';
import { GET_RECORDS_LIST } from '@constants/mall';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import EmptyBox from '@components/emptyBox';
import './index.scss';

interface IProps {
  getRecordsList: Function;
  recordsList: Array<any>;
}
interface IState {
  windowHeight: number;
}
const pageSize = 10;
let pageNum = 1;
let loadAll = false;
@connect(
  state => state.mall,
  dispatch => ({
    getRecordsList (params) {
      getRecordsList(params).then((res: any) => {
        dispatch({
          type: GET_RECORDS_LIST,
          payload: res.records,
          pageNum
        });
        if (pageSize > res.records.length) {
          loadAll = true;
        }
      });
    }
  })
)
class Records extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      windowHeight: 0
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.starMinePage.starCurrencyBill });
    pageNum = 1;
    const vm = this;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight } = res;
        let height = 0;
        utils.appConfig.isH5 && (height = 44);
        vm.setState({
          windowHeight: windowHeight - height
        });
      }
    });
    this.getRecordsList();
  }

  getRecordsList () {
    const params = {
      pageNum,
      pageSize
    };
    pageNum === 1 && (loadAll = false);
    this.props.getRecordsList(params);
  }

  toLower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getRecordsList();
  }

  render () {
    return (
      <Page showBack title={i18n.chain.starMinePage.starCurrencyBill}>
        <View className='page-mail-records'>
          <ScrollView
            className='page-mail-records'
            scrollY
            style={{ height: `${this.state.windowHeight}px` }}
            onScrollToLower={this.toLower.bind(this)}
          >
            {this.props.recordsList.length
              ? (
                  this.props.recordsList.map(item => {
                    return (
                  <View className='list' key={item.time}>
                    <View className='time'>{item.time}</View>
                    <View className='records-list flex'>
                      {item.records.length &&
                        item.records.map(rItem => {
                          return (
                            <View
                              className='record-item'
                              key={rItem.createTime * Math.random()}
                            >
                              <View className='record-item-content flex'>
                                <View className='left flex'>
                                  <View className='content flex'>
                                    <Text>{rItem.createCause}</Text>
                                    <Text className='date'>
                                      {utils.timeFormat(
                                        rItem.createTime,
                                        'y.m.d h:m'
                                      )}
                                    </Text>
                                  </View>
                                </View>
                                <Text
                                  className={`right ${
                                    rItem.type === 2 ? 'decrease' : ''
                                  }`}
                                >
                                  {rItem.type === 1 ? '+' : '-'}
                                  {rItem.score}.00
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  </View>
                    );
                  })
                )
              : (
              <View className='empty flex'>
                <EmptyBox title={i18n.chain.starMinePage.noBill}></EmptyBox>
              </View>
                )}
          </ScrollView>
        </View>
      </Page>
    );
  }
}
export default Records;
