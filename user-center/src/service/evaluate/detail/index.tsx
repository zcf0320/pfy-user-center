import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import { getEvaluate, getContinueCommentList } from '@actions/service';
import { GET_EVALUATE_DETAIL, GET_CONTINUE_LIST } from '@constants/service';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  service: any;
  getEvaluate: Function;
  getContinueCommentList: Function;
}

@connect(
  state => state,
  dispatch => ({
    getEvaluate (params) {
      getEvaluate(params).then(res => {
        dispatch({
          type: GET_EVALUATE_DETAIL,
          payload: res
        });
      });
    },
    getContinueCommentList () {
      getContinueCommentList().then(res => {
        dispatch({
          type: GET_CONTINUE_LIST,
          payload: res
        });
      });
    }
  })
)
class EvaluateDetail extends Component<IProps> {
  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getEvaluate({
      serviceRecordId: router?.params && router.params.serviceRecordId
    });
  }

  componentDidShow () {
    this.props.getContinueCommentList();
  }

  render () {
    const { optionInfos, rootId, rootName } =
      this.props.service.evaluateDeatil || {};
    return (
      <Page showBack title='评价详情'>
        <View className='page-evaluate-detail flex'>
          <View className='top flex'>
            <Image src={`${ossHost}images/evaluate_success.png`} className='success'></Image>
            <Text className='success-text'>评价成功</Text>
            <Text className='text'>
              感谢您的评价，恭喜获得<Text className='score'>10积分</Text>
            </Text>
          </View>
          <View className={`center flex ${rootId !== 3 ? 'root-id' : ''}`}>
            <View className={`img i-${rootId}`}></View>
            <Text className='root-name flex'>{rootName}</Text>
            <View className='speak'>-他留言说-</View>
            <View className='options-list flex'>
              <View
                className={`list-content flex ${
                  optionInfos && optionInfos.length === 3 ? 'third' : ''
                }`}
              >
                {optionInfos &&
                  optionInfos.length &&
                  optionInfos.map(item => {
                    return (
                      <Text key={item.commentId} className='option-item active'>
                        {item.commentName}
                      </Text>
                    );
                  })}
              </View>
            </View>
          </View>
          <View className='bottom'>
            <View className='bottom-top flex'>-再接再厉，继续评价下吧-</View>
            {this.props.service.continueCommentList.length
              ? (
                  this.props.service.continueCommentList.map((item, index) => {
                    return (
                      index < 1 && (
                    <View className='item flex'>
                      <View className='left flex'>
                        <Image className='img' src={item.img}></Image>
                        <Text>{item.serviceInfoName}</Text>
                      </View>
                      <View
                        className='right flex'
                        onClick={() => {
                          const { serviceRecordId, serviceInfoName } = item;
                          Taro.navigateTo({
                            url: `/service/evaluate/index/index?serviceRecordId=${serviceRecordId}&itemName=${serviceInfoName}`
                          });
                        }}
                      >
                        立即评价
                      </View>
                    </View>
                      )
                    );
                  })
                )
              : (
              <View className='none flex'>
                <Image src={`${ossHost}empty_2.png`} className='empty'></Image>
                <Text>评价都写完啦，去积分商城看看吧！</Text>
                <View
                  className='mall flex'
                  onClick={() => {
                    Taro.switchTab({
                      url: '/pages/mall/index/index'
                    });
                  }}
                >
                  前往积分商城
                </View>
              </View>
                )}
          </View>
        </View>
      </Page>
    );
  }
}
export default EvaluateDetail;
