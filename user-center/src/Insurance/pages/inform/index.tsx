import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { addInsurance } from '@actions/insurance';
import { GET_QUESTIONNAIRE_LIST } from '@constants/insurance';
import { IStoreProps } from '@reducers/interface';
import { connect } from 'react-redux';
import Page from '@components/page';
import Step from '../../component/step';
import './index.scss';

interface IProps {
    setQuestionnaire: Function;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  setQuestionnaire (data) {
    dispatch({
      type: GET_QUESTIONNAIRE_LIST,
      payload: data
    });
  }
}))

class Inform extends Component<PropsType> {
  constructor (props) {
    super(props);
    this.state = {};
  }

  select (questionIndex, answerIndex) {
    const { answers, answerType } = this.props.insurance.questionnaireList[questionIndex];
    // 判断是否单选
    if (answerType === 1) {
      answers.forEach((item, index) => {
        answerIndex !== index && (item.select = false);
      });
      answers[answerIndex].select = !answers[answerIndex].select;
    }
    // 如果是多选
    if (answerType === 2) {
      if (answers[answerIndex].disSelectAll) {
        answers.forEach((item, index) => {
          answerIndex !== index && (item.select = false);
        });
      }
      answers[answerIndex].select = !answers[answerIndex].select;
    }

    this.props.setQuestionnaire(this.props.insurance.questionnaireList);
  }

  // 判断是否填写完
  watchData () {
    let num = 0;
    this.props.insurance.questionnaireList.forEach((item) => {
      const selectAnswer = item.answers.filter((aItem) => {
        return aItem.select === true;
      });
      selectAnswer.length && (num = num + 1);
    });
    return num;
  }

  // 判断是否完成
  isOver () {
    return !!(this.watchData() === this.props.insurance.questionnaireList.length);
  }

  save () {
    if (!this.isOver()) {
      return;
    }
    const answerReqs: any = [];
    this.props.insurance.questionnaireList.forEach((item) => {
      const answerIds: any = [];
      item.answers.forEach((AItem) => {
        AItem.select && (answerIds.push(AItem.answerId));
      });
      answerReqs.push({
        questionId: item.questionId,
        answerIds
      });
    });
    const questionnaireReq = {
      code: 'yyZjvb',
      answerReqs
    };
    const params = this.props.insurance.subInfo;
    params.questionnaireReq = questionnaireReq;
    addInsurance(params).then(res => {
      Taro.redirectTo({
        url: `/Insurance/pages/detail/index?id=${res}`
      });
    });
  }

  render () {
    return (
            <Page title='立即投保' showBack>
                <View className='page-inform flex'>
                    <Step step={2}></Step>
                    <View className='problem flex'>
                        <View className='title'>提示</View>
                        <View className='tips'>以下信息均如实填写，如有隐藏承担拒赔风险</View>
                        <View className='problem-list'>
                            {
                                this.props.insurance.questionnaireList.length && this.props.insurance.questionnaireList.map((item, index) => {
                                  return (
                                        <View className='problem-item' key={item.questionId}>
                                            <View className='problem-name'>{item.sortNum}、{item.questionName}</View>
                                            <View className='result flex'>
                                                {
                                                    item.answers.map((AItem, AIndex) => {
                                                      return <View className={`result-item flex ${AItem.select ? 'select' : ''}`} onClick={this.select.bind(this, index, AIndex)} key={AItem.answerId}>{AItem.answerName}</View>;
                                                    })
                                                }
                                            </View>
                                        </View>
                                  );
                                })
                            }

                        </View>
                        <View className={`bottom flex ${this.isOver() ? 'active' : ''}`} onClick={this.save.bind(this)}>
                            {this.isOver() ? '提交审核' : `您已回答${this.watchData()}题/共${this.props.insurance.questionnaireList.length}题` }
                        </View>
                        </View>
                </View>
            </Page>
    );
  }
}
export default Inform;
