import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import { getValidDate } from '@actions/claimsSettle';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IState {
  state: string; // 1待审核、2成功、3失败
  day: string;
}

class Examine extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      state: '',
      day: ''
    };
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    const state = (router?.params && router.params.state) || '';
    getValidDate({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then((res:any) => {
      this.setState({
        state: state,
        day: res
      });
    });
  }

  render () {
    const { router } = getCurrentInstance();
    const { state, day } = this.state;
    let url;
    let black;
    let gray;
    let title = '';
    if (state === '1') {
      url = 'claims_exam.png';
      black = '您的理赔申请已提交成功，正在审核中...';
      gray = '预计1-3个工作日内给您答复，请耐心等待';
      title = '待审核';
    } else if (state === '2') {
      url = 'claims_exam_success.png';
      gray = `请在理赔成功后${day}天内进行取药，过期则权益失效，需要重新理赔`;
      black = '审核成功';
      title = '审核成功';
    } else if (state === '3') {
      url = 'claims_exam_fail.png';
      black = '您提交的理赔申请审核失败';
      gray = '可返回重新申请';
      title = '审核失败';
    }
    title && Taro.setNavigationBarTitle({
      title
    });
    return (
      <Page title={title} showBack>
        <View className='claims-examine'>
          <View>
            <View className='claims-examine-box'>
              <Image src={`${ossHost}${url}`} className='claims-examine-img' />
              <View className='claims-examine-333'>{black}</View>
                <View className='claims-examine-999'>{gray}</View>
            </View>
          </View>
          <View className='claims-examine-reset' onClick={() => {
            Taro.redirectTo({
              url: `/MinApp/pages/drug/detailList/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
            });
          }}
          >立即取药</View>

        </View>
      </Page>
    );
  }
}

export default Examine;
