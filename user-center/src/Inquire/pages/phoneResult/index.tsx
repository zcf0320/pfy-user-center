import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import utils from '@utils/index';
import Page from '@components/page';
import { getPhoneResult, mobileComment } from '@actions/inquire';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  result: any;
  isAjax: boolean;
  title: string;
  optionsList: Array<any>;
  selectOption: number;
}
class PhoneResult extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      result: null,
      isAjax: false,
      title: '',
      selectOption: 0,
      optionsList: [
        { rootName: '好评' },
        { rootName: '中评' },
        { rootName: '差评' }
      ]
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    getPhoneResult({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then(res => {
      Taro.setNavigationBarTitle({ title: res ? '问诊结果' : '问诊申请' });
      this.setState({
        result: res,
        isAjax: true,
        title: res ? '问诊结果' : '问诊申请'
      });
    });
  }

  selectOptions = index => {
    // this.state.optionsList.map((item,index) => {
    //     item.select = false
    // })
    // this.state.optionsList[index].select = true
    this.setState({
      selectOption: index + 1
    });
  };

  comment = () => {
    const { router } = getCurrentInstance();
    const { selectOption, result } = this.state;
    if (selectOption) {
      mobileComment({
        comment: selectOption,
        serviceRecordId: router?.params && router.params.serviceRecordId
      }).then(() => {
        result.commentLevel = selectOption;
        this.setState({
          result
        });
      });
    }
  };

  render () {
    const { result, title, isAjax, optionsList, selectOption } = this.state;
    const {
      patientDisease,
      patientHospitalDepartment,
      recommendedDrugName,
      commentLevel
    } = result || {};
    return (
      <Page showBack title={title}>
        {isAjax
          ? (
          <View>
            {result
              ? (
              <View className='page-phone-detail flex'>
                <View className='header flex'>
                  <View className='center flex'>
                    <Image src={`${ossHost}images/success_min.png`} className='success-icon'></Image>
                    <Text>电话问诊已结束</Text>
                  </View>
                </View>
                <View className='info'>
                  <View className='top'>您可能患的疾病为</View>
                  <View className='center'>{patientDisease}</View>
                  <View className='bottom flex'>
                    <View className='item'>
                      推荐科室：{patientHospitalDepartment}
                    </View>
                    <View className='item'>
                      推荐药物：{recommendedDrugName}
                    </View>
                  </View>
                </View>
                {commentLevel
                  ? (
                  <View className='success flex'>
                    <Text>评价成功</Text>
                    <View className='success-bg'>
                      <View className={`conment-img i-${commentLevel}`}></View>
                    </View>
                    <Text className='success-text'>
                      {optionsList[commentLevel - 1].rootName}
                    </Text>
                  </View>
                    )
                  : (
                  <View className='evaluate-content flex'>
                    <View className='title'>请您对这次问诊进行评价</View>
                    <View className='img-list flex'>
                      {optionsList.map((item, index) => {
                        return (
                          <View
                            className={`img-item flex item-${index} ${
                              selectOption === index + 1 ? 'active' : ''
                            }`}
                            key={item.rootName}
                            onClick={() => {
                              this.selectOptions(index);
                            }}
                          >
                            <View className={`img i-${index}`}></View>
                            <View className='root-name flex'>
                              {item.rootName}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                    <View
                      className={`sure flex ${selectOption ? 'active' : ''}`}
                      onClick={this.comment}
                    >
                      确认
                    </View>
                  </View>
                    )}
              </View>
                )
              : (
              <View className='page-phone-result flex'>
                <View className='top'>
                  此次服务仅为健康咨询，并非医疗建议。您若有任何身体不适，建议至最近的医院就诊，感谢！
                </View>
                <View className='bg'></View>
                <View className='tips'>问诊申请已提交</View>
                <View className='tips-text'>
                  预计24小时内医生会致电给您，请留意手机来电
                </View>
              </View>
                )}
          </View>
            )
          : null}
      </Page>
    );
  }
}
export default PhoneResult;
