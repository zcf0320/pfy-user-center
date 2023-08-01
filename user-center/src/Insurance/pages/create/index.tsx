import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { IStoreProps } from '@reducers/interface';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { personalInsuranceCreate, getInsuranceInfo, countPrice } from '@actions/insurance';
import { SET_PROSON_INSURANCE_INFO, GET_INSURANCE_INFO } from '@constants/insurance';
import Page from '@components/page';
import Info from './info';
import Insured from './Insured';
import Beneficiary from './Beneficiary';
import './index.scss';

interface IProps {
    getConfigShip: Function;
    getConfigJob: Function;
    getAllowance: Function;
    getProviceList: Function;
    getQuestionList: Function;
    setSubInfo: Function;
    setQuestionList: Function;
    setCities: Function;
    getInfo: Function;
    setPersonInsuranceInfo: Function;
}
// import Info from '../group/create/info'
type PropsType = IStoreProps & IProps
interface IState {
    agree: boolean;
    priceText: string;
}
@connect(state => Object.assign({}, state), dispatch => ({
  setPersonInsuranceInfo (data) {
    dispatch({
      type: SET_PROSON_INSURANCE_INFO,
      payload: data
    });
  },
  getInfo (params) {
    return new Promise((resolve, reject) => {
      getInsuranceInfo(params).then(res => {
        const { insuranceProductId } = params;
        const { haveBeneficiary, insuredFileList } = res;
        if (haveBeneficiary) {
          dispatch({
            type: SET_PROSON_INSURANCE_INFO,
            payload: {
              beneficiaryList: [
                {
                  relationship: 1,
                  beneficiaryCertificateType: 1
                }
              ]
            }
          });
        }
        dispatch({
          type: SET_PROSON_INSURANCE_INFO,
          payload: {
            insuredFileList,
            insuranceProductId
          }
        });
        // res.insuranceProductId = params.insuranceProductId
        dispatch({
          type: GET_INSURANCE_INFO,
          payload: res
        });
      });
    });
  }
}))
class Create extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      agree: false,

      priceText: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    // 默认选本人
    this.props.getInfo({ insuranceProductId: router?.params && router.params.id });
    this.props.setPersonInsuranceInfo({
      startDate: new Date().getTime() + 2 * 24 * 3600 * 1000
    });
  }

  componentDidShow () {
    this.getPrice();
  }

  // 判断是否可以进行下一步
  watchNext () {
    let result = false;
    const { agree } = this.state;
    const { beneficiaryList, jobName, insuredCodeNumber, policyHolderName, insuredAge, policyholderAge, insuredFileList, insuredSex, policyHolderCodeNumber, policyHolderMobile, cityId, hasSocialSecurity } = this.props.insurance.personInsuranceInfo || {};
    // const { policyHolderName, policyHolderMobile, policyHolderIdCard, insuredSex, insuredAge, hasSocialSecurity, cityId, agree, insuredName, insuredIdCard } = this.state
    if (agree && policyHolderName && insuredCodeNumber && policyHolderCodeNumber && insuredAge && policyholderAge && (insuredSex !== undefined) && policyHolderMobile && cityId && jobName && hasSocialSecurity !== undefined) {
      result = true;
    }
    beneficiaryList && beneficiaryList.some((item:any) => {
      const { relationship, beneficiaryName, beneficiaryCodeNumber, beneficiaryMobile, benefitRatio } = item;
      if (!relationship || !beneficiaryName || !beneficiaryCodeNumber || !beneficiaryMobile || !benefitRatio) {
        result = false;
        return true;
      } else {
        return false;
      }
    });
    insuredFileList && insuredFileList.some(item => {
      const { imgUrls, type } = item;
      if (imgUrls) {
        // 身份证只能有两张
        if (type === 1) {
          if (imgUrls.length !== 2) {
            result = false;
            return true;
          }
        } else {
          if (!imgUrls.length) {
            result = false;
            return true;
          }
        }
        return result;
      } else {
        result = false;
        return true;
      }
    });
    return result;
  }

  // 获取保费价格
  async getPrice () {
    const { router } = getCurrentInstance();
    const vm = this;
    const { plans } = vm.props.insurance.insuranceDetail || {};
    const { insuredJob, insuredAge, insuredSex } = vm.props.insurance.personInsuranceInfo || {};

    let text = '';
    if (plans.length) {
      const index = (router?.params && router.params.selectPlanIndex) || 0;
      text = plans[Number(index)].minPrice;
    }
    if (insuredAge && insuredSex !== undefined && insuredJob) {
      await countPrice({
        age: insuredAge,
        sex: insuredSex,
        planId: plans[Number(router?.params && router.params.selectPlanIndex)].planId,
        jobCode: insuredJob
      }).then(res => {
        text = `${res}元`;
        vm.setState({
          priceText: text
        });
      }).catch(() => {});
    }
    vm.setState({
      priceText: text
    });
    return text;
  }

    save = () => {
      const { router } = getCurrentInstance();
      // 判断是否
      if (!this.watchNext()) {
        return;
      }
      const { personInsuranceInfo } = this.props.insurance;
      const { insuredEmail, insuredMobile, policyHolderEmail, policyHolderMobile, beneficiaryList, policyHolderCertificateType, policyHolderCodeNumber, insuredCodeNumber, insuredCertificateType } = personInsuranceInfo || {};
      let error = '';

      if (insuredEmail) {
        !utils.checkMail(insuredEmail) && (error = '请输入正确的被投保人邮箱');
      }
      if (insuredMobile) {
        !utils.checkPhone(insuredMobile) && (error = '请输入正确的被投保人手机号');
      }
      if (policyHolderEmail) {
        !utils.checkMail(policyHolderEmail) && (error = '请输入正确的投保人邮箱');
      }
      if (policyHolderMobile) {
        !utils.checkPhone(policyHolderMobile) && (error = '请输入正确的投保人手机号');
      }
      if (policyHolderCertificateType === 1 && policyHolderCodeNumber) {
        !utils.checkIdCard(policyHolderCodeNumber) && (error = '请输入正确的投保人身份证号码');
      }
      if (insuredCertificateType === 1 && insuredCodeNumber) {
        !utils.checkIdCard(insuredCodeNumber) && (error = '请输入正确的被保人身份证号码');
      }

      if (beneficiaryList) {
        let count = 0;
        beneficiaryList.forEach((item) => {
          count += Number(item.benefitRatio);
        });
        count !== 100 && (error = '受益人比例和必须是100%');
      }
      if (error) {
        Taro.showToast({
          title: error,
          icon: 'none',
          duration: 3000
        });
        return;
      }
      // const { personInsuranceInfo } = this.props.insurance
      const { rule, plans } = this.props.insurance.insuranceDetail || {};
      const { questionId, healthNotice } = rule;
      personInsuranceInfo.planId = plans[Number(router?.params && router.params.selectPlanIndex)].planId;
      if (questionId || healthNotice) {
        let url = '';
        questionId && (url = `/Insurance/pages/healthQuestion/index?id=${questionId}`);
        healthNotice && (url = `/Insurance/pages/notify/index?id=${router?.params && router.params.id}&selectPlanIndex=${router?.params && router.params.selectPlanIndex}`);
        Taro.navigateTo({
          url
        });
        return;
      }
      personalInsuranceCreate(personInsuranceInfo).then(res => {
        Taro.redirectTo({
          url: `/Insurance/pages/group/detail/index?id=${res}&type=1`
        });
      });
    }

    addBeneficiary = () => {
      const { personInsuranceInfo } = this.props.insurance;
      personInsuranceInfo.beneficiaryList.push({
        relationship: 1,
        beneficiaryCertificateType: 1
      });
      this.props.setPersonInsuranceInfo(personInsuranceInfo);
    }

    render () {
      const { rule, haveBeneficiary } = this.props.insurance.insuranceDetail || {};
      const { jobName, beneficiaryList, startDate } = this.props.insurance.personInsuranceInfo || {};
      const { userNotificationList } = rule || {};
      const { agree, priceText } = this.state;
      return (
            <Page title='立即投保' showBack>
                <View className='page-create flex'>
                    <View className='content flex'>
                        <View className='start-time flex'>
                            <View className='label'>起保日期</View>
                            <View className='right placeholder'>{utils.timeFormat(startDate, 'y/m/d')}</View>
                        </View>
                        <Info getPrice={() => this.getPrice()}></Info>
                        <Insured jobName={jobName} getPrice={() => this.getPrice()}></Insured>
                        {
                            (beneficiaryList && beneficiaryList.length)
                              ? beneficiaryList.map((_item, index) => {
                                return <Beneficiary key={index} index={index}></Beneficiary>;
                              })
                              : null
                        }
                        {haveBeneficiary ? <View className='add-people flex' onClick={() => { this.addBeneficiary(); }}>+添加受益人</View> : null}
                    </View>
                    <View className='footer'>
                        <View className='footer-top flex'>
                            <View className={`select flex ${agree ? 'active' : ''}`} onClick={() => {
                              this.setState({
                                agree: !agree
                              });
                            }}
                            >
                                {agree ? <View className='dot'></View> : null}
                            </View>
                            <View className='proto'>
                                本人已确认并同意：
                                {
                                    userNotificationList && userNotificationList.length && userNotificationList.map((item, index) => {
                                      return <Text className='link' key={item.id} onClick={
                                            () => {
                                              Taro.navigateTo({
                                                url: `/Insurance/pages/previewPdf/index?id=${item.id}&name=${item.name}`
                                              });
                                            }
                                        }
                                      >{`${index ? '｜' : ''}${item.name}`}</Text>;
                                    })
                                }

                            </View>
                        </View>
                        <View className='footer-bottom flex'>
                            <View className='bottom-left flex'>
                                    <View className='money'>{priceText }</View>
                            </View>
                            <View className={`bottom-right flex ${this.watchNext() ? 'active' : ''}`} onClick={this.save}>
                                确认投保
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
      );
    }
}
export default Create;
