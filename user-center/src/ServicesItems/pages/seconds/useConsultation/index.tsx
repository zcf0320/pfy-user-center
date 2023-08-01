import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Textarea } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { userSecond } from '@actions/serviceItem';
import './index.scss';

interface IState {
    showModal: boolean;
    userDemand: string;
}
class UseConsultation extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      userDemand: ''
    };
  }

  render () {
    const { showModal, userDemand } = this.state;
    const { router } = getCurrentInstance();
    return <Page showBack title='用户诉求'>
            <View className='page-use-consultation flex'>
                <View className='top flex'>告诉我们您的诉求，便于我们与专业的医生沟通您的病情</View>
                <Textarea name='' id='' maxlength={1000} placeholderClass='placeholder' onInput={
                    (e) => {
                      this.setState({
                        userDemand: e.detail.value
                      });
                    }
                } className='textarea' placeholder='请告诉我们您想解决的问题……'
                ></Textarea>
                <View className={`save flex ${userDemand ? '' : 'disable'}`} onClick={() => {
                  userSecond({
                    serviceRecordId: router?.params && router.params.serviceRecordId,
                    userDemand
                  }).then(() => {
                    this.setState({
                      showModal: true
                    });
                  });
                }}
                >提交服务申请</View>
                {
                    showModal
                      ? <View className='modal flex'>
                        <View className='modal-content flex'>
                            <View className='modal-top flex'>
                                <View className='modal-title'>您的服务申请已提交</View>
                                <View className='modal-text'>医生将在24小时内分析您的资料并在3个工作日内为您生成服务报告</View>
                            </View>
                            <View className='close' onClick={() => {
                              Taro.navigateBack({
                                delta: 2
                              });
                            }}
                            ></View>
                        </View>
                    </View>
                      : null
                }
            </View>
        </Page>;
  }
}
export default UseConsultation;
