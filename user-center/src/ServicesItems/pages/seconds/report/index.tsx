import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import Page from '@components/page';
import { View, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import { getReport } from '@actions/serviceItem';
import './index.scss';

interface IState {
  url: string;
  isAjax: boolean;
}
class Report extends Component<null, IState> {
  constructor (props) {
    super(props);
    this.state = {
      url: '',
      isAjax: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    getReport({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then((res:any) => {
      this.setState({
        isAjax: true,
        url: res || ''
      });
    });
  }

  render () {
    const { url, isAjax } = this.state;
    return (
      <Page showBack title='服务报告'>
        {isAjax
          ? (
          <View className='page-content'>
            {url
              ? (
              <View className='page-report flex'>
                <View className='report-content flex'>
                  <View className='content-top flex'>
                    <View className='mouth-title-border'>
                      <Text className='mouth-title-text'>
                        您的服务报告已生成
                      </Text>
                    </View>
                    <Image
                      className='mouth-docter'
                      src={`${utils.appConfig.ossHost}mouth-docter.png`}
                    ></Image>
                    <Image src={url} className='report' />
                  </View>
                  <View
                    onClick={() => {
                      Taro.previewImage({
                        current: url,
                        urls: [url]
                      });
                    }}
                  >
                    -点击预览-
                  </View>
                </View>
              </View>
                )
              : (
              <View className='page-empty flex'>
                <View className='empty-icon'></View>
                <View className='empty-title'>您的服务申请已提交</View>
                <View className='empty-text'>
                  医生将在24小时内分析您的资料并在3个工作日内为您生成服务报告
                </View>
              </View>
                )}
          </View>
            )
          : null}
      </Page>
    );
  }
}
export default Report;
