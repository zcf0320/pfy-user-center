import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import { gePhysicaltReport } from '@actions/serviceItem';
import Page from '@components/page';
import ProgramItem from './ProgramItem';
import './index.scss';

class PhysicalSupplement extends Component<{}, { info: any }> {
  constructor (props) {
    super(props);
    this.state = {
      info: {}
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    gePhysicaltReport({
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then(res => {
      this.setState({
        info: res
      });
    });
  }

  render () {
    const { projectDetailList, errorProjectName } = this.state.info;
    return (
      <Page showBack title='解读体检报告'>
        <View className='page-physical-detail flex'>
          <View
            className={`top ${
              errorProjectName && errorProjectName.length ? 'has-error' : ''
            }`}
          >
            {errorProjectName && errorProjectName.length
              ? `您本次共有${errorProjectName.length}项异常项目：`
              : '您的体检报告结果如下：'}
          </View>
          <View className='error-program'>
            {errorProjectName && errorProjectName.length
              ? errorProjectName.map(item => {
                return <Text key={item}>{item}、</Text>;
              })
              : null}
          </View>
          <View className='dot'></View>
          {/* <ProgramItem></ProgramItem> */}
          {projectDetailList &&
            projectDetailList.length &&
            projectDetailList.map(item => {
              return (
                <ProgramItem item={item} key={item.projectName}></ProgramItem>
              );
            })}
        </View>
      </Page>
    );
  }
}
export default PhysicalSupplement;
