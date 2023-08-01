import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { IStoreProps } from '@reducers/interface';
import { connect } from 'react-redux';
import { SET_INSURANCE_INFO, SET_PROSON_INSURANCE_INFO } from '@constants/insurance';
import { queryJob } from '@actions/insurance';
import Page from '@components/page';
import Search from '../../component/search';
import Empty from '../../component/professionEmpty';
import './index.scss';

interface IProps{
    setInfo: Function;
    setPersonInsuranceInfo: Function;
}
interface IState{
    threeProfessionlist: any;
    selectIndex: number | string;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  setInfo (data) {
    dispatch({
      type: SET_INSURANCE_INFO,
      payload: data
    });
  },
  setPersonInsuranceInfo (data) {
    dispatch({
      type: SET_PROSON_INSURANCE_INFO,
      payload: data
    });
  }
}))
class SelectProfession extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectIndex: '',
      threeProfessionlist: []
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    queryJob({
      code: router?.params && router.params.code
    }).then(res => {
      this.setState({
        threeProfessionlist: res
      });
    });
  }

    config: Config = {
      navigationBarTitleText: '选择职业名称'
    }

    onConfirm (e) {
      const { router } = getCurrentInstance();
      if (!e.detail.value) {
        return;
      }
      queryJob({
        key: e.detail.value,
        code: router?.params && router.params.code
      }).then(res => {
        this.setState({
          threeProfessionlist: res
        });
      });
    }

    save () {
      const { router } = getCurrentInstance();
      const { selectIndex, threeProfessionlist } = this.state;
      if (selectIndex === '') {
        return;
      }
      const peopleIndex = router?.params && router.params.peopleIndex;
      // 个险
      if (router?.params && router.params.type === '1') {
        // let {personInsuranceInfo} = this.props.insurance
        // personInsuranceInfo.jobName = threeProfessionlist[selectIndex].name
        // personInsuranceInfo.insuredJob =  threeProfessionlist[selectIndex].code
        this.props.setPersonInsuranceInfo({
          jobName: threeProfessionlist[selectIndex].name,
          insuredJob: threeProfessionlist[selectIndex].code
        });
      }
      // 团险
      if (router?.params && router.params.type === '2') {
        const { insuredInfos } = this.props.insurance.insuranceInfo;
        // 只修改当前的内容
        const result = Object.assign({}, insuredInfos[peopleIndex], {
          jobName: threeProfessionlist[selectIndex].name,
          job: threeProfessionlist[selectIndex].code
        });
        insuredInfos[peopleIndex] = result;
        this.props.setInfo(insuredInfos);
      }
      Taro.navigateBack({
        delta: 2
      });
    }

    render () {
      const { threeProfessionlist, selectIndex } = this.state;
      return (
            <Page title='选择职业名称' showBack>
                <View className='page-select-profession flex'>
                    <Search onConfirm={this.onConfirm.bind(this)}></Search>
                    <View className='select-profession-content'>
                        {
                            threeProfessionlist.length
                              ? threeProfessionlist.map((item, index) => {
                                return (
                                    <View key={item.name} className={`content-item flex ${index === selectIndex ? 'select' : ''}`} onClick={() => {
                                      this.setState({
                                        selectIndex: index
                                      });
                                    }}
                                    >
                                        {item.name}
                                    </View>
                                );
                              })
                              : <Empty></Empty>
                        }

                    </View>
                    <View className='bottom flex'>
                        <View className={`bottom-content flex ${selectIndex !== '' ? 'active' : ''}`} onClick={
                            () => {
                              this.save();
                            }
                        }
                        >确定</View>
                    </View>
                </View>
            </Page>
      );
    }
}
export default SelectProfession;
