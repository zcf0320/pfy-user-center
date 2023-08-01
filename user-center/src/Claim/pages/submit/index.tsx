import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Input, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import utils from '@utils/index';
import * as commonApi from '@actions/common';
import * as claimApi from '@actions/claim';
import { connect } from 'react-redux';
import { MaterialItem } from './types';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  reducers: any;
  uploadImage: Function;
}
interface IState {
  idCard: string;
  mobile: string;
  name: string;
  email: string;
  materials: Array<MaterialItem>;
  materialReq: object;
}
@connect(state => {
  return Object.assign(
    {},
    {
      reducers: {
        accountAppealInfo: state.user.accountAppealInfo
      }
    }
  );
})
class Home extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      idCard: '',
      mobile: '',
      email: '',
      name: '',
      materials: [],
      materialReq: {}
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    Taro.showLoading({
      title: '加载中...',
      mask: true
    });
    const userInfo = Taro.getStorageSync(utils.appConfig.userInfo);
    const { name = '', mobile = '', email = '' } = userInfo || {};
    this.getIdCard();
    this.setState({
      name,
      mobile,
      email
    });
    claimApi
      .getMaterialsList({
        serviceRecordId: router?.params && router.params.serviceRecordId
      })
      .then((res: any) => {
        if (res) {
          if (res && res.length > 0) {
            const map = {};
            res.forEach(item => {
              if (item.materialId) {
                map[item.materialId] = [];
                this.setState({
                  materialReq: map
                });
              }
            });
          }
          this.setState({
            materials: res || []
          });
          Taro.hideLoading();
        }
      });
  }

  getIdCard () {
    commonApi.getIdCard().then((res: string) => {
      this.setState({ idCard: res });
    });
  }

  uploadImage = materialId => {
    let imgArr = this.state.materialReq[materialId];
    const materialReq = this.state.materialReq;
    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        commonApi
          .upload({
            filePath: tempFilePaths,
            module: 'claim'
          })
          .then((resp: string) => {
            Taro.hideLoading();
            const result = JSON.parse(resp);
            const data = result.data;
            imgArr = imgArr.concat([data]);
            materialReq[materialId] = imgArr;
            this.setState({
              materialReq
            });
          });
      }
    });
  };

  // 图片点击事件
  previewImage = (imgList, current) => {
    if (!imgList && !imgList.length) {
      return;
    }
    Taro.previewImage({
      current: current,
      urls: imgList // 需要预览的图片http链接列表
    });
  };

  // input 双向绑定
  handleInput = (key, value) => {
    if (key === 'mobile') {
      this.setState({ mobile: value.detail.value });
    }
    if (key === 'email') {
      this.setState({ email: value.detail.value });
    }
  };

  // 保存审核
  saveForm = () => {
    const { router } = getCurrentInstance();
    const { email, mobile, idCard, name } = this.state;
    let materialReqList = [];
    const checkObj = this.checkRequire();
    if (!checkObj.checked) {
      Taro.showToast({
        title: checkObj.error || '请检查必填文件是否上传',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    materialReqList = checkObj.materialReqList;

    const params = {
      email,
      mobile,
      idCard,
      name,
      materialReqList,
      serviceRecordId: router?.params && router.params.serviceRecordId
    };
    claimApi.checkSubmit(params).then(() => {
      Taro.redirectTo({
        url: `/Claim/pages/review/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
      });
    });
  };

  // 检验手机号格式和必填像
  checkRequire = () => {
    const { materialReq, materials, mobile, email } = this.state;
    let checked = true;
    let error = '';
    const materialReqList = [] as any;
    !utils.checkMail(email) && (error = '请输入正确的邮箱');
    !utils.checkPhone(mobile) && (error = '请输入正确的手机号');
    if (error) {
      return {
        error: error,
        checked: false,
        materialReqList: []
      };
    }
    for (const key in materialReq) {
      const dataItem = materials.find(item => item.materialId === key);
      if (
        dataItem &&
        dataItem.required &&
        utils.isEmptyObject(materialReq[key])
      ) {
        checked = false;
      }
      if (!utils.isEmptyObject(materialReq[key])) {
        materialReqList.push({ materialId: key, files: materialReq[key] });
      }
    }
    return {
      checked,
      materialReqList
    };
  };

  // 删除单个图片
  del = (materialId, index) => {
    const { materialReq } = this.state;
    materialReq[materialId].splice(index, 1);
    this.setState({
      materialReq
    });
  };

  render () {
    const { materials, materialReq, name, idCard, mobile, email } = this.state;
    return (
      <Page title='审核' showBack>
        <View className='claim-box'>
          <View className='top-tips flex-center'>
            此项服务需要您提交材料审核之后使用
          </View>
          <View className='bg-white pd-32 pt-0'>
            <View className='title-box'>基本信息</View>
            <View className='login-form'>
              <View className='form-item'>
                <View className='label-name '>被保险人</View>
                <View className='label-content'>{name}</View>
              </View>
              <View className='form-item'>
                <View className='label-name '>身份证号</View>
                <View className='label-content'>{idCard}</View>
              </View>
              <View className='form-item'>
                <View className='label-name'>手机号</View>
                <View className='flex'>
                  <Input
                    className='input  text-right'
                    value={mobile}
                    placeholder='请填写'
                    onInput={this.handleInput.bind(this, 'mobile')}
                    placeholderClass='placeholder'
                  ></Input>
                </View>
              </View>
              <View className='form-item'>
                <View className='label-name'>邮箱</View>
                <View>
                  <Input
                    className='input  text-right'
                    value={email}
                    placeholder='请填写'
                    onInput={this.handleInput.bind(this, 'email')}
                    placeholderClass='placeholder'
                  ></Input>
                </View>
              </View>
            </View>
          </View>
          <View className='mt-20 pd-32 pt-0 bg-white'>
            <View className='title-box'>补充材料</View>

            {materials.length > 0
              ? (
              <View className='materials-box'>
                {materials.map((item: MaterialItem) => {
                  return (
                    <View key={item.materialId}>
                      <View className='flex-between'>
                        <View className='material-title'>
                          {item.materialName}
                          {item.required
                            ? (
                            <Text className='fc-oriange'>(必填)</Text>
                              )
                            : (
                            <Text className='fc-grey-8'>(非必填)</Text>
                              )}
                        </View>
                        <Text
                          className='look-test'
                          onClick={() =>
                            this.previewImage(
                              item.example,
                              item.example && item.example[0]
                            )
                          }
                        >
                          查看示例
                        </Text>
                      </View>
                      <View className='material-tip mb-32'>
                        {item.explanation}
                      </View>
                      <View className='material-imgs flex-warp'>
                        {materialReq[item.materialId].map((flie, idx) => {
                          return (
                            <View
                              key={flie}
                              className='img-item flex-cenetr'
                              onClick={() =>
                                this.previewImage(
                                  materialReq[item.materialId],
                                  flie
                                )
                              }
                            >
                              <Image className='img' src={flie}></Image>
                              <Image
                                className='ico-del'
                                onClick={() => {
                                  this.del(item.materialId, idx);
                                }}
                                src={`${ossHost}images/ico-del.png`}
                              ></Image>
                            </View>
                          );
                        })}
                        <View
                          className='img-item flex-center '
                          onClick={() => this.uploadImage(item.materialId)}
                        >
                          <Image src={`${ossHost}images/add-img.png`} className='img-40'></Image>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
                )
              : null}
            <View
              className={`login-btn ${!mobile || !email ? 'disable' : ''}`}
              onClick={this.saveForm}
            >
              立即提交
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Home;
