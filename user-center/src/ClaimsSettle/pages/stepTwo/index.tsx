import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from '@utils/index';
import * as claimsApi from '@actions/claimsSettle';
import { getMaterialsList, checkSubmit } from '@actions/claim';
import { IStoreProps } from '@reducers/interface';
import * as actions from '../../actions';
import Detail from '../../components/detail';
import Material from '../../components/material';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  actions: any;
  serviceRecordId: string;
  insuranceProductId: string;
  rightsId: string;
  policyNo: string;
  insurancePlanId: string;
  productReviewConfigId: string;
}
interface IState {
  showSuccess: boolean;
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
class StepTwo extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      showSuccess: false
    };
  }

  componentDidMount () {
    this.getMaterials();
  }

  componentWillUnmount () {
    this.props.actions.setMaterials([]);
  }

  changeCheck = (isChecked: string, index: number) => {
    this.props.actions.changeType({ isChecked, index });
  };

  deleteImg = (parent: number, child: number) => {
    this.props.actions.deleteImg({ parent, child });
  };

  addItem = (params: any) => {
    this.props.actions.addImg(params);
  };

  checkInfo = type => {
    const { config } = this.props.claimsSettle;
    let data = this.props.claimsSettle.drugList[0];
    type === 2 && (data = this.props.claimsSettle.testList[0]);
    let codeList = config.IUjhYT.codeLists;
    type === 2 && (codeList = config.THGqrw.codeLists);
    const { name, num, unitPrice } = data;
    let result = true;
    if (data.isChecked === '药品') {
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
      });
    } else if (data.isChecked === '检验/检查') {
      codeList.every(item => {
        if (item.required) {
          if (item.code === 'HMNbas' && !name) {
            result = false;
          }
          if (item.code === 'JksQWs' && !num) {
            result = false;
          }
          if (item.code === 'JUIliw' && !unitPrice) {
            result = false;
          }
          return false;
        } else {
          return true;
        }
      });
    }
    if (result) {
      Taro.navigateTo({
        url: `/ClaimsSettle/pages/stepThree/index?type=${type}&serviceRecordId=${this
          .props.serviceRecordId || ''}`
      });
    } else {
      Taro.showToast({
        title: '请完善上条明细后再添加',
        icon: 'none'
      });
    }
  };

  getMaterials () {
    if (this.props.serviceRecordId) {
      getMaterialsList({ serviceRecordId: this.props.serviceRecordId }).then(
        (res: any) => {
          if (res.length !== 0) {
            for (const i in res) {
              res[i].files = [];
            }
            this.props.actions.setMaterials(res);
          }
        }
      );
      return;
    }
    const params = {
      insuranceProductId: this.props.insuranceProductId,
      rightsId: this.props.rightsId
    };
    claimsApi.needMaterials(params).then((res: any) => {
      if (res.length !== 0) {
        for (const i in res) {
          res[i].files = [];
        }
        this.props.actions.setMaterials(res);
      }
    });
  }

  watchData () {
    const { drugList, form, config } = this.props.claimsSettle;
    const { materialList } = form;
    let result = true;
    if (materialList.length > 0) {
      materialList.every(item => {
        if (item.required && !item.files.length) {
          result = false;
          return false;
        } else {
          return true;
        }
      });
    }
    if ('IUjhYT' in config) {
      const first = drugList[0];
      const { name, num, unitPrice } = first;
      config.IUjhYT.codeLists.every(item => {
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
      });
      // if(config['IUjhYT'].codeLists[0].required){

      //     const { name, num } = first
      //     if(!name || !num ){
      //         result = false
      //     }

      // }
    }
    if ('THGqrw' in config) {
      const first = drugList[0];
      const { name, num, unitPrice } = first;
      config.THGqrw.codeLists.every(item => {
        if (item.required) {
          if (item.code === 'HMNbas' && !name) {
            result = false;
          }
          if (item.code === 'JksQWs' && !num) {
            result = false;
          }
          if (item.code === 'JUIliw' && !unitPrice) {
            result = false;
          }
          return false;
        } else {
          return true;
        }
      });
    }
    // if('THGqrw' in config){
    //     if(config['THGqrw'].codeLists[0].required){
    //         let first = testList[0]
    //         const { name, num, unitPrice } = first
    //         if(!name || !num || !unitPrice){
    //             result = false
    //         }
    //     }
    // }

    return result;
  }

  hasTrue = key => {
    const { claimsSettle } = this.props;
    const { config } = claimsSettle;
    return key in config;
  };

  submit = () => {
    if (!this.watchData()) {
      return;
    }
    const { drugList, testList } = this.props.claimsSettle;
    // let data = this.props.claimsSettle.form.settlementDetailsList;
    const settlementDetailsList: any = drugList.concat(testList);
    let error = '';

    settlementDetailsList.forEach(item => {
      if (
        (item.num && Number(item.num) <= 0) ||
        (item.unitPrice && Number(item.unitPrice) < 0)
      ) {
        error = '请输入正确的数量或金额';
      }
    });
    if (error) {
      Taro.showToast({
        title: error,
        icon: 'none'
      });
      return;
    }

    this.props.actions.setModal({
      show: true,
      content: '您的就诊信息是否需要同步到健康档案？',
      cancelText: '不用了',
      confirmText: '确认',
      clickConfirm: () => {
        this.save(true);
      },
      clickCancel: () => {
        this.save(false);
      }
    });
  };

  save (update) {
    const vm = this;
    const { drugList, testList } = this.props.claimsSettle;
    // let data = this.props.claimsSettle.form.settlementDetailsList;
    const settlementDetailsList: any = drugList.concat(testList);
    const info = this.props.claimsSettle.form;
    this.props.claimsSettle.form.settlementDetailsList = settlementDetailsList;

    info.insuranceProductId = this.props.insuranceProductId;
    info.insuranceRightsId = this.props.rightsId;
    info.policyNo = this.props.policyNo;
    info.insurancePlanId = this.props.insurancePlanId;
    info.healthInfo.needUpdateHealthFile = update;
    info.productReviewConfigId = this.props.productReviewConfigId;
    if (info.materialList.length === 0) {
      info.materialList = null;
    }
    info.serviceRecordId = this.props.serviceRecordId;
    this.props.claimsSettle.signUrl &&
      (info.electronicSignatureImg = this.props.claimsSettle.signUrl);
    this.props.claimsSettle.saveSignUrl.length > 0 &&
      (info.resultImg = this.props.claimsSettle.saveSignUrl);
    if (this.props.serviceRecordId) {
      checkSubmit(info).then((res:any) => {
        vm.props.actions.setSignUrl('');
        vm.props.actions.setSaveSignUrl([]);
        Taro.redirectTo({
          url: `/ClaimsSettle/pages/examine/index?state=1&claimRecordId=${res.id}`
        });
      });
      return;
    }
    claimsApi.createExam(info).then((res:any) => {
      this.setState({
        showSuccess: true
      });
      setTimeout(() => {
        this.setState({
          showSuccess: false
        });
        Taro.redirectTo({
          url: `/ClaimsSettle/pages/examine/index?state=1&policyNo=${this.props.policyNo}&claimType=2&claimRecordId=${res.id}`
        });
      }, 2000);
    });
  }

  render () {
    const { claimsSettle } = this.props;
    const { config } = claimsSettle;
    const { showSuccess } = this.state;
    const { router } = getCurrentInstance();
    return (
      //   <Page title="提交理赔材料">
      <View className='claims-step2'>
        <Image className='claims-step2-img' src={`${ossHost}claims_third.png`} />
        {this.hasTrue('IUjhYT')
          ? (
          <View className='claims-step2-top'>
            <View className='claims-step2-title'>
              <View className='claims-step2-redline'></View>
              <View>处方单药品</View>
            </View>
            <Detail
              data={claimsSettle.drugList[0]}
              codeList={config.IUjhYT.codeLists}
              changeCheck={this.changeCheck}
              serviceRecordId={this.props.serviceRecordId || ''}
              onSetList={this.props.actions.setList}
              index={0}
            />
            <View
              className='claims-step2-more'
              onClick={() => {
                this.checkInfo(1);
              }}
            >
              更多
            </View>
          </View>
            )
          : null}
        {this.hasTrue('THGqrw')
          ? (
          <View className='claims-step2-top'>
            <View className='claims-step2-title'>
              <View className='claims-step2-redline'></View>
              <View>检验/检查单</View>
            </View>
            <Detail
              data={claimsSettle.testList[0]}
              codeList={config.THGqrw.codeLists}
              changeCheck={this.changeCheck}
              onSetList={this.props.actions.setList}
              serviceRecordId={this.props.serviceRecordId || ''}
              index={0}
            />
            <View
              className='claims-step2-more'
              onClick={() => {
                this.checkInfo(2);
              }}
            >
              更多
            </View>
          </View>
            )
          : null}

        {claimsSettle.form.materialList &&
          claimsSettle.form.materialList.length !== 0 && (
            <Material
              claimsSettle={claimsSettle}
              deleteImg={this.deleteImg}
              addItem={this.addItem}
              insuranceProductId={this.props.insuranceProductId}
              rightsId={(router?.params && router.params.rightsId) || ''}
              setModal={this.props.actions.setModal}
            />
        )}

        <View
          className={`claims-step2-btn ${
            this.watchData()
              ? 'claims-step2-active'
              : 'claims-step2-disable'
          }`}
          onClick={() => {
            this.submit();
          }}
        >
          立即提交
        </View>
        {showSuccess
          ? (
          <View className='submit-modal'>
            <View className='submit-modal-content'>
              <Image className='icon' src={`${ossHost}images/logout-success.png`}></Image>
              <View className='title'>已提交</View>
            </View>
          </View>
            )
          : null}
      </View>
    );
  }
}

export default StepTwo;
