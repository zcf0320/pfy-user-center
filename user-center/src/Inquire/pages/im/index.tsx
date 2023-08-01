/* eslint-disable multiline-ternary */
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView, Image, Input } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { IStoreProps } from '@reducers/interface';
import { upload } from '@actions/common';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as inquireApi from '@actions/inquire';
import utils from '@utils/index';
import i18n from '@i18n/index';
import * as actions from '../actions';
import { CommentItem } from '../../types';
import Session from '../../component/Session';
import WS from '../../../utils/socket';
import { commonAnswer, commonQuestion } from '../../common';
import './index.scss';

const { ossHost } = utils.appConfig;
let ws;
let isGoManual = false;
interface IProps {
  actions: any;
  reducers: any;
}
interface IState {
  screenHeight: string;
  inquiryRecord: Array<number>;
  continueId: string;
  recordIndex: number;
  lookRecordStatus: boolean;
  scrollIntoView: string;
  // 是否显示人工问诊输入框
  showInput: boolean;
  manualLaborServiceRecordIdList: Array<string>;
  inputValue: string;
  showManual: boolean;
  navigationBarTitleText: string;
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
      // 聊天记录id
      inquiryRecord: [],
      continueId: '',
      recordIndex: 0,
      lookRecordStatus: false,
      showInput: false,
      scrollIntoView: '',
      manualLaborServiceRecordIdList: [],
      inputValue: '',
      showManual: false,
      navigationBarTitleText: i18n.chain.intelligentInquiry.title
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    // 设置滚动容器高度
    const { serviceRecordId, serviceType } =
      (router?.params && router.params) || {};
    //  先模拟人工 一进来就会连webscoket
    const { xAccessToken } = utils.appConfig;
    this.getScrollHeight(false);
    const token = Taro.getStorageSync(xAccessToken);
    ws = new WS(
      `${utils.appConfig.WSS_URL}${token}/${
        serviceType === '1' ? 'AI' : 'DOCTOR'
      }`,
      this.callback
    );
    ws.createWebSocket();
    const { recordList } = this.props.reducers;
    const { chatInfo } = this.props.reducers.inquire;
    const postData: any = {
      showLoading: false
    };

