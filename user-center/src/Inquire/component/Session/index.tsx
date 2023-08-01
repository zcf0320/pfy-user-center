import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import i18n from '@i18n/index';
import utils from '@utils/index';
import doctorImage from '../../images/doctor.png';
import robot from '../../images/bot.png';
import { SeesionItem, CommentItem } from '../../types';

import './index.scss';

interface IProps {
  talk: SeesionItem;
  recordIndex: number;
  allRecordList: number;
  last: boolean;
  hasPeople: boolean;
  showTime: boolean;
  start?: (recordIndex: number) => void;
  getRecordInfo?: () => void;
  lookRecord: () => void;
  sureComment: (data: CommentItem) => void;
  answerQuestion: (data: any) => void;
  goManual: () => void;
  lookRecordStatus: boolean;
}
function Session (props: IProps) {
  const { userInfo } = utils.appConfig;
  const { talk, last, recordIndex, showTime, lookRecordStatus } = props;
  const { content, diagnoseType, chartRecordId, serviceRecordId } = talk;
  const { conclusion, type, msg, time, sendor, questionId, aiConclusions } =
    content || {};

  const { avatarUrl = '' } = Taro.getStorageSync(userInfo);
  const [comment, setComment] = useState(content.comment || 0);
  // 回答是否
  const answerAsk = (status: boolean) => {
    props.answerQuestion &&
      props.answerQuestion({
        chartRecordId,
        diagnoseType: 1,
        content: {
          msg: status ? i18n.chain.intelligentInquiry.yes : i18n.chain.intelligentInquiry.no,
          questionId,
          type: 1,
          state: 2
        }
      });
  };
  //  确认评价
  const sureComment = () => {
    if (!comment) {
      Taro.showToast({
        title: i18n.chain.intelligentInquiry.selectComment,
        icon: 'none',
        duration: 1500
      });
      return;
    }
    props.sureComment({
      recordId: chartRecordId,
      comment,
      recordIndex
    });
  };
  return (
    <View className='component-session flex'>
      {showTime && (
        <View className='session-time flex'>
          <View className='time'>{utils.chatTimeTransform(time)}</View>
        </View>
      )}

      {/* 如果是user就加 user classname */}
      <View className={`session flex ${sendor === 1 ? 'session-user' : ''}`}>
        {sendor
          ? (
          <Image
            src={
              sendor === 1
                ? avatarUrl
                : diagnoseType === 1
                  ? robot
                  : doctorImage
            }
            className='header'
          ></Image>
            )
          : null}
        <View className='content'>
          {sendor === 2 && (
            <View className='name'>
              {diagnoseType === 1 ? 'Ally' : i18n.chain.intelligentInquiry.doctor}
            </View>
          )}
          <View className='message-content'>
            {/* 图片 或者 文本 */}
            {type === 2
              ? (
              <Image
                className='image-file'
                src={msg}
                onClick={() => {
                  Taro.previewImage({
                    current: msg,
                    urls: [msg]
                  });
                }}
              ></Image>
                )
              : null}
            {(type === 1 || type === 3) && (
              <View
                className={`message ${sendor === 1 ? 'message-text-user' : ''}`}
              >
                <View className='message-text'>{msg}</View>
                {content && content.localType.length
                  ? content.localType.map((localType: number) => {
                    if (localType === 1 && last) {
                      return (
                          <View
                            className='question-action'
                            onClick={() => {
                              // 如果存在回答就不允许点击
                              if (!last) {
                                return;
                              }
                              props.start && props.start(recordIndex);
                            }}
                          >
                            {i18n.chain.intelligentInquiry.start}
                          </View>
                      );
                    } else if (localType === 2 && last) {
                      return (
                          <View
                            className='question-action'
                            onClick={() => {
                              props.getRecordInfo && props.getRecordInfo();
                            }}
                          >
                            {i18n.chain.intelligentInquiry.continue}
                          </View>
                      );
                    } else if (localType === 3 && !lookRecordStatus) {
                      return (
                          <View
                            className='question-action'
                            onClick={() => {
                              props.lookRecord && props.lookRecord();
                            }}
                          >
                            {i18n.chain.intelligentInquiry.lookRecord}
                          </View>
                      );
                    } else if (localType === 4 && last) {
                      return (
                          <View
                            className='question-action'
                            onClick={() => {
                              Taro.navigateTo({
                                url: '/Inquire/pages/diagnose/index'
                              });
                            }}
                          >
                            {i18n.chain.intelligentInquiry.toChoose}
                          </View>
                      );
                    } else if (
                      localType === 5 &&
                        last &&
                        diagnoseType === 1
                    ) {
                      return (
                          <View className='question-select'>
                            <View
                              className='select-item'
                              onClick={() => {
                                answerAsk(true);
                              }}
                            >
                              {i18n.chain.intelligentInquiry.yes}
                            </View>
                            <View
                              className='select-item'
                              onClick={() => {
                                answerAsk(false);
                              }}
                            >
                              {i18n.chain.intelligentInquiry.no}
                            </View>
                          </View>
                      );
                    } else {
                      return null;
                    }
                  })
                  : null}
              </View>
            )}
          </View>
          {/* 问诊结果 */}
          {
            diagnoseType !== 1 &&
          conclusion &&
          conclusion.diseaseName &&
          content.localType.includes(6)
              ? (
            <View className='question-ai-conclusion'>
              {/* <View className="ai-top flex">根据您的表述，初步诊断结果为：</View> */}
              <View className='ai-conclusion'>
                <View className='ai-title'>{i18n.chain.intelligentInquiry.possibleDiseases}</View>
                <View className='ai-sub-title'>
                {i18n.chain.intelligentInquiry.resultTip}
                </View>
                <View
                  className='ai-item'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/Inquire/pages/detail/index?diseaseId=${conclusion.diseaseId}&serviceRecordId=${serviceRecordId}&recordId=${chartRecordId}`
                    });
                  }}
                >
                  <View className='ai-item-top flex'>
                    <View className='top-left flex'>
                      <View className='name'>{conclusion.diseaseName}</View>
                      {/* <View className='number'>{item.probability}%</View> */}
                    </View>
                    <View className='top-right flex'>
                      <Text>{i18n.chain.button.detail}</Text>
                      <View className='next'></View>
                    </View>
                  </View>
                  <Text>{conclusion.hospitalDepartment || ''}</Text>
                </View>
              </View>
            </View>
                )
              : null}
          {diagnoseType === 1 &&
          aiConclusions &&
          aiConclusions.length &&
          content.localType.includes(6)
            ? (
            <View className='question-ai-conclusion'>
              {/* <View className="ai-top flex">根据您的表述，初步诊断结果为：</View> */}
              <View className='ai-conclusion'>
                <View className='ai-title'>{i18n.chain.intelligentInquiry.possibleDiseases}</View>
                <View className='ai-sub-title'>
                {i18n.chain.intelligentInquiry.resultTip}
                </View>
                {aiConclusions.map((item, index) => {
                  return index < 3
                    ? (
                    <View
                      className='ai-item'
                      key={item.diseaseId}
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/Inquire/pages/detail/index?diseaseId=${item.diseaseId}&serviceRecordId=${serviceRecordId}&recordId=${chartRecordId}`
                        });
                      }}
                    >
                      <View className='ai-item-top flex'>
                        <View className='top-left flex'>
                          <View className='name'>{item.diseaseName}</View>
                          <View className='number'>
                            {item.probability}%
                          </View>
                        </View>
                        <View className='top-right flex'>
                          <Text>{i18n.chain.button.detail}</Text>
                          <View className='next'></View>
                        </View>
                      </View>
                      <Text>{item.hospitalDepartment || ''}</Text>
                    </View>
                      )
                    : null;
                })}
              </View>
            </View>
              )
            : null}
          {/* 问诊评价 */}
          {content.localType.includes(7)
            ? (
            <View className='question-comment'>
              <View className='content'>
                <View
                  className='item'
                  onClick={() => {
                    if (content.localType.includes(8)) {
                      return;
                    }
                    setComment(1);
                  }}
                >
                  <View
                    className={`comment-img ${
                      comment === 1 ? 'comment-1-hight' : 'comment-1'
                    }`}
                  ></View>
                  <View
                    className={`${
                      comment === 1 ? 'comment-text-active' : 'comment-text'
                    }`}
                  >
                    {i18n.chain.intelligentInquiry.praise}
                  </View>
                </View>
                <View
                  className='item'
                  onClick={() => {
                    if (content.localType.includes(8)) {
                      return;
                    }
                    setComment(2);
                  }}
                >
                  <View
                    className={`comment-img ${
                      comment === 2 ? 'comment-2-hight' : 'comment-2'
                    }`}
                  ></View>
                  <View
                    className={`${
                      comment === 2 ? 'comment-text-active' : 'comment-text'
                    }`}
                  >
                    {i18n.chain.intelligentInquiry.commonly}
                  </View>
                </View>
                <View
                  className='item'
                  onClick={() => {
                    if (content.localType.includes(8)) {
                      return;
                    }
                    setComment(3);
                  }}
                >
                  <View
                    className={`comment-img ${
                      comment === 3 ? 'comment-3-hight' : 'comment-3'
                    }`}
                  ></View>
                  <View
                    className={`${
                      comment === 3 ? 'comment-text-active' : 'comment-text'
                    }`}
                  >
                    {i18n.chain.intelligentInquiry.bad}
                  </View>
                </View>
              </View>
              {!content.localType.includes(8) && (
                <View
                  className={`sure ${comment && 'sure-active'}`}
                  onClick={sureComment}
                >
                  {i18n.chain.button.determine}
                </View>
              )}
            </View>
              )
            : null}
          {/* 结束语 */}
          {content.localType.includes(9)
            ? (
            <View className='comment-end flex'>
              <View className='end-text'>{i18n.chain.intelligentInquiry.consultationOver}</View>
              {props.hasPeople
                ? (
                <View
                  className='people'
                  onClick={() => {
                    props.goManual && props.goManual();
                  }}
                >
                  {i18n.chain.intelligentInquiry.clickCall}
                  <Text className='go-people'>{i18n.chain.intelligentInquiry.peopeleDoctor}</Text>
                </View>
                  )
                : null}
            </View>
              )
            : null}
        </View>
      </View>
    </View>
  );
}
export default Session;
