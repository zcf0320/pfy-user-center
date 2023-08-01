import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { productList } from '@actions/minApp';
import Page from '@components/page';
import {
  SET_GROUP_LIST,
  SET_RECOMMEND_LIST,
  RESET_LIST,
  SET_BUY_NUMBER,
  SELECT_LIST,
  SET_IMPORT_LIST
} from '@constants/minApp';
import { connect } from 'react-redux';
import RecommendItem from './RecommendItem';
import RecommendList from './RecommendList';
import ClassItem from './ClassItem';
import './index.scss';

interface IProps {
  reSetList: Function;
  setGroupList: Function;
  setRecommendList: Function;
  setImportList: Function;
  setBuyNum: Function;
  recommendList: Array<any>;
  groupVOList: Array<any>;
  selectRecommendList: Array<any>;
  selectGroupList: Array<any>;
  buyNum: number;
}
interface IState {
  recommend: Array<any>;

  showRecommendList: boolean;
}
@connect(
  state => state.minApp,
  dispatch => ({
    setGroupList (data) {
      dispatch({
        type: SET_GROUP_LIST,
        payload: data
      });
    },
    setRecommendList (data) {
      dispatch({
        type: SET_RECOMMEND_LIST,
        payload: data
      });
    },
    reSetList () {
      dispatch({
        type: RESET_LIST
      });
    },
    setBuyNum (data) {
      dispatch({
        type: SET_BUY_NUMBER,
        payload: data
      });
    },
    setList (data) {
      dispatch({
        type: SELECT_LIST,
        payload: data
      });
    },
    setImportList (data) {
      dispatch({
        type: SET_IMPORT_LIST,
        payload: data
      });
    }
  })
)
class DetailList extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      // groupVOList: [],
      recommend: [],
      showRecommendList: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    productList({ serviceRecordId: router?.params && router.params.serviceRecordId }).then(
      (res: any) => {
        const { groupVOList, recommendList, allowMultipleChoice } = res;
        this.props.setBuyNum(allowMultipleChoice ? 3 : 1);
        this.props.setGroupList(groupVOList);
        if (recommendList.length) {
          const data = [] as any;
          recommendList.forEach(item => {
            if (item.existInPatientPrescription) {
              data.push(item);
            }
          });
          if (data.length) {
            this.setState({ showRecommendList: true, recommend: data });
          }
        }
        this.props.setRecommendList(recommendList);
      }
    );
  }

  componentWillUnmount () {
    this.props.reSetList();
    this.props.setGroupList([]);
    this.props.setRecommendList([]);
  }

  watchNum () {
    const { selectRecommendList, selectGroupList } = this.props;
    return selectRecommendList.length + selectGroupList.length;
  }

  save () {
    const { router } = getCurrentInstance();
    const { selectRecommendList, selectGroupList, buyNum } = this.props;
    const count = selectRecommendList.length + selectGroupList.length;
    if (count <= buyNum && count > 0) {
      const list = JSON.stringify([...selectRecommendList, ...selectGroupList]);
      Taro.redirectTo({
        url: `/MinApp/pages/drug/order/index?serviceRecordId=${router?.params && router.params.serviceRecordId}&list=${list}`
      });
    }
  }

  render () {
    const { router } = getCurrentInstance();
    const { recommendList, groupVOList } = this.props;
    const { showRecommendList, recommend } = this.state;
    return (
      <Page showBack title='药品清单'>
        {showRecommendList
          ? (
          <RecommendList
            recommend={recommend}
            close={() => {
              this.setState({
                showRecommendList: false
              });
            }}
            confirm={val => {
              this.props.setImportList(val);
            }}
          />
            )
          : null}
        <View className='page-detail-list flex'>
          <View className='page-top'>
            <Text>请根据处方单选择对应药品，</Text>
            <Text className='weight'>同类药品仅支持选择一种，</Text>
            <Text>谨慎选择处方单以外的药品，请遵医嘱服药，祝您身体健康！</Text>
          </View>
          <View className='page-list'>
            <View className='list-content flex'>
              {Boolean(recommendList.length) &&
                recommendList.map((item, index) => {
                  return (
                    <RecommendItem
                      item={item}
                      key={item.id}
                      rIndex={index}
                      serviceRecordId={(router?.params && router.params.serviceRecordId) || ''}
                    ></RecommendItem>
                  );
                })}
              {Boolean(groupVOList.length) &&
                groupVOList.map((item, index) => {
                  return (
                    <ClassItem
                      detail={item}
                      key={item.type}
                      cIndex={index}
                    ></ClassItem>
                  );
                })}
            </View>
          </View>
          <View className='bottom flex'>
            <View className='left'>
              已选<Text className='num'>{this.watchNum()}种</Text>
            </View>
            <View
              className={`right flex ${
                this.watchNum() ? '' : 'disable'
              }`}
              onClick={this.save.bind(this)}
            >
              提交
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default DetailList;
