import { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { getResult } from '@actions/insurance';
import { GET_INSURE_DETAIL } from '@constants/insurance';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import Steps from '../../component/step';

import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getDetail: Function;
}

type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getDetail (params) {
      getResult(params).then(res => {
        dispatch({
          type: GET_INSURE_DETAIL,
          payload: res
        });
      });
    }
  })
)
class Detail extends Component<PropsType> {
  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getDetail({
      id: router?.params && router.params.id
    });
  }

  getStatusText () {
    const { state, premiumPrice } = this.props.insurance.insureDetail || {};
    const status = state;

    let bg = '';
    let img = '';
    const title = `保费报价:${premiumPrice} 元`;
    let reason = '';
    if (status === 1) {
      bg = `${ossHost}images/status_i_1.png`;
      img = `${ossHost}images/type_1.png`;
      reason = '等待核保，请耐心等待结果';
    }
    if (status === 2) {
      bg = `${ossHost}images/status_i_2.png`;
      img = `${ossHost}images/type_2.png`;
      reason = '可投保';
    }
    if (status === 3) {
      bg = `${ossHost}images/status_i_3.png`;
      img = `${ossHost}images/type_3.png`;
      reason = '不可投保';
    }
    return {
      bg,
      img,
      title,
      reason
    };
  }

  render () {
    const {
      createTime,
      policyHolderName,
      policyHolderIdCard,
      policyHolderMobile,
      insuredName,
      relationship,
      insuredIdCard,
      insuredSex,
      insuredAge,
      insuredJob,
      hasSocialSecurity,
      city,
      allowanceConfigId,
      insuredEmail,
      insuredMobile
    } = this.props.insurance.insureDetail || {};
    return (
      <Page showBack title='核保结果'>
        <View className='claims-page'>
          <Steps step={3} />
          <View className='status'>
            <Image
              src={this.getStatusText().bg}
              className='bg'
            ></Image>
            <View className='content flex'>
              <Image
                className='type'
                src={this.getStatusText().img}
              ></Image>
              <Text className='title'>
                {this.getStatusText().title}
              </Text>
              <Text>{this.getStatusText().reason}</Text>
            </View>
          </View>
          <View className='info'>
            <View className='title'>保障内容</View>
            <View className='common frist flex'>
              <View className='left'>一般医疗保险金（1万免赔额）</View>
            </View>
            <View className='common flex'>
              <View className='left'>
                重大疾病（100种）医疗保险金（0免赔额）
              </View>
            </View>
            <View className='common flex'>
              <View className='left'>质子重离子治疗方式（0免赔额）</View>
            </View>
            <View className='common flex'>
              <View className='left'>重疾住院陪护服务</View>
            </View>
            <View className='common flex'>
              <View className='left'>健康管理服务</View>
            </View>
            <View className='common flex'>
              <View className='left'>服务周期</View>
              <View className='right one'>1年</View>
            </View>
            <View className='common flex'>
              <View className='left'>申请时间</View>
              <View className='right one'>{utils.timeFormat(createTime)}</View>
            </View>
          </View>
          <View className='info'>
            <View className='title'>投保人</View>
            <View className='common flex'>
              <View className='left'>姓名</View>
              <View className='right'>{policyHolderName}</View>
            </View>
            <View className='common flex'>
              <View className='left'>身份证</View>
              <View className='right'>{policyHolderIdCard}</View>
            </View>
            <View className='common flex'>
              <View className='left'>手机号</View>
              <View className='right'>{policyHolderMobile}</View>
            </View>
          </View>
          <View className='info'>
            <View className='title'>被保人</View>
            <View className='common flex'>
              <View className='left'>姓名</View>
              <View className='right'>{insuredName}</View>
            </View>
            <View className='common flex'>
              <View className='left'>与投保人关系</View>
              <View className='right'>{relationship}</View>
            </View>
            <View className='common flex'>
              <View className='left'>身份证</View>
              <View className='right'>{insuredIdCard}</View>
            </View>
            <View className='common flex'>
              <View className='left'>性别</View>
              <View className='right'>{insuredSex === 0 ? '女' : '男'}</View>
            </View>
            <View className='common flex'>
              <View className='left'>年龄</View>
              <View className='right'>{insuredAge}</View>
            </View>
            <View className='common flex'>
              <View className='left'>被保人职业</View>
              <View className='right'>{insuredJob}</View>
            </View>
            <View className='common flex'>
              <View className='left'>有无社保</View>
              <View className='right'>{hasSocialSecurity ? '有' : '无'}</View>
            </View>
            <View className='common flex'>
              <View className='left'>投保地区</View>
              <View className='right'>{city}</View>
            </View>
            <View className='common flex'>
              <View className='left'>住院津贴保险金</View>
              <View className='right'>{allowanceConfigId}</View>
            </View>
            <View className='common flex'>
              <View className='left'>手机号</View>
              <View className='right'>{insuredMobile || ''}</View>
            </View>
            <View className='common flex'>
              <View className='left'>电子邮箱</View>
              <View className='right'>{insuredEmail || ''}</View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Detail;
