
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '@i18n/index';
import utils from '@utils/index';
import { getServiceList } from '@actions/user';
import { GET_EXCHANGEG_RECORD } from '@constants/user';
import EmptyBox from '@components/emptyBox';
import Page from '@components/page';
import './index.scss';

let pageNum = 1;
const pageSize = 10;
let loadAll = false;
interface IProps {
  getExchangeRecordList: Function;
  exchangeRecordList: Array<any>;
}

@connect(
  state => state.user,
  dispatch => ({
    getExchangeRecordList (params) {
      getServiceList(params).then((res: any) => {
        dispatch({
          type: GET_EXCHANGEG_RECORD,
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
class Record extends Component<IProps> {
  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.myServicePage.exchangeRecord });
    pageNum = 1;
    this.getRecordList();
  }

  getRecordList () {
    const params = {
      pageSize,
      pageNum,
      excludeFromProduct: true
    };
    pageNum === 1 && (loadAll = false);
    this.props.getExchangeRecordList(params);
  }

  tolower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getRecordList();
  }

  getTypeCode (rItem: any): string {
    const { type, code } = rItem;
    let text = i18n.chain.myServicePage.activationCode + ':';
    type === 2 && (text = i18n.chain.myServicePage.policyNo + ':');
    text += code;
    return text;
  }

  render () {
    return (
      <Page showBack title={i18n.chain.myServicePage.exchangeRecord}>
        <View className='page-service-record '>
          <ScrollView
            className='page-service-record'
            scrollY
            onScrollToLower={this.tolower.bind(this)}
          >
            {this.props.exchangeRecordList.length
              ? (
                  this.props.exchangeRecordList.map(item => {
                    return (
                  <View key={item.time}>
                    <View className='month'>{item.time}</View>
                    <View className='record-list flex'>
                      {item.records.map(rItem => {
                        return (
                          <View
                            className='record-item flex'
                            key={rItem.serviceRecordId}
                          >
                            <View className='top flex'>
                              <Text>{this.getTypeCode(rItem)}</Text>
                            </View>
                            <View className='type flex'>
                              {i18n.chain.myServicePage.exchangeService} | {rItem.itemName}
                            </View>
                            <View className='time'>
                              {utils.timeFormat(rItem.createTime, 'y.m.d h:m')}
                            </View>
                            {
                                rItem.serviceCreateBy === 1
                                  ? <View
                                      className={`user ${i18n.getLocaleName() === 'zh' ? '' : 'en'}`}
                                  ></View>
                                  : <View
                                      className={`tag ${i18n.getLocaleName() === 'zh' ? '' : 'en'}
                              }`}
                                  ></View>

                            }

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
                <EmptyBox title={i18n.chain.recordPage.noRecord}></EmptyBox>
              </View>
                )}
          </ScrollView>
        </View>
      </Page>
    );
  }
}
export default Record;
