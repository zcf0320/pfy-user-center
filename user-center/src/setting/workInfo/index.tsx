import Taro from '@tarojs/taro';
import { View, Input, Text, Image, Picker } from '@tarojs/components';
import { Component } from 'react';
import { postWorkInfo, getJob } from '@actions/common';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import i18n from '@i18n/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  postWorkInfo: Function;
}
interface IState {
  company: string;
  position: string;
  isEdit: boolean;
  jobList: Array<any>;
  jobIndex: number;
}
@connect(
  state => state.user,
  () => ({
    postWorkInfo (params) {
      return postWorkInfo(params);
    }
  })
)
class WorkInfo extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      company: '',
      position: '',
      isEdit: false,
      jobList: [],
      jobIndex: -1
    };
  }

  componentDidMount () {
    this.getJobList();
  }

  getJobList () {
    getJob().then((res:any) => {
      const { checkSession } = utils.Auth;
      checkSession(true).then(useRes => {
        const { company, position, jobId } = useRes;
        let jobIndex = 0;
        if (jobId) {
          res.forEach((item, index) => {
            item.id === jobId && (jobIndex = index);
          });
        }

        this.setState({
          company,
          position,
          isEdit: !!(company && position),
          jobIndex
        });
      });
      this.setState({
        jobList: res
      });
    });
  }

  confirm () {
    const { company, position, isEdit, jobIndex, jobList } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        company: '',
        position: ''
      });
      return;
    }
    if (!company || !position || jobIndex === null) {
      return;
    }
    const params = {
      company,
      position,
      jobId: jobList[jobIndex].id
    };
    const { checkSession } = utils.Auth;
    this.props.postWorkInfo(params).then(() => {
      Taro.showToast({
        title: i18n.chain.button.saveSuccess,
        icon: 'none'
      });
      checkSession(true).then(() => {
        Taro.navigateBack({
          delta: 1
        });
      });
    });
  }

  onWorkChange = e => {
    this.setState({
      jobIndex: e.detail.value
    });
  };

  render () {
    const { company, position, isEdit, jobList, jobIndex } = this.state;
    return (
      <Page showBack title={i18n.chain.userInfo.work}>
        <View className='page-work-info flex'>
          <View className='common-item flex select m-t-16'>
            <View className='select-content flex'>
              <View className='left flex'>{i18n.chain.userInfo.work}</View>
              <View className='right flex'>
                <Picker
                  mode='selector'
                  className='picker'
                  range={jobList}
                  value={jobIndex}
                  rangeKey='name'
                  onChange={this.onWorkChange}
                >
                  {jobIndex !== -1
                    ? (
                    <Text className='address'>{jobList[jobIndex].name}</Text>
                      )
                    : (
                    <Text className='placeholder address'>{i18n.chain.addressManage.select}</Text>
                      )}
                </Picker>
                <Image src={`${ossHost}images/next.png`} className='next'></Image>
              </View>
            </View>
          </View>
          <View className='common-item flex '>
            <View className='left flex'>
              <View className='label'>{i18n.chain.userInfo.company}</View>
              <Input
                className='input'
                placeholder={i18n.chain.userInfo.inputCompany}
                value={company}
                disabled={isEdit}
                onInput={e => {
                  this.setState({
                    company: e.detail.value
                  });
                }}
                placeholderClass='placeholder'
              ></Input>
            </View>
          </View>
          <View className='common-item flex m-t-16'>
            <View className='left flex'>
              <View className='label'>{i18n.chain.userInfo.position}</View>
              <Input
                className='input'
                placeholder={i18n.chain.userInfo.inputPosition}
                value={position}
                disabled={isEdit}
                onInput={e => {
                  this.setState({
                    position: e.detail.value
                  });
                }}
                placeholderClass='placeholder'
              ></Input>
            </View>
          </View>
          <View
            className={`confrim flex ${
              company && position && jobIndex !== null ? '' : 'disable'
            }`}
            onClick={this.confirm.bind(this)}
          >
            {isEdit ? i18n.chain.userInfo.modify : i18n.chain.button.confirm}
          </View>
        </View>
      </Page>
    );
  }
}
export default WorkInfo;
