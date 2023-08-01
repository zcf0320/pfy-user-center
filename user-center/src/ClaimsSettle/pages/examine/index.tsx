import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import i18n from '@i18n/index';
import Page from '@components/page';
import { getNoticeUrl } from '@actions/claimsSettle';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  state: string; // 1待审核、2成功、3失败
  claimRecordId: string;
  claimType: string;
  failReason: string;

  policyNo: string;
  insuranceProductId: string;
  insurancePlanId: string;
  rightsId: string;
  claimNoticeState: string;
}

class Examine extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      state: '',
      claimRecordId: '',
      claimType: '',
      failReason: '',

      policyNo: '',
      insuranceProductId: '',
      insurancePlanId: '',
      rightsId: '',
      claimNoticeState: ''
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.insurance.examine });
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    if (router?.params && router.params.state) {
      this.setState({ state: router.params.state });
    }
    if (router?.params && router.params.claimRecordId) {
      this.setState({
        claimRecordId: router.params.claimRecordId
      });
    }
    if (router?.params && router.params.claimType) {
      this.setState({
        claimType: router.params.claimType
      });
    }
    if (router?.params && router.params.failReason) {
      this.setState({
        failReason: router.params.failReason
      });
    }

    if (router?.params && router.params.policyNo) {
      this.setState({
        policyNo: router.params.policyNo
      });
    }

    if (router?.params && router.params.claimNoticeState) {
      this.setState({
        claimNoticeState: router.params.claimNoticeState
      });
    }
  }

  getQueryVariable (variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }

  getNotice () {
    const claimRecordId = this.state.claimRecordId;
    getNoticeUrl(claimRecordId).then((res: any) => {
      if (res && res.length > 0) {
        Taro.previewImage({
          current: '', // 当前显示图片的http链接
          urls: res // 需要预览的图片http链接列表
        });
      } else {
        Taro.showToast({
          title: i18n.chain.insurance.noNotice,
          icon: 'none'
        });
      }
    });
  }

  render () {
    const {
      state,
      claimType,
      failReason,
      claimRecordId,
      policyNo,
      insurancePlanId,
      insuranceProductId,
      rightsId,
      claimNoticeState
    } = this.state;
    let url = '';
    let black = '';
    let gray = '';
    let title = '';
    if (claimType) {
      if (state === '1' || state === '4') {
        url = 'claims_exam-1.png';
        black = i18n.chain.insurance.claimExamine;
        gray = i18n.chain.insurance.claimWait;
        title = i18n.chain.insurance.underReview;
      } else if (state === '2') {
        url = 'claims_exam_success-1.png';
        black = i18n.chain.insurance.claimSettled;
        title = i18n.chain.insurance.claimSuccess;
      } else if (state === '3') {
        url = 'claims_exam_fail-1.png';
        black = i18n.chain.insurance.claimFail;
        gray = `${i18n.chain.recordPage.failureReason}: ${failReason &&
          decodeURI(failReason)}`;
        title = i18n.chain.insurance.claimFail;
      }
    } else {
      if (state === '1') {
        url = 'claims_exam.png';
        black = i18n.chain.insurance.underReview;
        gray = i18n.chain.insurance.claimWaitPatient;
        title = i18n.chain.insurance.reviewed;
      } else if (state === '2') {
        url = 'claims_exam_success.png';
        black = i18n.chain.insurance.claimSuccess;
        title = i18n.chain.insurance.auditSucceeded;
      } else if (state === '3') {
        url = 'claims_exam_fail.png';
        black = i18n.chain.insurance.claimApproved;
        gray = i18n.chain.insurance.returnApply;
        title = i18n.chain.insurance.auditFailed;
      }
    }

    title &&
      Taro.setNavigationBarTitle({
        title
      });
    return (
      <Page title={i18n.chain.insurance.examine} showBack>
        <View className='claims-examine'>
          <View>
            <View className='claims-examine-box'>

                <Image src={`${ossHost}${url}`} className='claims-examine-img' />

              <View className='claims-examine-333'>{black}</View>
              {state !== '2' && (
                <View className='claims-examine-999'>{gray}</View>
              )}
              <View
                className='claim-material'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/ClaimsSettle/pages/MaterialInfo/index?claimRecordId=${claimRecordId}`
                  });
                }}
              >
                <View>查看理赔资料</View>
                <Image className='arrow' src={`${ossHost}images/arrow-yellow-right.png`}></Image>
              </View>
            </View>
            {claimType && state !== '3' && (
              <View
                className='claims-examine-reset'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/Insurance/pages/details/index?policyNo=${policyNo}&insuranceType=1`
                  });
                }}
              >
                {i18n.chain.insurance.viewPolicy}
              </View>
            )}
            {claimType
              ? (state === '2' &&
              claimNoticeState === '2')
                  ? (
                <View className='claims-notice-disable'>理赔通知书更换中…</View>
                    )
                  : (
                <View
                  className='claims-notice'
                  onClick={() => {
                    this.getNotice();
                  }}
                >
                  {i18n.chain.insurance.viewClaim}
                </View>
                    )
              : null}
          </View>

          {claimType
            ? state === '3' && (
                <View
                  className='claims-examine-reset'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/ClaimsSettle/pages/stepOne/index?insuranceProductId=${insuranceProductId}&claimType=2&insurancePlanId=${insurancePlanId}&rightsId=${rightsId}&policyNo=${policyNo}&state=4&review=true`
                    });
                  }}
                >
                  {i18n.chain.button.resubmit}
                </View>
            )
            : state === '3' && (
                <View>
                  <View className='claims-examine-container'>
                    <View className='claims-examine-fail'>
                      {i18n.chain.recordPage.failureReason}
                    </View>
                    <View className='claims-examine-reason'>
                      <View className='claims-examine-dot'></View>
                      <View className='claims-examine-text'>
                        {failReason && decodeURI(failReason)}
                      </View>
                    </View>
                  </View>
                  <View
                    className='claims-examine-reset'
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/ClaimsSettle/pages/stepOne/index?insuranceProductId=${insuranceProductId}&insurancePlanId=${insurancePlanId}&rightsId=${rightsId}&policyNo=${policyNo}&state=4&review=true`
                      });
                    }}
                  >
                    {i18n.chain.button.resubmit}
                  </View>
                </View>
            )}
        </View>
      </Page>
    );
  }
}

export default Examine;
