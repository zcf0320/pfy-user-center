import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import {
  GET_PROJECT_LIST,
  SAVE_INFO,
  SET_UNION_LIST
} from '@constants/serviceItem';
import { getProjectList } from '@actions/serviceItem';
import './index.scss';

@connect(
  state => state.serviceItem,
  dispatch => ({
    getProjectList (data) {
      dispatch({
        type: GET_PROJECT_LIST,
        payload: data
      });
    },
    setInfo (data) {
      dispatch({
        type: SAVE_INFO,
        payload: data
      });
    },
    setUnionList (data) {
      dispatch({
        type: SET_UNION_LIST,
        payload: data
      });
    }
  })
)
class PhysicalIndex extends Component<any> {
  componentDidMount () {
    this.props.setInfo({});
    this.props.setUnionList([]);
    getProjectList().then(res => {
      this.props.getProjectList(res);
    });
  }

  selectProject (index) {
    const { projectList } = this.props;
    projectList[index].select = !projectList[index].select;
    this.props.getProjectList([...projectList]);
  }

  save (data) {
    const { saveInfo } = this.props;
    const saveData = Object.assign({}, { ...saveInfo }, data);
    this.props.setInfo(saveData);
  }

  watchData () {
    const { saveInfo, projectList } = this.props;
    const { sex, name } = saveInfo;
    let result = true;
    sex === undefined && (result = false);
    !name && (result = false);
    const select = projectList.filter(item => {
      return item.select;
    });
    !select.length && (result = false);
    return result;
  }

  next () {
    const { router } = getCurrentInstance();
    const { projectList } = this.props;
    if (this.watchData()) {
      const projectIdList = [] as any;
      const localImageList = [] as any;
      projectList.forEach(item => {
        if (item.select) {
          projectIdList.push(item.id);
          localImageList.push({
            imgUrls: [],
            projectId: item.id,
            name: item.name
          });
        }
      });
      this.save({
        projectIdList,
        localImageList: localImageList
      });
      Taro.redirectTo({
        url: `/ServicesItems/pages/physical/upload/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
      });
    }
  }

  render () {
    const { projectList, saveInfo } = this.props;
    return (
      <Page showBack title='解读体检报告'>
        <View className='page-physical'>
          <View className='top'></View>
          <View className='center'>
            <View className='center-title flex'>
              <View className='left'></View>
              <View className='name'>个人信息</View>
            </View>
            <View className='list flex'>
              <View className='list-item'>
                <Input
                  type='text'
                  className='input-name'
                  value={saveInfo.name}
                  placeholder='体检人姓名'
                  placeholderClass='placeholder'
                  onBlur={e => {
                    this.save({ name: e.detail.value });
                  }}
                ></Input>
              </View>
              <View className='list-item flex'>
                <View
                  className={`sex-item flex ${
                    saveInfo.sex === 1 ? 'select' : ''
                  }`}
                  onClick={() => {
                    this.save({ sex: 1 });
                  }}
                >
                  <View className='sex-icon man'></View>
                  <Text>男</Text>
                </View>
                <View
                  className={`sex-item flex ${
                    saveInfo.sex === 0 ? 'select' : ''
                  }`}
                  onClick={() => {
                    this.save({ sex: 0 });
                  }}
                >
                  <View className='sex-icon woman'></View>
                  <Text>女</Text>
                </View>
              </View>
            </View>
            <View className='center-title flex'>
              <View className='left'></View>
              <View className='name'>选择您想要解读的体检项目(可多选)</View>
            </View>
            <View className='list flex'>
              {projectList.map((item, index) => {
                return (
                  <View
                    className={`list-item flex ${item.select ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => {
                      this.selectProject(index);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View
            className={`bottom flex ${
              this.watchData() ? '' : 'disable'
            }`}
            onClick={() => {
              this.next();
            }}
          >
            下一步
          </View>
        </View>
      </Page>
    );
  }
}
export default PhysicalIndex;
