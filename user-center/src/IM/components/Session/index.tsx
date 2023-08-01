import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useState } from 'react';
import utils from '@utils/index';
import doctorImage from '@assets/ally.png';
import defaultUserAvatar from '@assets/user.png';
// import arrow from '@assets/double-arrow.png';
import { ISessionItem } from '../../interfaces';
import './index.scss';

interface IProps {
  talk: ISessionItem;
  answerQuestion: (data: any) => void;
}
function Session (props: IProps) {
  const { userInfo } = utils.appConfig;
  const { talk } = props;
  const { content, diagnoseType } = talk;
  const { type, localType, msg, sendor, state } = content || {};
  const { avatarUrl = '' } = Taro.getStorageSync(userInfo);
  const [selectText, setSelectText] = useState('');
  const clickItem = answer => {
    setSelectText(answer);
    props.answerQuestion({
      msg: answer
    });
  };
  return (
    <View className='component-session flex'>
      <View className={`session flex ${sendor === 1 ? 'session-user' : ''}`}>
        {sendor && state !== 5
          ? (
          <Image
            src={sendor === 1 ? avatarUrl || defaultUserAvatar : doctorImage}
            className='header'
          ></Image>
            )
          : null}
        <View className='content'>
          {sendor === 2 && state !== 5 && <View className='name'>Ally</View>}
          <View className={`message-content ${localType === 2 ? 'no-bg' : ''}`}>
            {diagnoseType !== 5 && localType === 2
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
              : (
                  diagnoseType !== 5 &&
              state !== 5 && (
                <View
                  className={`message ${
                    sendor === 1 ? 'message-text-user' : ''
                  }`}
                >
                  <View className='message-text'>
                    {msg}
                    {sendor === 2 && type === 8 && (
                      <View
                        className='link'
                        onClick={() => {
                          const { userInfo } = utils.appConfig;
                          const user = Taro.getStorageSync(userInfo) || {};
                          const { token } = user;
                          Taro.redirectTo({
                            url: `/pages/webview/index?url=${utils.appConfig.SERVICE_URL}questionnaire/hra/start&code=BoRTUK&token=${token}`
                          });
                        }}
                      >
                        点击了解{'>>'}
                      </View>
                    )}
                  </View>
                  {content.answerType === 1 &&
                    content.answers &&
                    content.answers.length && (
                      <View className='question-select'>
                        {content.answers.map((answer: any) => {
                          return (
                            <View
                              className={`select-item ${
                                selectText === answer ? 'select' : ''
                              }`}
                              key={answer}
                              onClick={() => {
                                clickItem(answer);
                              }}
                            >
                              <View className='item-content'>{answer}</View>
                            </View>
                          );
                        })}
                      </View>
                  )}
                </View>
                  )
                )}
          </View>
        </View>
        {state === 5
          ? (
          <View className='comment-end flex'>
            <View className='end-text'>{msg}</View>
          </View>
            )
          : null}
      </View>
    </View>
  );
}
export default Session;
