import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import * as claimsApi from '@actions/claimsSettle';
import * as actions from '../../actions';
import './index.scss';

interface IProps {
  actions: any;
}

interface IState {
  list: any;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => {
    return Object.assign(
      {},
      {
        actions: bindActionCreators(actions, dispatch)
      }
    );
  }
)
class StepOne extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      list: {}
    };
  }

  componentDidMount () {
    this.getList();
  }

  getList () {
    const { router } = getCurrentInstance();
    const params = {
      insuranceProductId: router?.params && router.params.insuranceProductId,
      rightsId: router?.params && router.params.rightsId
    };
    claimsApi.getInsuranceRightsInfo(params).then(res => {
      this.setState({ list: res });
    });
  }

  render () {
    const { router } = getCurrentInstance();
    const { list } = this.state;
    let flag = false;
    if (
      router?.params && router.params.review === 'true' &&
      router?.params && router.params.state === '4'
    ) {
      flag = true;
    }
    return (
      <Page title='我要理赔' showBack>
        <View className='claims-step1'>
          <View className='claims-step1-top'>
            <View className='claims-step1-top-box'>
              <View className='claims-step1-top-left'>承保职业</View>
              <View className='claims-step1-top-right'>{list.suitJob}</View>
            </View>
            <View className='claims-step1-top-box'>
              <View className='claims-step1-top-left'>保障期限</View>
              <View className='claims-step1-top-right'>
                {list.insuranceTime}
              </View>
            </View>
            <View className='claims-step1-top-box'>
              <View className='claims-step1-top-left'>投保年龄</View>
              <View className='claims-step1-top-right'>{list.suitAge}</View>
            </View>
            <View className='claims-step1-top-box'>
              <View className='claims-step1-top-left'>保障范围</View>
              <View className='claims-step1-top-right'>{list.coverage}</View>
            </View>
          </View>
          <View className='claims-step1-btm'>
            <View className='claims-step1-btm-title claims-ellipsis'>
              {list.rightsName}
            </View>
            <View className='claims-step1-btm-content'>
              <RichText nodes={list.rightsIntroduction} />
            </View>
          </View>
          <View
            className={`claims-step1-btn ${
              flag ? 'claims-step1-active' : 'claims-step1-disable'
            }`}
            onClick={() => {
              if (flag) {
                this.props.actions.initForm();
                Taro.navigateTo({
                  url: `/ClaimsSettle/pages/step/index?insuranceProductId=${router?.params && router.params.insuranceProductId}&insurancePlanId=${router?.params && router.params.insurancePlanId}&rightsId=${router?.params && router.params.rightsId}&policyNo=${router?.params && router.params.policyNo}&claimType=${router?.params && router.params.claimType}`
                });
              }
            }}
          >
            申请理赔
          </View>
        </View>
      </Page>
    );
  }
}

export default StepOne;
