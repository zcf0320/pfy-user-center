import Taro, { Config, getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import { SET_TWO_LEVEL_PROFESSION_LIST } from '@constants/insurance';
import { queryJob } from '@actions/insurance';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import Empty from '../../component/professionEmpty';

import Search from '../../component/search';
import './index.scss';

interface IProps{
    setTwoLevel: Function;
}
interface IState{
    selectOneIndex: number | string;
    selectTwoIndex: number | string;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  setTwoLevel (data) {
    dispatch({
      type: SET_TWO_LEVEL_PROFESSION_LIST,
      payload: data
    });
  }
}))
class Profession extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      selectOneIndex: 0,
      selectTwoIndex: ''
    };
  }

  componentDidMount () {
    // 一进来就初始化二级列表
    const { selectOneIndex } = this.state;
    this.setTwoLevelList(selectOneIndex);
  }

    config: Config = {
      navigationBarTitleText: '职业选择'
    }

    onConfirm (e) {
      const vm = this;
      if (!e.detail.value) {
        return;
      }
      queryJob({
        key: e.detail.value
      }).then(res => {
        vm.setState({
          selectOneIndex: '',
          selectTwoIndex: ''
        });
        vm.props.setTwoLevel(res);
      });
    }

    setTwoLevelList (index) {
      this.props.setTwoLevel(this.props.insurance.oneLevelProfessionList[index].children);
    }

    render () {
      const { router } = getCurrentInstance();
      const { selectOneIndex, selectTwoIndex } = this.state;
      return (
            <Page title='职业选择' showBack>
                <View className='page-profession flex'>
                    <Search onConfirm={this.onConfirm.bind(this)}></Search>
                    <View className='profession-content flex'>
                        <View className='one'>
                            {
                                this.props.insurance.oneLevelProfessionList.map((item, index) => {
                                  return (
                                        <View className={`one-item flex ${index === selectOneIndex ? 'select' : ''}`} key={item.code} onClick={() => {
                                          this.setState({ selectOneIndex: index });
                                          this.setTwoLevelList(index);
                                        }}
                                        >{item.name}</View>
                                  );
                                })
                            }
                        </View>
                        <View className='two flex'>
                            {
                                this.props.insurance.twoLevelProfessionList.length
                                  ? (
                                      this.props.insurance.twoLevelProfessionList.map((item, index) => {
                                        return <View className={`two-item flex ${index === selectTwoIndex ? 'select' : ''}`} key={item.code} onClick={
                                           () => {
                                             this.setState({ selectTwoIndex: index });
                                             Taro.navigateTo({
                                               url: `/Insurance/pages/selectProfession/index?code=${item.code}&peopleIndex=${router?.params && router.params.peopleIndex}&type=${router?.params && router.params.type}`
                                             });
                                           }

                                        }
                                        >{item.name}</View>;
                                      })
                                    )
                                  : <Empty></Empty>
                            }
                        </View>
                    </View>
                </View>
            </Page>
      );
    }
}
export default Profession;
