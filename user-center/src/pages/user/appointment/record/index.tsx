import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import RecordItem from '@components/newRecordItem';
import { connect } from 'react-redux';
import { getRecordList } from '@actions/user';
import EmptyBox from '@components/emptyBox';
import Page from '@components/page';
import { GET_APPOINTMENT_RECORD_LIST } from '@constants/user';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

const pageSize = 10;
let pageNum = 1;
let loadAll = false;
interface IProps {
  getRecordList: Function;
  appointmentRecordList: Array<any>;
}
interface IState {
  status: number;
  emptyHeight: number;
  title: string;
}

@connect(
  state => state.user,
  dispatch => ({
    getRecordList (params) {
      getRecordList(params).then((res: any) => {
        dispatch({
          type: GET_APPOINTMENT_RECORD_LIST,
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
class AppointmentRecord extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      emptyHeight: 0,
      title: ''
    };
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    const vm = this;
    Taro.setNavigationBarTitle({
      title: (router?.params && router.params.title) || ''
    });
    this.setState({
      title: (router?.params && router.params.title) || ''
    });
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 44 : 0;
        vm.setState({
          emptyHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });
    // let status = Number(router?.params&&router.params.status) || 0
    // this.setState({
    //     status
    // }, () => {
    //     pageNum === 1
    this.getRecordList();
    // })
  }

  getRecordList () {
    const { router } = getCurrentInstance();
    const params = {
      serviceRecordId: router?.params && router.params.serviceRecordId,
      pageSize,
      pageNum
    };
    pageNum === 1 && (loadAll = false);
    this.props.getRecordList(params);
  }

  tolower () {
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getRecordList();
  }

  changeTab (status) {
    if (status === this.state.status) {
      return;
    }
    pageNum = 1;
    loadAll = false;
    this.setState(
      {
        status
      },
      () => {
        this.getRecordList();
      }
    );
  }

  render () {
    return (
      <Page showBack title={this.state.title}>
        <View className='page-appointment-record'>
          <ScrollView
            className='service-list flex'
            scrollY
            style={{ height: `${this.state.emptyHeight}px` }}
            onScrollToLower={this.tolower.bind(this)}
          >
            {this.props.appointmentRecordList.length
              ? (
                  this.props.appointmentRecordList.map(item => {
                    return (
                  <RecordItem
                    key={item.reserveId}
                    recordDetail={item}
                  ></RecordItem>
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
export default AppointmentRecord;
