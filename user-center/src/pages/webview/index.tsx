import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, WebView } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

interface IState {
  url: string;
}
export default class WebViewPage extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      url: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    let url = '';
    url = `${router?.params && router.params.url}?`;
    if (url) {
      if (router?.params && router.params.code) {
        Taro.setNavigationBarTitle({
          title: utils.getWebViewTitle(
            utils.appConfig.codeMap[router.params.code]
          )
        });
      }

      if (router?.params && router.params.title) {
        Taro.setNavigationBarTitle({
          title: decodeURIComponent(router.params.title)
        });
      }
      if (router?.params) {
        for (const key in router.params) {
          const value = router.params[key]!;
          if (url.indexOf('g-hcare-scm') > -1) {
            key !== 'url' && (url += `${key}=${encodeURIComponent(value)}&`);
          } else {
            key !== 'url' && (url += `${key}=${value}&`);
          }
        }
      }
      if (Taro.getEnv() === 'WEAPP') {
        url += 'env=weapp';
      }
      this.setState({
        url: url
      });
    }
  }

  componentDidShow () {
    if (
      this.state.url.indexOf('doctorgroup') > -1 ||
      this.state.url.indexOf('g-hcare.com') > -1 ||
      this.state.url.indexOf('100cbc.com') > -1
    ) {
      // don't do
    } else {
      this.setState({
        url: `${this.state.url}&time=${new Date().getTime()}`
      });
    }
  }

  render () {
    return (
      <View className='webview'>
        <WebView src={this.state.url} />
      </View>
    );
  }
}
