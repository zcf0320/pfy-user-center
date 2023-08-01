import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { ADD_PERSON, GET_INSURANCE_INFO } from '@constants/insurance';
import { groupInsuranceCreate, getInsuranceInfo } from '@actions/insurance';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import PolicyHolder from './policyHolder';
import Info from './info';
import Insured from './Insured';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps{
    addPeople: Function;
    getInfo: Function;
}
interface IState{
    status: number;
    agree: boolean;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  addPeople () {
    dispatch({
      type: ADD_PERSON
    });
  },
  getInfo (params) {
    return new Promise((resolve, reject) => {
      getInsuranceInfo(params).then(res => {
        dispatch({
          type: GET_INSURANCE_INFO,
          payload: res
        });
        // resolve(res)
      });
    });
  }
}))
class Create extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      // 被保人信息 1 手动录入 2 稍后pc
      status: 1,
      agree: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getInfo({ insuranceProductId: router?.params && router.params.id });
  }

  getPrice () {
    let price = '';
    const { router } = getCurrentInstance();
    const index = (router?.params && router.params.selectPlanIndex) || 0;
    const plans = this.props.insurance.insuranceDetail.plans;
    if (plans && plans.length) {
      price = plans[Number(index)].minPrice;
    }
    return price;
  }

  changeTab (index) {
    const { status } = this.state;
    if (status === index) {
      return;
    }
    this.setState({
      status: index
    });
  }

  watchData () {
    const { agree, status } = this.state;
    const { startDate, companyName, identificationNumber, qualificationDocumentsImg, contactPerson, officePhone, contactEmail, contactMobile, insuredInfos } = this.props.insurance.insuranceInfo;
    let result = false;
    if (agree && startDate && companyName && identificationNumber && qualificationDocumentsImg.length && officePhone && contactPerson && contactEmail && contactMobile) {
      result = true;
    }
    if (status === 1) {
      // 手输人员
      if (insuredInfos.length > 2) {
        insuredInfos.forEach((item) => {
          if (item) {
            result = result && true;
          } else {
            result = result && false;
          }
        });
      } else {
        result = result && false;
      }
    }
    return result;
  }

  save () {
    const { router } = getCurrentInstance();
    if (!this.watchData()) {
      return;
    }
    const { plans } = this.props.insurance.insuranceDetail || {};
    const { status } = this.state;
    const params = Object.assign(this.props.insurance.insuranceInfo);
    params.planId = plans[Number(router?.params && router.params.selectPlanIndex)].planId;
    params.insuranceProductId = router?.params && router.params.id;
    // 如果选择后端上传名单
    if (status === 1) {
      params.insuredInfos.forEach((item) => {
        item.sex = (item.sex === '男' ? 1 : 0);
      });
    }
    status === 2 && (delete params.insuredInfos);
    groupInsuranceCreate(params).then(res => {
      Taro.redirectTo({
        url: `/Insurance/pages/group/detail/index?id=${res}&type=2`
      });
    });
  }

  render () {
    const { status, agree } = this.state;
    const { rule } = this.props.insurance.insuranceDetail || {};
    const { insuranceClause, insuranceInstruction, privacyPolicy } = rule || {};
    const { insuredInfos } = this.props.insurance.insuranceInfo;
    return (
            <Page title='立即投保' showBack>
                <View className='page-group-create flex'>
                    <View className='content'>
                        {/* 投保内容 */}
                        <Info></Info>
                        <PolicyHolder></PolicyHolder>
                        <View className='product-insured'>
                            <View className='product-title flex'>
                                <Text>被保人信息</Text>
                                <View className='people-number'>
                                    被保人人数（至少3人）：{insuredInfos && insuredInfos.length}
                                </View>
                            </View>
                            <View className='tab flex'>
                                <View className={`tab-item flex ${status === 1 ? 'active' : ''}`} onClick={() => { this.changeTab(1); }}>手动录入</View>
                                <View className={`tab-item flex ${status === 2 ? 'active' : ''}`}onClick={() => { this.changeTab(2); }}>稍后PC端上传</View>
                            </View>
                            {
                                status === 1
                                  ? (
                                    <View>
                                        {this.props.insurance.insuranceInfo.insuredInfos.map((item, index) => {
                                          return <Insured key={index} peopleIndex={index} detail={item}></Insured>;
                                        })}
                                        <View className='add flex' onClick={this.props.addPeople.bind(this)}>+添加被保人</View>
                                    </View>
                                    )
                                  : null
                            }
                        </View>

                    </View>
                    <View className='bottom flex'>
                        <View className='bottom-top flex'>
                            <View className={`select ${agree ? 'active' : ''}`} onClick={() => {
                              this.setState({
                                agree: !agree
                              });
                            }}
                            >
                                <Image className='select-img' src={`${ossHost}images/select.png`}></Image>
                            </View>
                            <View className='proto'>
                                本人已确认并同意：
                                {insuranceInstruction && <Text className='link' onClick={
                                    () => {
                                      const url = insuranceInstruction.replace(/\?/g, '&');
                                      Taro.navigateTo({
                                        url: `/pages/webview/index?url=${url}`
                                      });
                                    }
                                }
                                >投保须知及声明</Text>}
                                {privacyPolicy && <Text className='link' onClick={
                                    () => {
                                      const url = privacyPolicy.replace(/\?/g, '&');
                                      Taro.navigateTo({
                                        url: `/pages/webview/index?url=${url}`
                                      });
                                    }
                                }
                                >｜隐私政策</Text>}
                                {insuranceClause && <Text className='link' onClick={
                                    () => {
                                      const url = insuranceClause.replace(/\?/g, '&');
                                      Taro.navigateTo({
                                        url: `/pages/webview/index?url=${url}`
                                      });
                                    }
                                }
                                >｜保险条款</Text>}
                            </View>
                        </View>
                        <View className='bottom-bottom flex'>
                            <View className='left flex'>
                                <Text className='money'>{this.getPrice()}</Text>
                            </View>
                            <View className={`right flex ${this.watchData() ? 'active' : ''}`} onClick={() => { this.save(); }}>确认投保</View>
                        </View>
                    </View>
                </View>
            </Page>
    );
  }
}
export default Create;
