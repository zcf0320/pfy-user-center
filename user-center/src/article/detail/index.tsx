import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { RichText, View, Text, Button, Image, Video } from '@tarojs/components';
import Page from '@components/page';
import { getDetail, shareHealth } from '@actions/article';
import utils from '@utils/index';
import './index.scss';

const { xAccessToken } = utils.appConfig;

interface IState {
  info: any;
  content: string;
  show: boolean;
}

class Detail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      info: {},
      content: '',
      show: false
    };
  }

  onShareAppMessage () {
    const { router } = getCurrentInstance();
    const token = Taro.getStorageSync(xAccessToken);
    if (token) {
      this.shareHealth();
    }
    return {
      title: '分享健康百科',
      path: `/article/detail/index?id=${router?.params && router.params.id}`
    };
  }

  getDetail = () => {
    const { router } = getCurrentInstance();
    getDetail({ id: router?.params && router.params.id }).then((res: any) => {
      const newContent = res.content.replace(
        /<img/gi,
        '<img style="max-width:100%;height:auto;display:block;"'
      );
      this.setState({
        info: res,
        content: newContent
      });
      Taro.setNavigationBarTitle({
        title: res.title || '健康百科详情'
      });
    });
  };

  shareHealth = () => {
    shareHealth({}).then();
  };

  componentDidShow () {
    const { router } = getCurrentInstance();
    const time = new Date().getTime();
    const createTime = Number(router?.params && router.params.createTime);
    let show = true;
    createTime && (show = !!(time - createTime < 60 * 2 * 1000));
    !show &&
      Taro.showToast({
        title: '二维码已过期',
        icon: 'none'
      });
    this.setState({
      show
    });
    show && this.getDetail();
  }

  render () {
    const { info, content, show } = this.state;
    return (
      <Page showBack title={info.title || '健康百科详情'}>
        {
          show
            ? (
          <View className='page-article-detail'>
            <View className='title'>{info.title}</View>
            <View className='tag flex'>
              {info.tags && info.tags.length
                ? info.tags.map(item => {
                  return (
                      <View className='tag-item flex' key={item}>
                        {item}
                      </View>
                  );
                })
                : null}
            </View>
            <View className='time flex'>
              <Text>{utils.timeFormat(info.updateTime, 'y-m-d h:m')}</Text>
              {utils.appConfig.isWeapp && (
                <Button className='share' openType='share' plain>
                  分享此篇文章
                </Button>
              )}
            </View>
            {info.advertisVideo
              ? (
              <Video src={info.advertisVideo} className='video'></Video>
                )
              : (
              <Image
                mode='aspectFill'
                src={info.advertisPic}
                className='article-title-img'
              ></Image>
                )}

            <RichText nodes={content}></RichText>
          </View>
              )
            : null}
      </Page>
    );
  }
}
export default Detail;
