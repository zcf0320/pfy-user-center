import { View } from '@tarojs/components';
import { Component } from 'react';
import Service from '@components/Service';
import Page from '@components/page';
import { connect } from 'react-redux';
import { serviceRights } from '@actions/common';
import utils from '@utils/index';
import { GET_QUESTIONNAURE_LIST } from '@constants/common';
import './index.scss';

interface IPorps {
  questionnaireList: Array<any>;
  onSetQuestionnaure: Function;
}

@connect(
  state => {
    return Object.assign({}, state.user, state.common);
  },
  dispatch => ({
    onSetQuestionnaure (data) {
      dispatch({
        type: GET_QUESTIONNAURE_LIST,
        payload: data
      });
    }
  })
)
class Questionnaire extends Component<IPorps> {
  componentDidMount () {
    serviceRights().then((res:any) => {
      const questionnaure = [] as Array<any>;
      for (const key in res) {
        if (key !== 'specialColumn' && utils.appConfig.codeMap[key] < 5) {
          const { serviceInfoName, serviceRecordIdList } = res[key];
          res[key].itemName = serviceInfoName;
          res[key].state = serviceRecordIdList.length ? 0 : 2;
          res[key].pageCode = key;
          res[key].serviceRecordId = serviceRecordIdList[0];
          questionnaure.push(res[key]);
        }
      }
      this.props.onSetQuestionnaure(questionnaure.sort(this.sort));
    });
  }

  sort (a, b) {
    return b.serviceRecordIdList.length - a.serviceRecordIdList.length;
  }

  render () {
    const { questionnaireList } = this.props;
    return (
      <Page showBack title='阳光问卷'>
        <View className='page-questionnaire'>
          {questionnaireList.length &&
            questionnaireList.map(item => {
              return (
                <Service
                  actions=''
                  reducers=''
                  serviceDetail={item}
                  key={item.serviceInfoId}
                  from='questionnaireList'
                ></Service>
              );
            })}
        </View>
      </Page>
    );
  }
}
export default Questionnaire;
