import Taro from '@tarojs/taro';
import { View, ScrollView, Image, Input } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WS from '@utils/socket';
import Page from '@components/page';
import { IStoreProps } from '@reducers/interface';
import { upload } from '@actions/common';
import utils from '@utils/index';
import starCoin from '@assets/star-coin.png';
import Session from '../components/Session';
import * as actions from '../actions';
import { commonAnswer, commonQuestion } from '../common';
// import { ISessionItem } from '../interfaces/index';
import './index.scss';

const { ossHost } = utils.appConfig;
let ws;
interface IProps {
  actions: any;
  reducers: any;
}
interface IState {
  screenHeight: string;
  scrollIntoView: string;
  inputValue: string;
  showCoin: boolean;
  coinNum: number;
}
type PropsType = IStoreProps & IProps;

@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: {
          inquire: state.inquire,
          recordList: state.inquire.recordList
        }
      }
    );
  },
  dispatch => {
    return Object.assign(
      {},
      {
        actions: bindActionCreators(actions, dispatch)
      }
    );
  }
)
class IM extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      screenHeight: '',
      scrollIntoView: '',
      inputValue: '',
      showCoin: false,
      coinNum: 0
    };
  }

  componentDidMount () {
    const { xAccessToken } = utils.appConfig;
    this.getScrollHeight();

    const token = Taro.getStorageSync(xAccessToken);
    ws = new WS(`${utils.appConfig.WSS_URL}${token}/HDQ`, this.callback);
    ws.createWebSocket();
  }

  componentWillUnmount () {
    const data = {
      diagnoseType: 4,
      content: {
        state: 6,
        sendor: 1, // 1为用户，2为医生
        receiver: 2 // 医生是employeeNo，患者是userId,
      }
    };
    ws.sendSocketMessage(data);
    ws.close();

    this.props.actions.changeRecordList([]);
  }

  setScrollView () {
    const { recordList } = this.props.reducers;
    this.setState({
      scrollIntoView: `id${recordList.length - 1}`
    });
  }

  callback = async data => {
    const { recordList } = this.props.reducers;

    if (data === 'close') {
      return;
    }

    await this.props.actions.changeRecordList(commonQuestion(recordList, data));

    // if (
    //   record.payload &&
    //   record.payload[record.payload.length - 1].diagnoseType === 5
    // ) {
    //   this.setState(
    //     {
    //       showCoin: true,
    //       coinNum: record.payload[record.payload.length - 1].coinNum!
    //     },
    //     () => {
    //       setTimeout(() => {
    //         this.setState({
    //           showCoin: false,
    //           coinNum: 0
    //         });
    //       }, 1500);
    //     }
    //   );
    // } else {
    this.setScrollView();
    // }
  };

  getScrollHeight () {
    const systemInfo = Taro.getSystemInfoSync();
    const { windowHeight } = systemInfo;

    let scrollHeight = (windowHeight * 3) / 4;
    if (Taro.getEnv() === 'WEAPP') {
      scrollHeight = windowHeight - 44 - 100;
    }
    this.setState({
      screenHeight: `${scrollHeight}px`
    });
  }

  // 上传图片
  uploadImg = () => {
    const vm = this;
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        upload({
          filePath: tempFilePaths[0],
          module: 'chat'
        }).then((res2: any) => {
          const data = {
            localType: 2,
            answerType: 4,
            msg: JSON.parse(res2).data // 消息内容
          };
          vm.answerQuestion(data);
        });
      }
    });
  };

  // 回答问题
  answerQuestion = async data => {
    const { recordList } = this.props.reducers;
    const newData = {
      queueState: 2,
      diagnoseType: 4,
      userId: recordList[recordList.length - 1].userId,
      content: {
        sendor: 1,
        receiver: 2,
        answerType: data.localType === 2 ? 4 : '',
        type: recordList[recordList.length - 1].content.type,
        time: new Date().getTime(),
        questionId: recordList[recordList.length - 1].content.questionId,
        msg: data.msg,
        localType: data.localType
      }
    };

    ws.sendSocketMessage(newData);

    await this.props.actions.changeRecordList(commonAnswer(recordList, data));

    this.setScrollView();
  };

  sendMessage = () => {
    const { inputValue } = this.state;
    if (!inputValue) {
      return;
    }

    const data = {
      localType: 1,
      msg: inputValue // 消息内容
    };
    this.answerQuestion(data);
    this.setState({
      inputValue: ''
    });
  };

  render () {
    const {
      screenHeight,
      scrollIntoView,
      inputValue,
      showCoin,
      coinNum
    } = this.state;
    const scrollStyle = {
      height: screenHeight
    };
    const { recordList } = this.props.reducers;
    return (
      <Page showBack title='创建我的档案'>
        <View className='im-page'>
          <View className='tips'>
            回复健康信息，获得星矿
            <Image className='tips-img' src={starCoin}></Image>
            奖励，星矿可兑换平台礼品呦～
          </View>
          {showCoin && (
            <View className='show-coin animated zoomIn'>
              <Image className='coin-img' src={starCoin}></Image>+{coinNum}
            </View>
          )}

          <ScrollView
            scrollY
            scrollWithAnimation
            style={scrollStyle}
            scrollIntoView={scrollIntoView}
          >
            <View id='container' className='container'>
              {recordList.length
                ? recordList.map((record: any, recordIndex: number) => {
                  return (
                    record.diagnoseType !== 5 && (
                        <View id={`id${recordIndex}`} key={recordIndex}>
                          <Session
                            talk={record}
                            answerQuestion={this.answerQuestion}
                          ></Session>
                        </View>
                    )
                  );
                })
                : null}
            </View>
          </ScrollView>
          <View className='im-input-content'>
            <Image
              src={`${ossHost}images/camera.png`}
              className='camera-icon'
              onClick={() => {
                this.uploadImg();
              }}
            ></Image>
            <View className='input'>
              <Input
                placeholderClass='placeholder'
                value={inputValue}
                adjustPosition
                alwaysEmbed
                cursorSpacing={15}
                onInput={e => {
                  this.setState({
                    inputValue: e.detail.value
                  });
                }}
              ></Input>
            </View>

            <View
              className='send flex'
              onClick={() => {
                this.sendMessage();
              }}
            >
              发送
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default IM;
