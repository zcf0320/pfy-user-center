import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IStoreProps } from '@reducers/interface';
import Page from '@components/page';
import Detail from '../../components/detail';
import * as actions from '../../actions';
import './index.scss';

interface IProps {
  actions: any;
}

type PropsType = IStoreProps & IProps;

@connect(
  state => state,
  dispatch => {
    return Object.assign(
      {},
      {
        actions: bindActionCreators(actions, dispatch)
      }
    );
  }
)
class StepThree extends Component<PropsType> {
  componentDidMount () {
    const { router } = getCurrentInstance();

    Taro.setNavigationBarTitle({
      title: router?.params && router.params.type === '1' ? '处方单药品' : '检验/检查单'
    });
  }

  changeCheck = (isChecked: string, index: number) => {
    this.props.actions.changeType({ isChecked, index });
  };

  addItem = () => {
    const { router } = getCurrentInstance();
    this.props.actions.addItem(router?.params && router.params.type);
  };

  deleteItem = key => {
    const { router } = getCurrentInstance();
    this.props.actions.deleteItem(router?.params && router.params.type, key);
  };

  changeData = (name, value, index) => {
    this.props.actions.changeData(name, value, index);
  };

  add = () => {
    const { router } = getCurrentInstance();
    const { claimsSettle } = this.props;
    const { drugList, testList, config } = claimsSettle;
    const list = router?.params && router.params.type === '1' ? drugList : testList;
    const codeList =
      router?.params && router.params.type === '1'
        ? config.IUjhYT.codeLists
        : config.THGqrw.codeLists;
    const data = list;
    const obj = data[data.length - 1];
    let result = true;

    const { name, num, unitPrice } = obj;
    if (obj.isChecked === '药品') {
      codeList.every(item => {
        if (item.required) {
          if (item.code === 'JLjhsq' && !name) {
            result = false;
          }
          if (item.code === 'HgsfKJ' && !num) {
            result = false;
          }
          if (item.code === 'NYbshu' && !unitPrice) {
            result = false;
          }
          return false;
        } else {
          return true;
        }
      }
      );
      // this.addItem();
    }
    if (obj.isChecked === '检验/检查') {
      codeList.every((item:any) => {
        if (item.required) {
          if (item.code === 'HMNbas' && !name) {
            result = false;
            return false;
          }
          if (item.code === 'JksQWs' && !num) {
            result = false;
            return false;
          }
          if (item.code === 'JUIliw' && !unitPrice) {
            result = false;
            return false;
          }
          return false;
        } else {
          return true;
        }
      });
    }

    if (result) {
      this.addItem();
    } else {
      Taro.showToast({
        title: '请完善上条明细后再添加',
        icon: 'none'
      });
    }
  };

  render () {
    const { router } = getCurrentInstance();
    const { claimsSettle } = this.props;
    const { drugList, testList, config } = claimsSettle;
    const list = router?.params && router.params.type === '1' ? drugList : testList;
    const codeList =
      router?.params && router.params.type === '1'
        ? config.IUjhYT.codeLists
        : config.THGqrw.codeLists;
    return (
      <Page showBack
        title={router?.params && router.params.type === '1' ? '处方单药品' : '检验/检查单'}
      >
        <View className='claims-step3'>
          {list.length &&
            list.map((item: any, index: number) => {
              return (
                <View className='claims-step3-box' key={item.key}>
                  <Detail
                    data={item}
                    changeCheck={this.changeCheck}
                    onDeleteItem={this.deleteItem}
                    onSetList={this.props.actions.setList}
                    changeData={this.changeData}
                    serviceRecordId={(router?.params && router.params.serviceRecordId) || ''}
                    codeList={codeList}
                    onSetModal={this.props.actions.setModal}
                    index={index}
                  />
                </View>
              );
            })}
          <View
            className='claims-step3-more'
            onClick={() => {
              this.add();
            }}
          >
            添加
          </View>
        </View>
      </Page>
    );
  }
}

export default StepThree;
