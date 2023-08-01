import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import Page from '@components/page';
import { connect } from 'react-redux';
import { getAuditRecords } from '@actions/user';
import { GET_AUDIT_RECORDS } from '@constants/user';
import './index.scss';

interface IProps {
  getAuditRecords: Function;
  auditRecords: Array<any>;
}
interface IState {
  screenHeight: string;
}
const pageSize = 10;
let pageNum = 1;
let loadAll = false;
@connect(
  state => state.user,
  dispatch => ({
    getAuditRecords (params) {
      getAuditRecords(params).then(res => {
        dispatch({
          type: GET_AUDIT_RECORDS,
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
class AuditRecords extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      screenHeight: ''
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.user.auditRecord });
    this.getScrollHeight();
  }

  componentDidShow () {
    pageNum = 1;
    this.getAuditRecords();
  }

  // 获取审核记录列表
  getAuditRecords () {
    const params = {
      pageNum,
      pageSize
    };
    pageNum === 1 && (loadAll = false);
    this.props.getAuditRecords(params);
  }

  getScrollHeight () {
    const systemInfo = Taro.getSystemInfoSync();
    const { windowHeight } = systemInfo;
    const { isH5 } = utils.appConfig;
    let scrollHeight = windowHeight;
    scrollHeight = isH5 ? scrollHeight - 44 : scrollHeight;
    // iphonex 以上的安全区域
    !isH5 && utils.hasSafeArea() && (scrollHeight = scrollHeight - 68);
    this.setState({
      screenHeight: `${scrollHeight}px`
    });
  }

  scrollToLower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getAuditRecords();
  }

  render () {
    const scrollStyle = {
      height: this.state.screenHeight
    };
    return (
      <Page showBack title={i18n.chain.user.auditRecord}>
        <ScrollView
          scrollY
          scrollWithAnimation
          style={scrollStyle}
          onScrollToLower={this.scrollToLower.bind(this)}
        >
          <View className='page-audit'>
            {
              this.props.auditRecords.length
                ? (
                    this.props.auditRecords.map(item => {
                      return (
                  <View className='audit' key={item.checkRecordId}>
                    <View className='audit-item'>
                      <View
                        className={
                          item.state === 1
                            ? 'tip tip-now'
                            : item.state === 2
                              ? 'tip tip-yes'
                              : 'tip tip-no'
                        }
                      >
                        <Text className='tip-text'>
                          {item.state === 1
                            ? i18n.chain.insurance.reviewed
                            : item.state === 2
                              ? i18n.chain.insurance.pass
                              : i18n.chain.insurance.fail}
                        </Text>
                      </View>
                      <Text className='title'>
                        {item.serviceInfoName || '-'}
                      </Text>
                      <Text>
                        {i18n.chain.insurance.auditSubmissionTime}
                        {item.submitTime
                          ? utils.timeFormat(item.submitTime, 'y-m-d h:m')
                          : '-'}
                      </Text>
                      <Text className='content'>
                        {i18n.chain.insurance.approvalTime}
                        {item.checkTime
                          ? utils.timeFormat(item.checkTime, 'y-m-d h:m')
                          : '-'}
                      </Text>
                      {/* <Text>{utils.timeFormat(updateTime, 'y-m-d h:m')}</Text> */}
                    </View>
                    {item.state === 3 && (
                      <View className='audit-reason'>
                        <Text className='audit-reason-title'>失败原因</Text>
                        {item.failReasons.map(item1 => {
                          return (
                            <View key={item1} className='audit-reason-list'>
                              <Text className='audit-reason-item'>
                                {item1 || '-'}
                              </Text>
                            </View>
                          );
                        })}
                        <View className='audit-reason-marks'>
                          <Text className='marks-title'>{i18n.chain.medicationReminder.remark}:</Text>
                          <Text>{item.remark || '-'}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                      );
                    })
                  )
                : (
              <View className='audit-empty'>
                <Text className='empty-text'>{i18n.chain.insurance.noAuditRecord}</Text>
              </View>
                  )}
          </View>
        </ScrollView>
      </Page>
    );
  }
}

export default AuditRecords;
