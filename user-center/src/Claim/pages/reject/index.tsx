import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import * as claimApi from '@actions/claim';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  reasonList: Array<string>;
  remark: string;
}
class Home extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      reasonList: [],
      remark: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    router?.params && router.params.serviceRecordId &&
      claimApi
        .getReason({
          serviceRecordId: router.params.serviceRecordId
        })
        .then((res: any) => {
          this.setState({
            reasonList: res.reasonList || [],
            remark: res.remark
          });
        });
    router?.params && router.params.claimRecordId &&
      claimApi
        .getClaimReason({
          claimRecordId: router.params.claimRecordId
        })
        .then((res: any) => {
          this.setState({
            reasonList: res.reasonList || [],
            remark: res.remark
          });
        });
  }

  backSubmit = () => {
    const { router } = getCurrentInstance();
    Taro.redirectTo({
      url: `/ClaimsSettle/pages/step/index?serviceRecordId=${router?.params && router.params.serviceRecordId}&again=1&policyNo=${router?.params && router.params.policyNo}`
    });
  };

  render () {
    const { reasonList, remark } = this.state;
    return (
      <Page title='审核失败' showBack>
        <View className='reject-box pd-32'>
          <View className='flex-center reject-tip mb-32'>
            <View>
              <View className='flex-center'>
                <Image src={`${ossHost}images/reject.png`} className='reject-img'></Image>
              </View>
              <View className='reject-title'>审核失败，您可以重新提交</View>
            </View>
          </View>
          <View className='reject-reason pd-32'>
            <View className='reason-title'>失败原因</View>
            <View className='reason-list mt-32'>
              {reasonList &&
                reasonList.map(item => {
                  return (
                    <View className='reason-item flex-box' key={item}>
                      <View className='dot'></View>
                      <View className='reason-content'>{item}</View>
                    </View>
                  );
                })}
            </View>
            {!remark
              ? null
              : (
              <View className='reject-remark flex'>
                <View className='title'>
                  备注：<Text className='remark-content'>{remark}</Text>
                </View>
              </View>
                )}
          </View>
          <View className='login-btn' onClick={this.backSubmit}>
            重新提交
          </View>
        </View>
      </Page>
    );
  }
}
export default Home;
