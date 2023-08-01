import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Textarea } from '@tarojs/components';
import Page from '@components/page';
import { connect } from 'react-redux';
import { SET_QUESTION_LIST } from '@constants/insurance';
import { SET_MODAL } from '@constants/common';
import { getQuestionList, personalInsuranceCreate } from '@actions/insurance';
import { PersonalInfo } from '../create/type';
import './index.scss';

interface IProps{
    questionList: Array<any>;
    setQuestion: Function;
    insuranceDetail: any;
    setCustomModal: Function;
    personInsuranceInfo: PersonalInfo;
}
interface IState{
    questionIndex: number;
}

@connect(state => {
  return Object.assign({}, state.common, state.insurance);
}, dispatch => ({
  setCustomModal (data) {
    dispatch({
      type: SET_MODAL,
      payload: data
    });
  },
  setQuestion (data) {
    dispatch({
      type: SET_QUESTION_LIST,
      payload: data
    });
  }
}))
class HealthQuestion extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      questionIndex: 0
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.getQuestion(router?.params && router.params.id, false);
  }

    config: Config = {
      navigationBarTitleText: '健告问卷'
    }

    getQuestion = (questionId, isAddIndex = true) => {
      const { questionList } = this.props;
      const { questionIndex } = this.state;
      // todo
      getQuestionList({ questionId }).then(async res => {
        questionList.push(res);
        await this.props.setQuestion(questionList);
        isAddIndex && this.setState({
          questionIndex: questionIndex + 1
        });
      });
    }

    watchData = () => {
      const { questionIndex } = this.state;
      const { questionList } = this.props;
      const { answerList, answerContent, type } = questionList[questionIndex] || {};
      let selectList = [];
      if (answerList && answerList.length) {
        selectList = answerList.filter((item) => {
          return item.select;
        });
      }
      if (type === 3) {
        return !!(answerContent);
      }
      return !!(selectList.length);
    }

    selectAnswer = (index) => {
      const { questionIndex } = this.state;
      const { questionList } = this.props;
      const { answerList } = questionList[questionIndex] || {};
      answerList.forEach((item, aIndex) => {
        item.select = false;
        aIndex === index && (item.select = true);
      });
      this.props.setQuestion(questionList);
    }

    onInputAnswer= (e) => {
      const { questionIndex } = this.state;
      const { questionList } = this.props;
      // const { answerList } = questionList[questionIndex] || {}
      questionList[questionIndex].answerContent = e.detail.value;
      // answerList.map((item, aIndex) => {
      //     item.select = false
      //     aIndex === index && (item.select = true)
      // })
      this.props.setQuestion(questionList);
    }

    next = () => {
      if (!this.watchData()) {
        return;
      }
      const vm = this;
      const { questionIndex } = this.state;
      const { questionList } = this.props;
      const { answerList, oldSelectIndex, type } = questionList[questionIndex] || {};
      let selectAnswerIndex;
      answerList.forEach((item, index) => {
        item.select && (selectAnswerIndex = index);
      });
      type === 3 && (selectAnswerIndex = 0);
      if (oldSelectIndex !== undefined) {
        // 判断现在的选择跟原来的选择是否一致, 如果一致可以下一题 不一致就删除后面的数据重新拿问卷
        if (oldSelectIndex === selectAnswerIndex) {
          this.setState({
            questionIndex: questionIndex + 1
          });
        } else {
          // 不一致则重新获取下一题内容
          questionList[questionIndex].oldSelectIndex = selectAnswerIndex;
          // 当前题后面的不要了
          questionList.splice(questionIndex + 1, questionList.length - questionIndex - 1);
          this.props.setQuestion(questionList);
          this.getQuestion(answerList[selectAnswerIndex].nextNumber);
        }
      } else {
        if (answerList[selectAnswerIndex].jumpType === 2) {
          this.props.setCustomModal({
            show: true,
            content: '恭喜您已完成问卷，是否确认提交？',
            cancelText: '取消',
            confirmText: '确认',
            clickCancel: () => {
            },
            clickConfirm: () => {
              vm.save();
            }
          });
          return;
        }
        questionList[questionIndex].oldSelectIndex = selectAnswerIndex;
        this.props.setQuestion(questionList);
        this.getQuestion(answerList[selectAnswerIndex].nextNumber);
        // this.setState({
        //     questionIndex: questionIndex + 1
        // })
      }
    }

    save () {
      const { personInsuranceInfo, questionList } = this.props;
      const questionnaireContent = [] as any;
      questionList.forEach((item) => {
        const { answerList, type } = item;
        let answerId = null;
        let conclusionId = null;
        let answerContent = null;
        answerList.forEach((aItem) => {
          if (aItem.select) {
            answerId = aItem.answerID;
            aItem.jumpType === 2 && (conclusionId = aItem.nextNumber);
          }
          if (type === 3) {
            answerContent = item.answerContent;
            aItem.jumpType === 2 && (conclusionId = aItem.nextNumber);
          }
        });
        questionnaireContent.push({
          answerId: answerId,
          conclusionId,
          answerContent,
          questionId: item.questionID
        });
      });
      const insureQuestionnaire = {
        questionnaireContent
      };
      personInsuranceInfo.insureQuestionnaire = insureQuestionnaire;
      personalInsuranceCreate(personInsuranceInfo).then(res => {
        Taro.redirectTo({
          url: `/Insurance/pages/group/detail/index?id=${res}&type=1`
        });
      });
    }

    render () {
      const { questionIndex } = this.state;
      const { questionList } = this.props;
      const { questionName, answerList, type, answerContent } = questionList[questionIndex] || {};
      return (
            <Page title='健告问卷' showBack>
                <View className='page-health-question'>
                    <View className='health-question'>
                        {
                            questionList.length
                              ? <View className='question-list flex'>
                                <View className='question-name'>
                                    {
                                        questionName
                                    }
                                </View>
                                {
                                    answerList.length && type !== 3
                                      ? answerList.map((item, index) => {
                                        return <View key={item.optionName} className={`question-option ${item.select ? 'active' : ''}`} onClick={() => {
                                          this.selectAnswer(index);
                                        }}
                                        >{item.optionName}</View>;
                                      })
                                      : null
                                }
                                {
                                    type === 3
                                      ? <Textarea className='user-answer' maxlength={300} value={answerContent} onInput={(e) => {
                                        this.onInputAnswer(e);
                                      }} placeholder='描述您本次所患的症状（300字以内）' placeholderClass='placeholder'
                                      ></Textarea>
                                      : null
                                }

                            </View>
                              : null
                        }

                    </View>
                    <View className='pre-next flex'>
                    {questionIndex
                      ? <View className='pre' onClick={() => {
                        this.setState({
                          questionIndex: questionIndex - 1
                        });
                      }}
                      >上一步</View>
                      : null}
                    <View className={`next flex ${this.watchData() ? 'active' : ''}`} onClick={this.next}>下一步</View>
                </View>
                </View>
            </Page>
      );
    }
}
export default HealthQuestion;
