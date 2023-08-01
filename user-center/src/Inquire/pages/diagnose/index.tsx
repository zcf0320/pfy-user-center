import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { IStoreProps } from '@reducers/interface';
import * as inquireApi from '@actions/inquire';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import FilterDiagnose from '../../component/filterDiagnose';
import { SymptomItem } from '../../types';
import { commonQuestion } from '../../common';
import './index.scss';

interface IProps {
  actions: any;
  reducers: any;
}
interface IState {
  symptom: SymptomItem;
}

type PropsType = IStoreProps & IProps;

@connect(
  state => {
    return Object.assign(
      {},
      {
        reducers: {
          recordList: state.inquire.recordList,
          serviceRecordId: state.inquire.serviceRecordId
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
class Diagnose extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      symptom: {
        id: '',
        name: ''
      }
    };
  }

  // 选择的疾病
  selectDisease = (item: SymptomItem) => {
    this.setState({
      symptom: item
    });
  };

  // 确认提交
  commitDisease = () => {
    const { recordList, serviceRecordId } = this.props.reducers;
    const { symptom } = this.state;
    if (!symptom.id) {
      Taro.showToast({
        title: '请选择症状',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    const postData: any = {
      diseaseId: symptom.id
    };
    if (serviceRecordId) {
      this.props.actions.setServiceRecordId(serviceRecordId);
      postData.serviceRecordId = serviceRecordId;
    }
    inquireApi.commitDisease(postData).then((res: any) => {
      // recordList[recordList.length - 1].histories[recordList[recordList.length - 1].histories.length - 1].answer = `选择症状为: ${symptom.name}`
      recordList.push({
        content: {
          time: new Date().getTime(),
          sendor: 1,
          type: 1,
          localType: [],
          msg: `选择症状为: ${symptom.name}`
        }
      });
      const { recordId, question, questionId } = res;
      // 继续问诊
      this.props.actions.changeRecordList(
        commonQuestion(recordList, {
          chartRecordId: recordId,
          diagnoseType: 1,
          content: {
            sendor: 2,
            type: 1,
            msg: question,
            questionId
          }
        })
      );
      // 返回问诊页面
      Taro.navigateBack({
        delta: 1
      });
    });
  };

  render () {
    const { symptom } = this.state;
    return (
      <Page showBack title='选择症状'>
        <View className='diagnose'>
          <View className='diagnose-content'>
            <View
              className='search-diagnose'
              onClick={() => {
                Taro.navigateTo({
                  url: '/Inquire/pages/search/index'
                });
              }}
            >
              <View className='search-icon'></View>
              <View className='search-text'>请输入搜索词</View>
            </View>
            <View className='filter-content'>
              <View className='filter-diagnose'>
                <FilterDiagnose selectDisease={this.selectDisease} />
              </View>
            </View>
          </View>
          {/* <View className="sure"> */}
          <View
            className={`button ${symptom.id ? '' : 'disable'}`}
            onClick={this.commitDisease}
          >
            确认
          </View>
          {/* </View> */}
        </View>
      </Page>
    );
  }
}
export default Diagnose;
