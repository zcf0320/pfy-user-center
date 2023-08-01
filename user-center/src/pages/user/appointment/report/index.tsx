import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import * as actions from '@actions/user';
import { upload } from '@actions/common';
import { connect } from 'react-redux';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  getReportInfo: Function;
  postReportInfo: Function;
}
interface IState {
  id: string;
  status: string | number;
  images: any;
  // warnInfo: {
  //   status?: string;
  //   images?: string;
  // };
}
@connect(state => state.user, { ...actions })
class Report extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      id: '',
      status: '',
      images: []
      // warnInfo: {
      //   status: '',
      //   images: '',
      // },
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const { reportId } = (router?.params && router.params) || {};
    let title = '上传报告';
    if (reportId) {
      title = '查看报告';
      this.getReport(reportId);
    }
    Taro.setNavigationBarTitle({
      title
    });
    this.setState({
      id: reportId || ''
    });
  }

  // 获取报告详情
  getReport (id) {
    this.props.getReportInfo({ reportId: id }).then(res => {
      const { state, images } = res;
      this.setState({
        status: state,
        images
      });
    });
  }

  selectState (status) {
    const { id } = this.state;
    // 如果是详情 不可选择
    if (id) {
      return;
    }
    this.setState({
      status
    });
  }

  // 上传图片
  uploadImg () {
    const vm = this;
    const { images } = this.state;

    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        upload({
          filePath: tempFilePaths,
          module: 'report'
        }).then((res2: string) => {
          Taro.hideLoading();
          const result = JSON.parse(res2);
          images.push(result.data);
          vm.setState({
            images
          });
        });
      }
    });
  }

  // 删除图片
  delImage () {
    this.setState({
      images: []
    });
  }

  // 上传报告
  postReport () {
    const { router } = getCurrentInstance();
    const { id, status, images } = this.state;
    // 如果是详情 不可保存
    if (id || (status === '' && !images.length)) {
      return;
    }
    const params = {
      state: status,
      images,
      reserveId: router?.params && router.params.reserveId
    };
    this.props.postReportInfo(params).then(() => {
      Taro.showToast({
        title: '已增加10积分',
        icon: 'success',
        duration: 2000
      });
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        });
      }, 1000);
    });
  }

  isConfirm () {
    const { status, images } = this.state;
    return status === '' || !images.length;
  }

  render () {
    return (
      <Page showBack title={this.state.id ? '查看报告' : '上传报告'}>
        <View className='page-report flex'>
          <View className='content flex'>
            <View className='top flex'>
              <View className='left flex'>
                <Text className='label'>检测结果</Text>
              </View>
              <View className='right flex'>
                <View
                  className='type-item flex'
                  onClick={this.selectState.bind(this, 0)}
                >
                  <View
                    className={`circle flex ${
                      this.state.status === 0 ? 'active' : ''
                    }`}
                  >
                    {this.state.status === 0
                      ? (
                      <View className='circle-dot'></View>
                        )
                      : null}
                  </View>
                  <Text>阴性</Text>
                </View>
                <View
                  className='type-item flex'
                  onClick={this.selectState.bind(this, 1)}
                >
                  <View
                    className={`circle flex ${
                      this.state.status === 1 ? 'active' : ''
                    }`}
                  >
                    {this.state.status === 1
                      ? (
                      <View className='circle-dot'></View>
                        )
                      : null}
                  </View>
                  <Text>阳性</Text>
                </View>
              </View>
            </View>
            <View className='report-bottom flex'>
              <View className='title flex'>
                <Text>报告扫描件</Text>
                {/* <Text className='error'>{ this.state.warnInfo.images }</Text> */}
              </View>
              <View className='scan flex'>
                {this.state.id
                  ? (
                  <Image
                    src={this.state.images[0]}
                    className='report-image'
                  ></Image>
                    )
                  : this.state.images.length
                    ? (
                  <View className='img'>
                    <Image
                      className='report-image'
                      src={this.state.images[0]}
                    ></Image>
                    <Image
                      src={`${ossHost}images/del.png`}
                      className='del'
                      onClick={this.delImage.bind(this)}
                    ></Image>
                  </View>
                      )
                    : (
                  <View
                    className='report-image flex'
                    onClick={this.uploadImg.bind(this)}
                  ></View>
                      )}
              </View>
              {!this.state.id
                ? (
                <Text className='tips'>
                  备注：成功上传获得星币奖励<Text className='score'>+10</Text>
                </Text>
                  )
                : null}
            </View>
          </View>
          {!this.state.id
            ? (
            <View
              className={`confrim flex ${
                this.isConfirm() ? 'disable' : ''
              }`}
              onClick={this.postReport.bind(this)}
            >
              确认上传
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default Report;
