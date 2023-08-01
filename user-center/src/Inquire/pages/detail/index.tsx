import { getCurrentInstance } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getDetail, comment } from '@actions/inquire';
import EmptyBox from '@components/emptyBox';
import './index.scss';

interface IState {
  detail: any;
}
class InquireDetail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      detail: {}
    };
  }

  componentDidMount () {
    this.getDiseaseInfo();
  }

  getDiseaseInfo () {
    const { router } = getCurrentInstance();
    getDetail({
      diseaseId: router?.params && router.params.diseaseId,
      serviceRecordId: router?.params && router.params.serviceRecordId
    }).then(res => {
      this.setState({
        detail: res
      });
    });
  }

  comment = index => {
    const { router } = getCurrentInstance();
    const { evaluate } = this.state.detail || {};
    if (evaluate) {
      return;
    }
    comment({
      comment: index,
      recordId: router?.params && router.params.recordId
    }).then(() => {
      this.getDiseaseInfo();
    });
  };

  render () {
    const {
      diseaseName,
      diseaseClinicDepartment,
      diseaseInsured,
      diseaseDetail,
      evaluate,
      diseaseConcurrent,
      diseaseCost,
      diseaseCureRate,
      diseaseSite,
      diseaseInherit,
      diseaseDrug
    } = this.state.detail || {};
    return (
      <Page showBack title='疾病介绍'>
        <View
          className={`page-inquire-detail flex ${
            this.state.detail === null ? 'none' : ''
          }`}
        >
          {this.state.detail !== null
            ? (
            <View>
              <View className='detail-item'>
                <View className='top-title'>{diseaseName || '暂无'}</View>
                <View className='top-bottom flex'>
                  <View className='dep'>
                    科室：{diseaseClinicDepartment || '暂无'}
                  </View>
                  {diseaseInsured
                    ? (
                    <View className='medical-insurance flex'>医保疾病</View>
                      )
                    : null}
                </View>
              </View>
              <View className='detail-item'>
                <View className='item-top flex'>
                  <View className='top-icon icon-1'></View>
                  <Text>简介</Text>
                </View>
                <View className='item-desc'>{diseaseDetail || '暂无'}</View>
                <View className='item-top flex'>
                  <View className='top-icon icon-2'></View>
                  <Text>典型症状</Text>
                </View>
                <View className='item-desc no-border'>
                  {diseaseConcurrent || '暂无'}
                </View>
              </View>
              <View className='detail-item'>
                <View className='item-top flex'>
                  <View className='top-icon icon-3'></View>
                  <Text>治疗药品</Text>
                </View>
                <View className='item-desc'>{diseaseDrug || '暂无'}</View>
                <View className='item-top flex'>
                  <View className='top-icon icon-4'></View>
                  <Text>症状分布</Text>
                </View>
                <View className='item-desc'>{diseaseSite || '暂无'}</View>
                <View className='item-top flex'>
                  <View className='top-icon icon-5'></View>
                  <Text>是否遗传</Text>
                </View>
                <View className='item-desc no-border'>
                  {diseaseInherit || '暂无'}
                </View>
              </View>
              <View className='detail-item'>
                <View className='item-top flex'>
                  <View className='top-icon icon-6'></View>
                  <Text>疾病治愈率</Text>
                </View>
                <View className='item-desc'>{diseaseCureRate || '暂无'}</View>
                <View className='item-top flex'>
                  <View className='top-icon icon-7'></View>
                  <Text>治疗费用估计</Text>
                </View>
                <View className='item-desc no-border'>
                  {diseaseCost || '暂无'}
                </View>
              </View>
              <View className='detail-item evaluate flex'>
                <Text>这个诊断结果对您有效吗？</Text>
                <View className={`effect-list flex ${evaluate ? 'only' : ''}`}>
                  {!evaluate || evaluate === 2
                    ? (
                    <View
                      className={`effect-item flex ${
                        evaluate ? '' : 'disable'
                      } `}
                      onClick={() => {
                        this.comment(2);
                      }}
                    >
                      <View
                        className={`effect-icon ${
                          evaluate === 2 ? 'un-effect' : 'disable'
                        }`}
                      ></View>
                      <Text>无效</Text>
                    </View>
                      )
                    : null}
                  {!evaluate || evaluate === 1
                    ? (
                    <View
                      className={`effect-item flex ${
                        evaluate ? '' : 'disable'
                      } ${evaluate === 1 ? 'active' : ''}`}
                      onClick={() => {
                        this.comment(1);
                      }}
                    >
                      <View
                        className={`effect-icon ${
                          evaluate === 1 ? 'active' : ''
                        }`}
                      ></View>
                      <Text>有效</Text>
                    </View>
                      )
                    : null}
                </View>
              </View>
            </View>
              )
            : (
            <EmptyBox title='暂无疾病介绍'></EmptyBox>
              )}
        </View>
      </Page>
    );
  }
}
export default InquireDetail;
