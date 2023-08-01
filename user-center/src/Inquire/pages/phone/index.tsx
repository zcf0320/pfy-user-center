import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Input, Image, Textarea } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import { createMobile } from '@actions/inquire';
import Page from '@components/page';

import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
  user: any;
  mobile: string;
  patientDescribe: string;
}
class Phone extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      user: {},
      mobile: '',
      patientDescribe: ''
    };
  }

  componentDidMount () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    this.setState({
      user,
      mobile: user.mobile
    });
  }

  save () {
    const { router } = getCurrentInstance();
    const { mobile, patientDescribe } = this.state;
    if (mobile.length !== 11) {
      return;
    }
    const params: any = {
      serviceRecordId: router?.params && router.params.serviceRecordId,
      mobile
    };
    patientDescribe && (params.patientDescribe = patientDescribe);
    createMobile(params).then(() => {
      Taro.redirectTo({
        url: '/Inquire/pages/phoneResult/index'
      });
    });
  }

  render () {
    const { user, mobile } = this.state;
    const { name, age, sex } = user;
    return (
      <Page showBack title='选择患者'>
        <View className='page-phone flex'>
          <View className='content flex'>
            <View className='top'>
              此次服务仅为健康咨询，并非医疗建议。您若有任何身体不适，建议至最近的医院就诊，感谢！
            </View>
            <View className='info'>
              <View className='title flex'>
                <Text className='label'>患者信息</Text>
                <Text>仅限本人使用</Text>
              </View>
              <View className='common flex'>
                <Text className='label'>问诊人姓名</Text>
                <Text>{name}</Text>
              </View>
              <View className='common flex'>
                <Text className='label'>性别</Text>
                <Text>{sex === 1 ? '男' : '女'}</Text>
              </View>
              <View className='common flex no-border'>
                <Text className='label'>年龄（岁）</Text>
                <Text>{age}</Text>
              </View>
            </View>
            <View className='phone-content'>
              <View className='title flex'>
                <View className='left flex'>
                  <Text>填写预留手机号</Text>
                  <Image src={`${ossHost}images/must.png`} className='must'></Image>
                </View>
                <Input
                  className='right'
                  value={mobile}
                  placeholder='请填写手机号'
                  maxlength={11}
                  onInput={e => {
                    this.setState({
                      mobile: e.detail.value
                    });
                  }}
                  placeholderClass='placeholder'
                ></Input>
              </View>
              <View className='dease-info'>
                <View className='tips'>
                  <Text>描述本次疾病概要</Text>
                  <Text className='min'>（便于医生更快了解您的病情）</Text>
                </View>
                <View className='input-content'>
                <Textarea
                  maxlength={120}
                  placeholder='描述您本次所患的症状（120字以内）'
                  placeholderClass='placeholder'
                  onInput={e => {
                    this.setState({
                      patientDescribe: e.detail.value
                    });
                  }}
                ></Textarea>
                </View>

              </View>
            </View>
          </View>
          <View
            className={`bottom flex ${mobile.length === 11 ? '' : 'disable'}`}
            onClick={() => {
              this.save();
            }}
          >
            提交
          </View>
        </View>
      </Page>
    );
  }
}
export default Phone;
