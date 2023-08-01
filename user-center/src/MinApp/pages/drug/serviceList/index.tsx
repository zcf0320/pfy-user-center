import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import utils from '@utils/index';
import ServiceItem from '@components/serviceItem';
import { getDrugServiceList } from '@actions/user';
import { connect } from 'react-redux';
import { GET_SERVICE_LIST } from '@constants/user';
import EmptyBox from '../../../component/emptyBox';
import './index.scss';

interface IProps {
  getServiceList: Function;

  serviceList: Array<any>;
}
interface IState {
  status: number;
  scrollHeight: number;
}
let pageNum = 1;
let loadAll = false;
@connect(
  state => state.user,
  dispatch => ({
    getServiceList (params) {
      getDrugServiceList(params).then((res: any) => {
        res.length &&
          res.forEach(item => {
            item.state = params.state;
          });
        dispatch({
          type: GET_SERVICE_LIST,
          payload: res,
          pageNum
        });
      });
    }
  })
)
class ServiceList extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      status: 0,
      scrollHeight: 0
    };
  }

  componentDidMount () {
    const vm = this;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 140 : 96;
        vm.setState({
          scrollHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });

    pageNum = 1;
    this.getServiceList();
  }

  componentDidShow () {
    pageNum = 1;
    this.getServiceList();
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
        this.getServiceList();
      }
    );
  }

  // 获取列表
  getServiceList () {
    const params = {
      state: this.state.status
    };
    this.props.getServiceList(params);
  }

  tolower () {
    // 加载全部 就不需要加载了
    if (loadAll) {
      return;
    }
    pageNum++;
    this.getServiceList();
  }

  watchList () {
    return !this.props.serviceList.length;
  }

  render () {
    const { status } = this.state;
    return (
      <View className='page-service-list flex '>
        <View className='page-title'>
          <View className='title-content flex'>
            <Text
              className={`${status === 0 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 0)}
            >
              {i18n.chain.myServicePage.notUsed}
            </Text>
            <Text
              className={`${status === 1 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 1)}
            >
            {i18n.chain.myServicePage.used}
            </Text>
            <Text
              className={`${status === 2 ? 'active' : ''}`}
              onClick={this.changeTab.bind(this, 2)}
            >
            {i18n.chain.myServicePage.overdue}
            </Text>
            <View
              className={`line ${status === 1 ? 'active' : ''} ${
                status === 2 ? 'active1' : ''
              }`}
            ></View>
          </View>
        </View>
        <ScrollView
          scrollY
          style={{ height: `${this.state.scrollHeight}px`, width: '100%' }}
          // onScrollToLower={this.tolower.bind(this)}
        >
          <View
            className={`service-list ${
              this.watchList() ? 'none' : ''
            } `}
          >
            {this.props.serviceList.length
              ? (
                  this.props.serviceList.map(item => {
                    return (
                      <ServiceItem
                        key={item.serviceRecordId}
                        serviceDetail={item}
                        noAction={false}
                        state={status}
                      ></ServiceItem>
                    );
                  })
                )
              : (
              <View className='service-empty flex'>
                <EmptyBox
                  btnText={i18n.chain.myServicePage.toExchange}
                  showBtn
                  url='/pages/user/service/exchange/index'
                  title={i18n.chain.myServicePage.noService}
                  drug={false}
                ></EmptyBox>
              </View>
                )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default ServiceList;
