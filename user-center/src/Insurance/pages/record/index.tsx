import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { connect } from 'react-redux';
import { getInsureRecord } from '@actions/insurance';
import EmptyBox from '@components/emptyBox';
import Page from '@components/page';
import {
  GET_INSURE_RECORD
} from '@constants/insurance';
import utils from '@utils/index';
import { IStoreProps } from '@reducers/interface';
import RecordItem from '../../component/recordItem';
import './index.scss';

const pageSize = 10;
let pageNum = 1;
let loadAll = false;
interface IProps {
    getList: Function;
}
interface IState {
    status: number;
    emptyHeight: number;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  getList (params) {
    getInsureRecord(params).then(res => {
      dispatch({
        type: GET_INSURE_RECORD,
        payload: res.records,
        pageNum
      });
      if (pageSize > res.records.length) {
        loadAll = true;
      }
    });
  }
}))
class ClaimRecord extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 1,
      emptyHeight: 0
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const vm = this;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 109 : 65;
        vm.setState({
          emptyHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });
    const status = Number(router?.params && router.params.status) || 2;
    this.setState({
      status
    }, () => {
      pageNum = 1;
      this.getRecordList();
    });
  }

    config: Config = {
      navigationBarTitleText: '投保记录'
    }

    getRecordList () {
      const params = {
        state: this.state.status,
        pageSize,
        pageNum
      };
      pageNum === 1 && (loadAll = false);
      this.props.getList(params);
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
      this.setState({
        status
      }, () => {
        this.getRecordList();
      });
    }

    render () {
      const { status } = this.state;

      return (
            <Page title='投保记录' showBack>
                <View className='page-appointment-record'>
                <View className='title'>
                    <View className='title-content flex'>
                        <Text className={status === 2 ? 'active' : ''} onClick={this.changeTab.bind(this, 2)}>可投保</Text>
                        <Text className={status === 1 ? 'active' : ''} onClick={this.changeTab.bind(this, 1)}>等待核保</Text>
                        <Text className={status === 3 ? 'active' : ''}onClick={this.changeTab.bind(this, 3)}>不可投保</Text>
                        <View className={`line ${status === 1 ? 'active' : ''} ${status === 3 ? 'active1' : ''}`}></View>
                    </View>
                </View>
                <ScrollView className='service-list flex'
                  scrollY
                  style={{ height: `${this.state.emptyHeight}px` }}
                  onScrollToLower={this.tolower.bind(this)}
                >
                    {this.props.insurance.insureRecord.length
                      ? this.props.insurance.insureRecord.map((item) => {
                        return (
                            <RecordItem key={item.id} recordDetail={item}></RecordItem>
                        );
                      })
                      : (
                        <View className='empty flex'>
                            <EmptyBox title='暂无记录'></EmptyBox>
                        </View>)}

                </ScrollView>
            </View>
            </Page>

      );
    }
}
export default ClaimRecord;
