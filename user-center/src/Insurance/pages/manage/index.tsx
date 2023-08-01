import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { getManageList } from '@actions/insurance';
import Page from '@components/page';
import EmptyBox from '@components/emptyBox';
import ManageItem from '../../component/manangeItem';
import './index.scss';

interface IState {
  tipState:boolean;
  manageList:Array<any>;
  loading:boolean;
}
class Manage extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      tipState: true,
      loading: true,
      manageList: []
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: i18n.chain.insurance.policyDetails
    });
    Taro.showLoading();
    this.setState({
      loading: true
    });
    getManageList({}).then((res:any) => {
      this.setState({
        manageList: res,
        loading: false
      }, () => {
        Taro.hideLoading();
      });
    });
  }

  render () {
    const { tipState, manageList, loading } = this.state;
    return (
      <Page title={i18n.chain.insurance.policyDetails} showBack>
        <View className='service-list bg-f6 flex'>
        {tipState
          ? (
          <View className='tips'>
          {i18n.chain.insurance.manageTips}
            <View
              className='icon-close'
              onClick={() => {
                this.setState({ tipState: false });
              }}
            ></View>
          </View>
            )
          : null}
          {manageList.length
            ? (
                manageList.map(item => {
                  return <ManageItem key={item.policyNo} item={item}></ManageItem>;
                })
              )
            : !loading && (
            <View className='empty flex'>
              <EmptyBox
                title={i18n.chain.insurance.noPolicy}
                showBtn
                url='/pages/user/service/exchange/index'
              ></EmptyBox>
            </View>
              )}
        </View>
      </Page>
    );
  }
}
export default Manage;
