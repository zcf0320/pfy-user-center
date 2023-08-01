import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import Page from '@components/page';
import i18n from '@i18n/index';
import { getOptions, add } from '@actions/service';
import './index.scss';

interface ReasonItem {
  commentId: number;
  commentName: string;
  select?: boolean;
}
interface Item {
  optionInfos: ReasonItem[];
  rootId: number;
  rootName: string;
  select?: boolean;
  // active_url: string;
  url: string;
}
interface PostData {
  commentIds: number[];
  serviceRecordId: string;
}

interface IState {
  optionsList: Item[];
  reason: ReasonItem[];
}

@connect(state => state)
class Evaluate extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      optionsList: [],
      reason: []
    };
  }

  componentDidMount () {
    this.getOptionsItem();
  }

  config: Config = {
    navigationBarTitleText: i18n.chain.evaluate.title
  };

  // 获取服务的评价
  getOptionsItem () {
    getOptions({
      type: 'comment'
    }).then((res: any) => {
      this.setState({
        optionsList: res
      });
    });
  }

  selectOptions (index) {
    this.state.optionsList.forEach(item => {
      item.select = false;
      item.optionInfos.forEach(oItem => {
        oItem.select = false;
      });
    });

    const reason = this.state.optionsList[index].optionInfos;
    const optionsList = this.state.optionsList;
    optionsList[index].select = true;
    this.setState({
      optionsList: optionsList,
      reason
    });
  }

  selectReason (index) {
    const reason = this.state.reason;
    reason[index].select = !this.state.reason[index].select;
    this.setState({
      reason
    });
  }

  watchStatus () {
    const { reason } = this.state;
    const selectReason = reason.filter(item => {
      return item.select;
    });
    return !!selectReason.length;
  }

  confirm () {
    const { router } = getCurrentInstance();
    if (!this.watchStatus()) {
      return;
    }
    const params: PostData = {
      commentIds: [],
      serviceRecordId: (router?.params && router.params.serviceRecordId) || ''
    };
    const { reason } = this.state;
    reason.forEach(item => {
      item.select && params.commentIds.push(item.commentId);
    });
    add(params).then(() => {
      Taro.redirectTo({
        url: `/service/evaluate/detail/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
      });
    });
  }

  render () {
    const { router } = getCurrentInstance();
    return (
      <Page showBack title={i18n.chain.evaluate.title}>
        <View className='page-evaluate-index flex'>
          <View className='top flex'>
            <View className='head flex'></View>
            <View className='head-name'>
              {router?.params && router.params.itemName}
              {i18n.chain.evaluate.statisfied}？
            </View>
            <Text className='tips'>
              {i18n.chain.evaluate.available}
              <Text className='number'>10</Text>
              {i18n.chain.evaluate.pointsReward}
            </Text>
          </View>
          <View className='center'>
            <View className='img-list flex'>
              {this.state.optionsList.map((item, index) => {
                return (
                  <View
                    className={`img-item flex item-${index} ${
                      item.select ? 'active' : ''
                    }`}
                    key={item.rootId}
                    onClick={() => {
                      this.selectOptions(index);
                    }}
                  >
                    <View className={`img i-${index}`}></View>
                    <View className='root-name flex'>{item.rootName}</View>
                  </View>
                );
              })}
            </View>
            <View className='option-list flex'>
              {this.state.reason.map((oItem, oIndex) => {
                return (
                  <View
                    className={`option-item flex ${
                      oItem.select ? 'active' : ''
                    }`}
                    key={oItem.commentId}
                    onClick={() => {
                      this.selectReason(oIndex);
                    }}
                  >
                    {oItem.commentName}
                  </View>
                );
              })}
            </View>
          </View>
          <View
            className={`bottom flex ${
              !this.watchStatus() ? 'disable' : ''
            }`}
            onClick={() => {
              this.confirm();
            }}
          >
            {i18n.chain.button.confirm}
          </View>
        </View>
      </Page>
    );
  }
}
export default Evaluate;
