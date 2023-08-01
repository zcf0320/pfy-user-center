import { getCurrentInstance } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getUserProtocol } from '@actions/common';
import './index.scss';

interface IState {
  content: string;
}
class All extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    const { index } = (router?.params && router.params) || {};
    getUserProtocol(index).then((res:any) => {
      this.setState({
        content: res.content
      });
    });
  }

  render () {
    return (
      <Page showBack title='用户协议'>
        <View className='page-all'>
          <RichText nodes={this.state.content} />
        </View>
      </Page>
    );
  }
}
export default All;
