import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Input, Text, Textarea } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getNeedMaterials, saveMaterials } from '@actions/serviceItem';
import { connect } from 'react-redux';
import { SET_MODAL } from '@constants/common';
import { GET_MATERIA_LIST } from '@constants/serviceItem';
import Material from '@components/material';
import utils from '@utils/index';
import { getIdCard } from '@actions/common';
import './index.scss';

interface IProps {
  materialList: Array<any>;
  onGetNeedMaterials: Function;
  setModal: Function;
}
interface IState {
  commitUserdemand: boolean;
  userDetailCodeList: Array<string>;
  userDemand: string;
  userInfo: {
    name?: string;
    idCard?: string;
    mobile?: string;
    email?: string;
    childName?: string;
  };
}
@connect(
  state => {
    return Object.assign({}, state.serviceItem, state.common);
  },
  dispatch => ({
    onGetNeedMaterials (data) {
      dispatch({
        type: GET_MATERIA_LIST,
        payload: data
      });
    },
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class Seconds extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      commitUserdemand: false,
      userDemand: '',
      userDetailCodeList: [],
      userInfo: {}
    };
  }

  async componentDidMount () {
    const { router } = getCurrentInstance();
    const { appConfig } = utils;
    const { mobile, name } = Taro.getStorageSync(appConfig.userInfo);
    const idCard = await getIdCard();
    this.setState({
      userInfo: {
        mobile,
        idCard,
        name
      }
    });
    getNeedMaterials({
      serviceRecordId: (router?.params && router.params.serviceRecordId) || ''
    }).then((res:any) => {
      const { materialList, commitUserdemand, userDetailCodeList } = res;
      materialList.forEach(item => {
        item.example = [item.sampleImage];
        item.files = [];
      });
      this.setState({
        commitUserdemand,
        userDetailCodeList
      });
      this.props.onGetNeedMaterials(res.materialList || []);
    });
  }

  deleteImg = (parent: number, child: number) => {
    const { materialList } = this.props;
    materialList[parent].files.splice(child, 1);
    this.props.onGetNeedMaterials([...materialList]);
  };

  addItem = (params: any) => {
    const { materialList } = this.props;
    const { data, index } = params;
    materialList[index].files.push(data);
    this.props.onGetNeedMaterials([...materialList]);
  };

  watchData = () => {
    const { materialList } = this.props;
    const { userDetailCodeList, commitUserdemand, userDemand } = this.state;

    const { idCard, childName, mobile } = this.state.userInfo;

    let result = true;
    commitUserdemand && !userDemand && (result = false);
    userDetailCodeList.includes('child_name') && !childName && (result = false);
    // (userDetailCodeList.includes('email') && !email) && (result = false);
    userDetailCodeList.includes('mobile') && !mobile && (result = false);
    userDetailCodeList.includes('id_card') && !idCard && (result = false);

    materialList.length &&
      materialList.forEach(item => {
        if (item.required) {
          !item.files.length && (result = false);
        }
      });
    return result;
  };

  save = () => {
    const { router } = getCurrentInstance();
    if (!this.watchData()) {
      return;
    }
    let error = '';

    const { materialList } = this.props;
    const {
      userInfo,
      commitUserdemand,
      userDemand,
      userDetailCodeList
    } = this.state;
    const { mobile, email } = userInfo;
    userDetailCodeList.includes('mobile') &&
      !utils.checkPhone(mobile) &&
      (error = '手机格式有误');
    userDetailCodeList.includes('email') &&
      email &&
      !utils.checkMail(email) &&
      (error = '邮箱格式有误');
    if (error) {
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 3000
      });
      return;
    }
    materialList.forEach(item => {
      item.imgUrls = item.files;
    });
    const serviceRecordId = router?.params && router.params.serviceRecordId;
    for (let i = 0; i < materialList.length; i++) {
      materialList[i].imgUrls = materialList[i].files;
      if (!materialList[i].imgUrls.length) {
        materialList.splice(i, 1);
        i--;
      }
    }
    const params: any = {
      materialList,
      userInfo,
      serviceRecordId
    };
    commitUserdemand && (params.userDemand = userDemand);
    saveMaterials(params).then(() => {
      Taro.redirectTo({
        url: '/Claim/pages/review/index'
      });
    });
  };

  render () {
    const { materialList } = this.props;
    const { commitUserdemand, userDetailCodeList } = this.state;
    const { name, idCard, mobile, email, childName } = this.state.userInfo;
    return (
      <Page showBack title='上传资料'>
        <View className='page-seconds'>
          <View className='claims-step-top'>
            <View className='claims-step-title'>
              <View className='claims-step-redline'></View>
              <View>基本信息</View>
            </View>
            {userDetailCodeList.includes('insured_name')
              ? (
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>被保险人</View>
                <Input
                  className='claims-step-input  claims-step-top-666'
                  type='text'
                  maxlength={10}
                  placeholderClass='claims-step-place'
                  value={name}
                  disabled
                />
              </View>
                )
              : null}
            {userDetailCodeList.includes('child_name')
              ? (
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>孩子姓名</View>
                <Input
                  className='claims-step-input'
                  type='text'
                  maxlength={10}
                  placeholder='请输入孩子姓名'
                  placeholderClass='claims-step-place'
                  value={childName}
                  onInput={e => {
                    const data = Object.assign({}, this.state.userInfo, {
                      childName: e.detail.value
                    });
                    this.setState({
                      userInfo: data
                    });
                  }}
                />
              </View>
                )
              : null}
            {userDetailCodeList.includes('id_card')
              ? (
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>身份证号</View>
                <Input
                  className='claims-step-input  claims-step-top-666'
                  type='text'
                  placeholderClass='claims-step-place'
                  value={idCard}
                  disabled
                />
              </View>
                )
              : null}
            {userDetailCodeList.includes('mobile')
              ? (
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>
                  <View className='flex-center'>
                    手机号码<View className='must'></View>
                  </View>
                </View>
                <Input
                  className='claims-step-input'
                  type='number'
                  maxlength={11}
                  placeholderClass='claims-step-place'
                  placeholder='请输入手机号码'
                  value={mobile}
                  onInput={e => {
                    const data = Object.assign({}, this.state.userInfo, {
                      mobile: e.detail.value
                    });
                    this.setState({
                      userInfo: data
                    });
                  }}
                />
              </View>
                )
              : null}
            {userDetailCodeList.includes('email')
              ? (
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>邮箱</View>
                <Input
                  className='claims-step-input'
                  type='text'
                  maxlength={30}
                  placeholderClass='claims-step-place'
                  placeholder='请输入邮箱'
                  value={email}
                  onInput={e => {
                    const data = Object.assign({}, this.state.userInfo, {
                      email: e.detail.value
                    });
                    this.setState({
                      userInfo: data
                    });
                  }}
                />
              </View>
                )
              : null}
          </View>
          {commitUserdemand
            ? (
            <View className='claims-step-top demands'>
              <View className='claims-step-title'>
                <View className='claims-step-redline'></View>
                <View className='flex-center'>
                  用户诉求<View className='must'></View>
                  <Text className='set-tips'>（300字以内）</Text>
                </View>
              </View>
              <View className='user-demands'>
              <Textarea className='textarea'
                maxlength={300}
                placeholder='请告诉我们您想解决的问题及您的所在地址'
                placeholderClass='placeholder'
                onInput={e => {
                  this.setState({
                    userDemand: e.detail.value
                  });
                }}
              ></Textarea>
              </View>

            </View>
              )
            : null}
          {materialList && materialList.length
            ? (
            <Material
              materialList={materialList}
              deleteImg={this.deleteImg}
              addItem={this.addItem}
              setModal={this.props.setModal}
            />
              )
            : null}
          <View
            className={`save flex ${this.watchData() ? '' : 'disable'}`}
            onClick={this.save}
          >
            立即提交
          </View>
        </View>
      </Page>
    );
  }
}
export default Seconds;
