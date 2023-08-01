import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getLeavingMessageList } from '@actions/user';
import utils from '@utils/index';
import i18n from '@i18n/index';
import './index.scss';

interface Message {
  content: string;
  createTime: number;
  messagePicture: Array<string>;
  mobile: string;
  updateTime: number;
  state: number;
}
interface IState {
  isEmpty: boolean;
  messageList: Array<Message>;
}
class LeavingMessage extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      isEmpty: true,
      messageList: []
    };
  }

  componentDidShow () {
    getLeavingMessageList().then((res:any) => {
      this.setState({
        messageList: res.contentsList || [],
        isEmpty: !(res.contentsList.length > 0)
      });
    });
  }

  previewImg (item) {
    Taro.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [item] // 需要预览的图片http链接列表
    });
  }

  toAdd () {
    Taro.navigateTo({
      url: '/setting/leavingMessage/addMessage/index'
    });
  }

  render () {
    const { isEmpty, messageList } = this.state;
    return (
      <Page showBack title={i18n.chain.LeavingMessage.title}>
        {isEmpty
          ? (
          <View className='leaving-message-page-empty'>
            <View className='empty-content'>
              <View className='empty-content-img'></View>
              <View className='empty-content-text'>{i18n.chain.LeavingMessage.noData}</View>
            </View>
            <View
              className='leaving-message-btn-add'
              onClick={this.toAdd.bind(this)}
            >
              {i18n.chain.LeavingMessage.add}
            </View>
          </View>
            )
          : (
          <View className='leaving-message-page'>
            {messageList.map((item, index) => {
              return (
                <View className='leaving-message-item' key={'留言' + index}>
                  <View
                    className={`leaving-message-item-title ${
                      item.state === 1 ? 'nohandle' : 'yeshandle'
                    }`}
                  >
                    <View>
                      {utils.timeFormat(item.createTime, 'y-m-d h:m')} {i18n.chain.LeavingMessage.message} |{' '}
                      {item.mobile}
                    </View>
                  </View>
                  <View className='leaving-message-item-text'>
                    {item.content}
                  </View>
                  <View className='leaving-message-item-img'>
                    {item.messagePicture.map((val, index2) => {
                      return (
                        <Image
                          key={'图片' + index2}
                          onClick={this.previewImg.bind(this, val)}
                          className='leaving-message-img'
                          src={val}
                        ></Image>
                      );
                    })}
                  </View>
                </View>
              );
            })}
            <View
              className='leaving-message-btn-add'
              onClick={this.toAdd.bind(this)}
            >
              {i18n.chain.LeavingMessage.add}
            </View>
          </View>
            )}
      </Page>
    );
  }
}
export default LeavingMessage;