    if (serviceRecordId) {
      this.props.actions.setServiceRecordId(serviceRecordId);
      postData.serviceRecordId = serviceRecordId;
    }
    const { dockorId } = chatInfo;
    let navigationBarTitleText = i18n.chain.intelligentInquiry.title;
    serviceType === '2' &&
      (navigationBarTitleText = i18n.chain.intelligentInquiry.peopleInquiry);
    this.setState({
      navigationBarTitleText
    });
    Taro.setNavigationBarTitle({
      title: navigationBarTitleText
    });
    // if(serviceType === '2') {
    //     postData.serviceRecordId = router?.params&&router.params.serviceRecordId
    // }
    inquireApi.getManualLaborServiceRecordIds().then((result: any) => {
      this.setState({
        manualLaborServiceRecordIdList: result,
        showManual: result.length && serviceType === '1'
      });
    });
    inquireApi.getUserSelectItem(postData).then((res: any) => {
      const { continueId, list, start } = res;
      const msg =
        serviceType === '1'
          ? i18n.chain.intelligentInquiry.aiFirstTip
          : i18n.chain.intelligentInquiry.peopleFirstTip;
      const localType: number[] = [];
      start && localType.push(1);
      continueId && localType.push(2);
      list && list.length && localType.push(3);
      recordList.push({
        diagnoseType: 1, // 1ai 2人工
        serviceRecordId: serviceRecordId, // 服务记录id
        chartRecordId: '', // 聊天记录id
        content: {
          type: 1, // 1文本，2文件url，3欢迎语
          localType,
          msg, // 消息内容
          time: new Date().getTime(),
          sendor: 2, // 1为用户，2为医生
          receiverId: dockorId || '231321'
        }
      });
      this.props.actions.changeRecordList(recordList);
      this.setState({
        inquiryRecord: list || [],
        continueId
      });
    });
  }

  componentWillUnmount () {
    const { router } = getCurrentInstance();
    const {
      serviceRecordId,
      diagnoseRecordId,
      dockorId
    } = this.props.reducers.inquire.chatInfo;
    const { serviceType } = (router?.params && router.params) || {};
    const { continueId } = this.state;
    const data = {
      diagnoseType: Number(serviceType), // 1ai 2人工
      chartRecordId: diagnoseRecordId || continueId,
      serviceRecordId:
        serviceRecordId || (router?.params && router.params.serviceRecordId),
      content: {
        state: 6,
        sendor: 1, // 1为用户，2为医生
        receiverId: dockorId // 医生是employeeNo，患者是userId,
      }
    };
    ws.sendSocketMessage(data);
    ws.close();
    isGoManual = false;
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
    const { showInput } = this.state;
    const { diagnoseType, content } = data;
    if (data === 'close') {
      this.setState({
        showInput: false
      });
      return;
    }

    if (!showInput && diagnoseType === 2 && content.type !== 3) {
      this.getScrollHeight(true);
    }
    if (
      data.content.state === 3 ||
      data.content.state === 5 ||
      data.content.state === 1
    ) {
      this.getScrollHeight(false);
    }
    // data.serviceRecordId = router?.params&&router.params.serviceRecordId;
    await this.props.actions.changeRecordList(commonQuestion(recordList, data));
    this.setScrollView();
  };

  // 开始问诊
  startAsking = () => {
    const { router } = getCurrentInstance();
    const { recordList } = this.props.reducers;
    const { serviceType } = (router?.params && router.params) || {};
    const { serviceRecordId, dockorId } = this.props.reducers.inquire.chatInfo;

    if (serviceType === '1') {
      recordList.push({
        diagnoseType: 1, // 1ai 2人工
        serviceRecordId:
          serviceRecordId || (router?.params && router.params.serviceRecordId), // 服务记录id
        chartRecordId: '', // 聊天记录id
        content: {
          type: 1, // 1文本，2文件url，3欢迎语
          localType: [],
          msg: i18n.chain.intelligentInquiry.start, // 消息内容
          time: new Date().getTime(),
          sendor: 1, // 1为用户，2为医生
          state: 0, // 0 开始 1 挂起 2 正常 4取消 6关闭
          receiverId: '231321' // 医生是employeeNo，患者是userId,
        }
      });
      recordList.push({
        diagnoseType: 1, // 1ai 2人工
        serviceRecordId, // 服务记录id
        chartRecordId: '', // 聊天记录id
        content: {
          type: 1, // 1文本，2文件url，3欢迎语
          localType: [4],
          msg: i18n.chain.intelligentInquiry.selectSymptoms, // 消息内容
          time: new Date().getTime(),
          sendor: 2, // 1为用户，2为医生
          receiverId: dockorId // 医生是employeeNo，患者是userId,
        }
      });
      this.props.actions.changeRecordList(recordList);
    }
    if (serviceType === '2') {
      const vm = this;
      inquireApi
        .checkManualLaborState({
          serviceRecordId: router?.params && router.params.serviceRecordId
        })
        .then((result: any) => {
          // eslint-disable-next-line no-shadow
          const { queueState, diagnoseRecordId, dockorId } = result;
          if (queueState !== 2) {
            Taro.showToast({
              title: i18n.chain.intelligentInquiry.busy,
              icon: 'none'
            });
            return;
          }
          vm.props.actions.setChatInfo(result);
          const data = {
            queueState, // 队列未满
            diagnoseType: 2, // 1ai 2人工
            serviceRecordId: router?.params && router.params.serviceRecordId, // 服务记录id
            chartRecordId: diagnoseRecordId,
            content: {
              type: 1, // 1文本，2文件url，3 欢迎语
              localType: [],
              msg: i18n.chain.intelligentInquiry.start, // 消息内容
              time: new Date().getTime(),
              sendor: 1, // 1为用户，2为医生
              receiverId: dockorId, // 医生是employeeNo，患者是userId,
              state: 0
            }
          };
          ws.sendSocketMessage(data);
          this.props.actions.changeRecordList(commonQuestion(recordList, data));
        });
    }
  };

  // 回答问题
  answerQuestion = async data => {
    ws.sendSocketMessage(data);
    const { recordList } = this.props.reducers;
    await this.props.actions.changeRecordList(commonAnswer(recordList, data));
    this.setScrollView();
  };

  // 评论
  comment = (comment: CommentItem) => {
    inquireApi.comment(comment).then(() => {
      const { recordIndex } = comment;
      const { recordList } = this.props.reducers;
      // 更改评价状态
      recordList[recordIndex].content.localType.push(8);
      recordList[recordIndex].content.comment = comment.comment;
      this.props.actions.changeRecordList(recordList);
    });
  };

  // 获取问诊记录
  getRecordInfo = () => {
    const { router } = getCurrentInstance();
    const { continueId } = this.state;
    let { recordList } = this.props.reducers;
    const { serviceType } = (router?.params && router.params) || {};
    const { serviceRecordId, dockorId } = this.props.reducers.inquire.chatInfo;
    inquireApi
      .getRecordInfo({
        recordId: continueId
      })
      .then((res: any) => {
        recordList.push({
          diagnoseType: serviceType === '2' ? 2 : 1, // 1ai 2人工
          serviceRecordId:
            serviceRecordId ||
            (router?.params && router.params.serviceRecordId), // 服务记录id
          chartRecordId: continueId, // 聊天记录id
          content: {
            type: 1, // 1文本，2文件url，3欢迎语
            localType: [],
            msg: i18n.chain.intelligentInquiry.continue, // 消息内容
            time: new Date().getTime(),
            sendor: 1, // 1为用户，2为医生
            receiverId: dockorId // 医生是employeeNo，患者是userId,
          }
        });
        if (serviceType === '2') {
          const vm = this;
          inquireApi
            .onlyCheckManualLaborState({
              serviceRecordId: router?.params && router.params.serviceRecordId
            })
            .then((result: any) => {
              const { queueState, dockorId: receiverId } = result;
              if (queueState !== 2) {
                Taro.showToast({
                  title: i18n.chain.intelligentInquiry.busy,
                  icon: 'none'
                });
                return;
              }
              result.chartRecordId = continueId;
              vm.props.actions.setChatInfo(result);
              ws.sendSocketMessage({
                diagnoseType: serviceType === '2' ? 2 : 1,
                chartRecordId: continueId,
                queueState,
                content: {
                  type: 3,
                  msg: i18n.chain.intelligentInquiry.continue,
                  time: new Date().getTime(),
                  receiverId,
                  sendor: 1,
                  state: 0
                }
              });
            });
        }
        // 添加选择答案状态, 问诊记录id
        res.history.forEach(item => {
          item.chartRecordId = continueId;
          item.content.localType = [5];
        });

        // 继续上次问诊记录
        recordList = [...recordList, ...res.history];
        this.props.actions.changeRecordList(recordList);
      });
  };

  // 获取问诊记录
  unShiftRecordList = (recordId: number, recordIndex: number) => {
    let { recordList } = this.props.reducers;
    inquireApi
      .getRecordInfo({
        recordId
      })
      .then((res: any) => {
        // // 添加选择答案状态, 问诊记录id
        let conclusionIndex;
        res.history.forEach((item, index) => {
          item.content.localType = [5];
          item.content.conclusion && (conclusionIndex = index);
        });
        conclusionIndex &&
          (res.history[conclusionIndex].content.localType = [6]);
        conclusionIndex &&
          res.history.splice(conclusionIndex, 0, {
            diagnoseType: res.history[conclusionIndex].diagnoseType,
            content: {
              sendor: 2,
              recordId: res.recordId,
              msg: i18n.chain.intelligentInquiry.giveResult,
              localType: [],
              type: 1
            }
          });
        // 往前插入历史记录
        recordList = [...res.history, ...recordList];
        this.props.actions.changeRecordList(recordList);
        this.setState({
          recordIndex: recordIndex + 1,
          scrollIntoView: `id${res.history.length}`
        });
      });
  };

  // 查看历史记录
  lookRecord = () => {
    this.setState(
      {
        lookRecordStatus: true
      },
      () => {
        this.scrollToUpper();
      }
    );
  };

  // 下拉刷新
  scrollToUpper = () => {
    const { inquiryRecord, recordIndex, lookRecordStatus } = this.state;

    // 允许查看历史记录才能下拉刷新
    if (lookRecordStatus) {
      if (inquiryRecord.length && recordIndex <= inquiryRecord.length - 1) {
        this.unShiftRecordList(inquiryRecord[recordIndex], recordIndex);
      } else {
        Taro.showToast({
          title: i18n.chain.intelligentInquiry.noHistory,
          icon: 'none'
        });
      }
    }
  };

  getScrollHeight (showInput = false) {
    // const { showInput } = this.state
    const systemInfo = Taro.getSystemInfoSync();
    const { windowHeight } = systemInfo;
    const { isH5 } = utils.appConfig;
    let scrollHeight = windowHeight;
    scrollHeight = isH5 ? scrollHeight - 92 : scrollHeight - 48;
    // iphonex 以上的安全区域
    !isH5 && utils.hasSafeArea() && (scrollHeight = scrollHeight - 68);
    showInput && (scrollHeight = scrollHeight - 64);
    this.setState(
      {
        screenHeight: `${scrollHeight}px`
      },
      () => {
        this.setState({
          showInput
        });
      }
    );
  }

  // 大于5分钟
  showTime (index): boolean {
    const { recordList } = this.props.reducers;
    let result = false;
    if (index) {
      const time = recordList[index].content.time;
      const preTime = recordList[index - 1].content.time;
      result = time - preTime > 5 * 60000;
    } else {
      result = true;
    }
    return result;
  }

  // 上传图片
  uploadImg = () => {
    const { router } = getCurrentInstance();
    const vm = this;
    const { continueId } = this.state;
    const {
      serviceRecordId,
      diagnoseRecordId,
      dockorId
    } = this.props.reducers.inquire.chatInfo;
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
            queueState: 2, // 队列未满
            diagnoseType: 2, // 1ai 2人工
            serviceRecordId:
              serviceRecordId ||
              (router?.params && router.params.serviceRecordId), // 服务记录id
            chartRecordId: diagnoseRecordId || continueId,
            content: {
              type: 2, // 1文本，2文件url，3欢迎语
              localType: [],
              msg: JSON.parse(res2).data, // 消息内容
              time: new Date().getTime(),
              sendor: 1, // 1为用户，2为医生
              receiverId: dockorId, // 医生是employeeNo，患者是userId,
              state: 2
            }
          };
          vm.answerQuestion(data);
        });
      }
    });
  };

  // 去人工
  goManual = () => {
    if (isGoManual) {
      return;
    }
    const { manualLaborServiceRecordIdList } = this.state;
    const { recordList } = this.props.reducers;
    const vm = this;
    Taro.showModal({
      content: i18n.chain.intelligentInquiry.sureConsultation,
      cancelColor: '#999999',
      confirmColor: '#FE9A51',
      success (res) {
        if (res.confirm) {
          inquireApi
            .checkManualLaborState({
              serviceRecordId: manualLaborServiceRecordIdList[0]
            })
            .then((result: any) => {
              const { queueState, diagnoseRecordId, dockorId } = result;
              if (queueState !== 2) {
                Taro.showToast({
                  title: i18n.chain.intelligentInquiry.busy,
                  icon: 'none'
                });
                return;
              }
              isGoManual = true;
              vm.setState({
                showManual: false
              });
              vm.props.actions.setChatInfo(result);
              const data = {
                queueState, // 队列未满
                diagnoseType: 2, // 1ai 2人工
                serviceRecordId: manualLaborServiceRecordIdList[0], // 服务记录id
                chartRecordId: diagnoseRecordId,
                content: {
                  type: 1, // 1文本，2文件url，3欢迎语
                  localType: [],
                  msg: i18n.chain.intelligentInquiry.start, // 消息内容
                  time: new Date().getTime(),
                  sendor: 1, // 1为用户，2为医生
                  receiverId: dockorId, // 医生是employeeNo，患者是userId,
                  state: 0
                }
              };
              ws.sendSocketMessage(data);
              vm.props.actions.changeRecordList(
                commonQuestion(recordList, data)
              );
            });
        }
      }
    });
  };

  render () {
    const {
      screenHeight,
      lookRecordStatus,
      navigationBarTitleText,
      scrollIntoView,
      inputValue,
      showInput,
      showManual,
      continueId
    } = this.state;
    const { recordList } = this.props.reducers;
    const scrollStyle = {
      height: screenHeight
    };
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={navigationBarTitleText}>
        <View className='im-page'>
          <View className='tips'>{i18n.chain.intelligentInquiry.topTip}</View>
          <ScrollView
            scrollY
            scrollWithAnimation
            style={scrollStyle}
            onScrollToUpper={this.scrollToUpper}
            scrollIntoView={scrollIntoView}
          >
            <View id='container' className='container'>
              {recordList.length
                ? recordList.map((record: any, recordIndex: number) => {
                  return (
                      <View id={`id${recordIndex}`} key={record.id}>
                        <Session
                          // 会话得内容
                          talk={record}
                          recordIndex={recordIndex}
                          // 所有得会话条数 用于判断是否禁止回答
                          allRecordList={recordList.length}
                          last={!!(recordList.length === recordIndex + 1)}
                          // 是否有人工权益
                          hasPeople={showManual}
                          showTime={this.showTime(recordIndex)}
                          answerQuestion={this.answerQuestion}
                          start={this.startAsking}
                          lookRecord={this.lookRecord}
                          lookRecordStatus={lookRecordStatus}
                          getRecordInfo={this.getRecordInfo}
                          sureComment={this.comment}
                          goManual={this.goManual}
                        ></Session>
                      </View>
                  );
                })
                : null}
            </View>
          </ScrollView>
          {showManual ? (
            <View className='tab'>
              <View
                className='header'
                onClick={() => {
                  this.goManual();
                }}
              ></View>
            </View>
          ) : null}
          {showInput ? (
            <View className='input-content flex'>
              <Image
                src={`${ossHost}images/camera.png`}
                className='camera-icon'
                onClick={() => {
                  this.uploadImg();
                }}
              ></Image>
              <Input
                className='input'
                placeholder={i18n.chain.intelligentInquiry.pleaseInput}
                placeholderClass='placeholder'
                value={inputValue}
                onInput={e => {
                  this.setState({
                    inputValue: e.detail.value
                  });
                }}
              ></Input>
              <View
                className='send flex'
                onClick={() => {
                  if (!inputValue) {
                    return;
                  }
                  const {
                    serviceRecordId,
                    diagnoseRecordId,
                    dockorId
                  } = this.props.reducers.inquire.chatInfo;
                  const data = {
                    queueState: 2, // 队列未满
                    diagnoseType: 2, // 1ai 2人工
                    serviceRecordId:
                      serviceRecordId ||
                      (router?.params && router.params.serviceRecordId), // 服务记录id
                    chartRecordId: diagnoseRecordId || continueId,
                    content: {
                      type: 1, // 1文本，2文件url，3欢迎语
                      localType: [],
                      state: 2,
                      msg: inputValue, // 消息内容
                      time: new Date().getTime(),
                      sendor: 1, // 1为用户，2为医生
                      receiverId: dockorId // 医生是employeeNo，患者是userId,
                    }
                  };
                  this.answerQuestion(data);
                  this.setState({
                    inputValue: ''
                  });
                }}
              >
                {i18n.chain.intelligentInquiry.send}
              </View>
            </View>
          ) : null}
        </View>
      </Page>
    );
  }
}
export default IM;
