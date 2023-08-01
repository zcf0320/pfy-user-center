import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import { getUserPdfImgList } from '@actions/common';
import { personalInsuranceCreate } from '@actions/insurance';
import { IStoreProps } from '@reducers/interface';
import './index.scss';

interface IProps { }
interface IState {
    imgs: Array<string>;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
}))
class Notify extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      imgs: []
    };
  }

  componentDidMount () {
    this.getImagesById();
  }

    config: Config = {
      navigationBarTitleText: '健康告知'
    }

    getImagesById () {
      const { rule } = this.props.insurance.insuranceDetail || {};
      const { healthNotice } = rule;
      getUserPdfImgList({
        pdfId: healthNotice
      }).then((res:any) => {
        this.setState({
          imgs: res
        });
      });
    }

    goNext () {
      const { router } = getCurrentInstance();
      const { type } = this.props.insurance.insuranceDetail || {};
      let url = '';
      // let planId = plans[selectPlanIndex].planId
      if (type === 1) {
        this.save(false);
        return;
      }

      type === 2 && (url = `/Insurance/pages/group/create/index?selectPlanIndex=${router?.params && router.params.selectPlanIndex}&id=${router?.params && router.params.id}`);
      Taro.navigateTo({
        url
      });
    }

    save (questionnaireHaveProblem: boolean) {
      const { personInsuranceInfo } = this.props.insurance;
      personInsuranceInfo.questionnaireHaveProblem = questionnaireHaveProblem;
      personalInsuranceCreate(personInsuranceInfo).then(res => {
        Taro.redirectTo({
          url: `/Insurance/pages/group/detail/index?id=${res}&type=1`
        });
      });
    }

    render () {
      const { imgs } = this.state;
      const { type } = this.props.insurance.insuranceDetail || {};
      return (
            <Page title='健康告知' showBack>
                <View className='page-notify flex'>
                <View className='content'>
                    { imgs.length && imgs.map((item) => {
                      return <Image key={item} src={item} className='img' mode='widthFix'></Image>;
                    })}
                    {/* <Image mode='widthFix' src={healthNotice}></Image> */}
                </View>
                <View className='bottom flex'>
                    <View className='bottom-item flex' onClick={() => {
                      if (type === 1) {
                        this.save(true);
                        return;
                      }
                      Taro.navigateBack({
                        delta: 1
                      });
                    }}
                    >部分情况有</View>
                    <View className='bottom-item flex active' onClick={() => {
                      this.goNext();
                    }}
                    >以上情况全无</View>
                </View>
            </View>
            </Page>
      );
    }
}
export default Notify;
