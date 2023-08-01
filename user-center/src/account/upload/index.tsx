import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import { IStoreProps } from '@reducers/interface';
import { connect } from 'react-redux';
import { checkIdCardImg } from '@actions/user';
import utils from '@utils/index';
import { upload } from '@actions/common';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  checkIdCardImg: Function;
  actions: any;
  reducers: any;
}
interface IState {
  frontIdCardImg: string;
  negativeIdCardImg: string;
}
type PropsType = IStoreProps & IProps;
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
export default class UploadIdCard extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      frontIdCardImg: '',
      negativeIdCardImg: ''
    };
  }

  // 上传图片
  uploadImg = (key: string) => {
    const vm = this;
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        const tempFilePaths = res.tempFilePaths;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        upload({
          filePath: tempFilePaths[0],
          module: 'idCard'
        }).then((res2: string) => {
          Taro.hideLoading();
          if (key === 'negativeIdCardImg') {
            vm.setState({
              negativeIdCardImg: JSON.parse(res2).data
            });
          } else {
            vm.setState({
              frontIdCardImg: JSON.parse(res2).data
            });
          }
        });
      }
    });
  };

  // 提交上传文件
  submit () {
    const { frontIdCardImg, negativeIdCardImg } = this.state;
    if (!frontIdCardImg || !negativeIdCardImg) {
      return;
    }
    const { accountAppealInfo } = this.props.reducers;

    const params = utils.extendObjects({}, accountAppealInfo);
    params.frontIdCardImg = frontIdCardImg;
    params.negativeIdCardImg = negativeIdCardImg;
    checkIdCardImg(params).then(() => {
      Taro.navigateTo({
        url: 'account/update/index'
      });
    });
  }

  render () {
    const { frontIdCardImg, negativeIdCardImg } = this.state;
    return (
      <Page showBack title='身份核验'>
        <View className='upload '>
          <View className='uploadBox'>
            <View className='topTitle'>请拍摄您本人的二代身份证</View>
            <View className='subTitle'>确保拍摄证件清晰完整</View>
            <View
              className='uploadItem'
              onClick={() => {
                this.uploadImg('frontIdCardImg');
              }}
            >
              {!this.state.frontIdCardImg
                ? (
                <View className='flex-box'>
                  <Image src={`${ossHost}images/uploadIco.png`} className='uploadImage'></Image>
                  <View>点击拍摄上传人像面</View>
                </View>
                  )
                : (
                <View>
                  <Image
                    src={this.state.frontIdCardImg}
                    className='idCardImg'
                  ></Image>
                </View>
                  )}
            </View>
            <View
              className='uploadItem'
              onClick={() => {
                this.uploadImg('negativeIdCardImg');
              }}
            >
              {!this.state.negativeIdCardImg
                ? (
                <View className='flex-box'>
                  <Image src={`${ossHost}images/uploadIco.png`} className='uploadImage'></Image>
                  <View>点击拍摄上传国徽面</View>
                </View>
                  )
                : (
                <View>
                  <Image
                    src={this.state.negativeIdCardImg}
                    className='idCardImg'
                  ></Image>
                </View>
                  )}
            </View>
          </View>
          <View
            className={`uploadBtn ${
              !frontIdCardImg || !negativeIdCardImg ? 'disable' : ''
            }`}
            onClick={() => {
              this.submit();
            }}
          >
            立即上传
          </View>
        </View>
      </Page>
    );
  }
}
