import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import i18n from '@i18n/index';
import { getSysMessages, messageNum } from '@actions/user';
import Page from '@components/page';
import MessageItem from './messageItem';
import ProblemItem from './problemItem';
import './index.scss';

const problemList = [
  {
    title: i18n.chain.userMessage.question1,
    subTitle:
    i18n.chain.userMessage.answer1
  },
  {
    title: i18n.chain.userMessage.question2,
    subTitle: i18n.chain.userMessage.answer2
  },
  {
    title: i18n.chain.userMessage.question3,
    subTitle:
    i18n.chain.userMessage.answer3
  },
  {
    title: i18n.chain.userMessage.question4,
    subTitle:
    i18n.chain.userMessage.answer4
  }
];

interface IState {
  messageList: Array<any>;
  tab: number;
  isAjax: boolean;
  msgNum: number;
  pageNum: number;
  height: number;
}
class Message extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      messageList: [],
      tab: 1,
      isAjax: true,
      msgNum: 0,
      pageNum: 1,
      height: 100
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: i18n.chain.userMessage.title });
    const info = Taro.getSystemInfoSync();
    const { windowHeight } = info;

    this.setState({
      height: windowHeight - 52
    });
    messageNum().then((res: any) => {
      this.setState({
        msgNum: res
      });
    });
    this.loadSysMessage(1);
  }

  loadSysMessage (pageNum) {
    const { isAjax } = this.state;
    if (!isAjax) {
      return;
    }
    this.setState({
      pageNum: pageNum
    });
    getSysMessages({
      pageNum,
      pageSize: 10
    })
      .then((res: any) => {
        const data = this.state.messageList.concat(res.records);
        this.setState({
          isAjax: res.records.length >= 10,
          messageList: data || []
        });
      })
      .catch(() => {
        this.setState({
          isAjax: false,
          messageList: []
        });
      });
  }

  changeTab (num) {
    const { tab } = this.state;
    if (num === tab) {
      return;
    }
    this.setState({
      tab: num
    });
  }

  goUrl () {
    Taro.navigateTo({
      url: '/pages/user/service/list/index'
    });
  }

  onScrollToLower = (e: any) => {
    console.log('e', e);

    const { pageNum } = this.state;
    this.loadSysMessage(pageNum + 1);
  };

  render () {
    const { tab, messageList, msgNum, height } = this.state;

    return (
      <Page showBack title={i18n.chain.userMessage.title}>
        <View className='page-message flex'>
          <View className='message-tab flex'>
            <View
              className={`message-tab-item flex ${tab === 1 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(1);
              }}
            >
              <Text>{i18n.chain.userMessage.system}</Text>
              {tab === 1 ? <View className='line'></View> : null}
              {msgNum > 0 ? <View className='dot'></View> : null}
            </View>
            <View
              className={`message-tab-item flex ${tab === 2 ? 'active' : ''}`}
              onClick={() => {
                this.changeTab(2);
              }}
            >
              <Text>{i18n.chain.userMessage.common}</Text>
              {tab === 2 ? <View className='line'></View> : null}
            </View>
          </View>
          {tab === 1
            ? (
            <ScrollView
              scrollY
              scrollWithAnimation
              enableFlex
              style={{ height: height + 'px' }}
              onScrollToLower={this.onScrollToLower}
            >
              <View className='message-content'>
                {messageList.length > 0
                  ? (
                      messageList.map((item, index) => {
                        return (
                      <MessageItem
                        item={item}
                        key={item.id}
                        index={index}
                        read={rIndex => {
                          messageList[rIndex].state = 1;
                          this.setState({
                            messageList,
                            msgNum: msgNum - 1
                          });
                        }}
                      ></MessageItem>
                        );
                      })
                    )
                  : (
                  <View className='no-message flex'>
                    <View className='bg'></View>
                    <Text>{i18n.chain.userMessage.noData}</Text>
                    <View className='go-btn' onClick={this.goUrl.bind(this)}>
                      {i18n.chain.userMessage.use}
                    </View>
                  </View>
                    )}
              </View>
            </ScrollView>
              )
            : null}

          {tab === 2
            ? (
            <View className='message-content'>
              <View className='problem'>
                <View className='problem-title'>{i18n.chain.userMessage.common}</View>
                {problemList.map((item, index) => {
                  return (
                    <ProblemItem
                      item={item}
                      key={item.title}
                      index={index}
                    ></ProblemItem>
                  );
                })}
              </View>
            </View>
              )
            : null}
        </View>
      </Page>
    );
  }
}
export default Message;
