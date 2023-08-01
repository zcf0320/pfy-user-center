/* eslint-disable multiline-ternary */
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Input, Picker, Text } from '@tarojs/components';
import { Component } from 'react';
import { connect } from 'react-redux';
import InputHistory from '@components/InputHistory';
import {
  selectDisease,
  getRightClaimConfig,
  getServiceInfoClaimConfig,
  getOriginalReqStr,
  getAuthContent
} from '@actions/claimsSettle';
import * as commonApi from '@actions/common';
import { bindActionCreators } from 'redux';
import Page from '@components/page';
import Disease from '@components/DiseaseStore';
import ClaimsSearch from '@components/ClaimsSearch';
import utils from '@utils/index';
import { IStoreProps } from '@reducers/interface';
import * as actions from '../../actions';
import StepTwo from '../stepTwo';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  actions: any;
}

interface IState {
  historyList: any;
  isShow: boolean;
  isSearch: boolean;
  drawer: any;
  showNumber: number;
  idCard: string;
  step: number;
  selectDiseaseList: Array<any>;
  showInputHistory: boolean;
  unionAllergy: string;
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
class Step extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      // data: {},
      historyList: [],
      isShow: false,
      isSearch: false,
      drawer: {
        1: '就诊医院',
        2: '就诊科室'
      },
      showNumber: 0,
      idCard: '',
      step: 1,
      selectDiseaseList: [],
      showInputHistory: false,
      unionAllergy: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.getIdCard();
    const user = Taro.getStorageSync(utils.appConfig.userInfo);
    this.props.actions.changeTime({
      value: user.name,
      name: 'patientName'
    });
    this.props.actions.changeTime({
      value: user.name,
      name: 'insuredName'
    });
    if (router?.params && router.params.again) {
      getOriginalReqStr({
        serviceRecordId: router.params.serviceRecordId
      }).then((res: any) => {
        const result = JSON.parse(res);
        const historyList = [] as any;
        result.hospitalTreatmentInfo.diseaseNameList.forEach(item => {
          historyList.push({
            name: item,
            select: true
          });
        });
        this.setState({ historyList });
        this.props.actions.setOldData(result);
        this.props.actions.setOldList(result.settlementDetailsList);
      });
    }
    if (router?.params && router.params.serviceRecordId) {
      selectDisease({
        serviceRecordId: router.params.serviceRecordId
      }).then((res: any) => {
        const arr = [] as any;
        res.forEach(item => {
          arr.push(item.name);
        });
        this.setState({
          selectDiseaseList: arr
        });
      });
      getServiceInfoClaimConfig({
        serviceRecordId: router.params.serviceRecordId
      }).then(res => {
        this.props.actions.setConfig(res);
      });
    } else {
      getRightClaimConfig({
        insuranceProductId: router?.params && router.params.insuranceProductId,
        rightsId: router?.params && router.params.rightsId
      }).then(res => {
        this.props.actions.setConfig(res);
      });
    }
  }

  changeCheck = (isChecked: string, index: number) => {
    this.props.actions.changeType({ isChecked, index });
  };

  closeDrawer () {
    this.setState({
      isShow: false
    });
  }

  closeSearch () {
    this.setState({
      isSearch: false
    });
  }

  getList (list) {
    this.setState({ historyList: list });
    const data: any = [];
    if (list.length > 0) {
      for (const i in list) {
        if (list[i].select) {
          data.push(list[i].name);
        }
      }
    }
    this.props.actions.changeTime({
      value: data,
      name: 'diseaseNameList'
    });
    this.closeDrawer();
  }

  getName (name) {
    const { claimsSettle } = this.props;

    const { form } = claimsSettle || {};
    const { healthInfo } = form || {};
    const { medicines } = healthInfo || {};
    if (this.state.showNumber === 3) {
      const medicineList = medicines ? medicines.split(',') : [];
      medicineList.push(name.split('-')[0]);
      const medicineString = medicineList.join(',');
      this.props.actions.unionHealthInfo({ medicines: medicineString });
      this.closeSearch();
      return;
    }
    this.props.actions.changeTime({
      value: name,
      name:
        this.state.showNumber === 1
          ? 'treatmentHospital'
          : 'treatmentDepartment'
    });
    this.closeSearch();
  }

  stampToTime (timestamp) {
    if (timestamp) {
      const d = new Date(timestamp * 1);
      let date = '';
      date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      return date;
    }
  }

  getIdCard () {
    commonApi.getIdCard().then((res: string) => {
      this.setState({ idCard: res });
      this.props.actions.changeTime({
        value: res,
        name: 'insuredIdCard'
      });
    });
  }

  watchData () {
    // const { router } = getCurrentInstance();
    const { historyList, unionAllergy } = this.state;
    const { claimsSettle } = this.props;
    const { form, config } = claimsSettle;
    let result1 = false;
    let result2 = false;
    const {
      treatmentTime,
      treatmentHospital,
      treatmentDepartment,
      userPaid
    } = form.hospitalTreatmentInfo;
    const { medicines } = form.healthInfo || {};
    if ('POsiHG' in config) {
      config.POsiHG.codeLists.every(item => {
        if (item.required) {
          if (
            (item.code === 'JKiyqs' && !treatmentTime) ||
            (item.code === 'GJsUIW' && !treatmentHospital) ||
            (item.code === 'HKljiw' && !treatmentDepartment) ||
            (item.code === 'YHGwqa' && !userPaid) ||
            (item.code === 'MEDISE' && historyList.length <= 0)
          ) {
            result1 = false;
            return false;
          } else {
            result1 = true;
            return true;
          }
        } else {
          result1 = true;
          return result1;
        }
      });
    } else {
      result1 = true;
    }
    if ('YcPniG' in config) {
      config.YcPniG.codeLists.every(item => {
        if (item.required) {
          if (
            (item.code === 'hctNIU' && !unionAllergy) ||
            (item.code === 'BctNoU' && !medicines)
          ) {
            result2 = false;
            return false;
          } else {
            result2 = true;
            return true;
          }
        } else {
          result2 = true;
          return result2;
        }
      });
    } else {
      result2 = true;
    }
    // if (!(router?.params && router.params.claimType) && historyList.length > 0) {
    //   result = true;
    // }
    // console.log('historyList', historyList, result1 && result2);
    return result1 && result2 && form.userBaseInfo.insuredMobile.length === 11;
  }

  hasTrue = (key: string) => {
    const { claimsSettle } = this.props;
    const { config } = claimsSettle;
    return key in config;
  };

  submit = () => {
    const { router } = getCurrentInstance();
    if (this.watchData()) {
      getAuthContent({
        insuranceProductId:
          (router?.params && router.params.insuranceProductId) || '',
        rightsId: (router?.params && router.params.rightsId) || '',
        serviceRecordId:
          (router?.params && router.params.serviceRecordId) || ''
      }).then((res: any) => {
        if (res.ifAuthorization === 2) {
          this.props.actions.setModal({
            show: true,
            title: '',
            content: res.authorizationContent,
            cancelText: '取消',
            confirmText: '确认授权',
            clickCancel: () => {
              //
            },
            clickConfirm: () => {
              this.setState({
                step: 2
              });
            }
          });
        } else {
          this.setState({
            step: 2
          });
        }
      });
    }
  };

  render () {
    const { router } = getCurrentInstance();
    const {
      drawer,
      historyList,
      isShow,
      isSearch,
      showNumber,
      idCard,
      step,
      selectDiseaseList,
      showInputHistory,
      unionAllergy
    } = this.state;
    const { claimsSettle } = this.props;

    const { form, config } = claimsSettle || {};
    const user = Taro.getStorageSync(utils.appConfig.userInfo);
    const { healthInfo } = form || {};
    const { allergyHistory, drugAllergy, medicines } = healthInfo || {};

    return (
      <Page title='提交理赔材料' showBack>
        {showInputHistory ? (
          <InputHistory
            drug={false}
            title='过敏史'
            subTitle='是否有其他过敏史'
            showNumber={10}
            serviceRecordId={
              (router?.params && router.params.serviceRecordId) || ''
            }
            selectText={allergyHistory === '否' ? '否' : allergyHistory}
            selectDrugText={drugAllergy === '否' ? '否' : drugAllergy}
            close={() => {
              this.setState({
                showInputHistory: false
              });
            }}
            confirm={(text, drugText) => {
              let unionList = [] as any;
              if (text === '否' && drugText === '否') {
                unionList.push('否');
              }
              if (text && text !== '否') {
                unionList = unionList.concat(text.split(','));
              }
              if (drugText && drugText !== '否') {
                unionList = unionList.concat(drugText.split(','));
              }
              this.props.actions.unionHealthInfo({
                allergyHistory: text,
                drugAllergy: drugText
              });
              this.setState({
                unionAllergy: unionList.join(',')
              });
            }}
          ></InputHistory>
        ) : null}
        {step === 1 ? (
          <View className='claims-step'>
            <Image
              className='claims-step-img'
              src={`${ossHost}claims_first.png`}
            />

            <View className='claims-step-top'>
              <View className='claims-step-title'>
                <View className='claims-step-redline'></View>
                <View>基本信息</View>
              </View>
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>被保险人</View>
                <Input
                  className='claims-step-input  claims-step-top-666'
                  type='text'
                  maxlength={10}
                  placeholderClass='claims-step-place'
                  value={user.name}
                  disabled
                />
              </View>
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>身份证号</View>
                <Input
                  className='claims-step-input  claims-step-top-666'
                  type='text'
                  placeholderClass='claims-step-place'
                  value={idCard}
                  disabled
                />
              </View>
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>
                  手机号码 <View className='must'></View>
                </View>
                <Input
                  className='claims-step-input'
                  type='number'
                  maxlength={11}
                  placeholderClass='claims-step-place'
                  placeholder='请输入手机号码'
                  value={form.userBaseInfo.insuredMobile}
                  onInput={e => {
                    this.props.actions.changeTime({
                      value: e.detail.value,
                      name: 'insuredMobile'
                    });
                  }}
                />
              </View>
              <View className='claims-step-top-box'>
                <View className='claims-step-top-left'>
                  <Text>邮箱</Text>
                </View>
                <Input
                  className='claims-step-input'
                  type='text'
                  maxlength={30}
                  placeholderClass='claims-step-place'
                  placeholder='请输入邮箱'
                  value={form.userBaseInfo.insuredEmail}
                  onInput={e => {
                    this.props.actions.changeTime({
                      value: e.detail.value,
                      name: 'insuredEmail'
                    });
                  }}
                />
              </View>
            </View>
            <View className='claims-step-top'>
              <View>
                {this.hasTrue('POsiHG') ? (
                  // 'POsiHG' in config
                  <View>
                    <View className='claims-step-title'>
                      <View className='claims-step-redline'></View>
                      <View>就诊信息</View>
                    </View>
                    {config.POsiHG.codeLists.map(item => {
                      return (
                        <View key={item.code}>
                          {item.code === 'NOFPAN' ? (
                            <View className='claims-step-top-box'>
                              <View className='claims-step-top-left'>
                                就诊人姓名
                              </View>
                              <Input
                                className='claims-step-input  claims-step-top-666'
                                type='text'
                                maxlength={10}
                                placeholderClass='claims-step-place'
                                value={user.name}
                                disabled
                              />
                            </View>
                          ) : null}
                          {item.code === 'MEDISE' ? (
                            <View className='claims-step-top-comfirm'>
                              {router?.params &&
                              router.params.serviceRecordId &&
                              selectDiseaseList.length ? (
                                <View className='claims-step-dis'>
                                  <View className='claims-step-top-left'>
                                    <Text>确诊疾病</Text>
                                    {item.required ? (
                                      <View className='must'></View>
                                    ) : null}
                                  </View>
                                  <View className='claims-step-search'>
                                    <Picker
                                      mode='selector'
                                      value={0}
                                      range={selectDiseaseList}
                                      onChange={e => {
                                        this.props.actions.changeTime({
                                          value: [
                                            selectDiseaseList[e.detail.value]
                                          ],
                                          name: 'diseaseNameList'
                                        });
                                        this.setState({
                                          historyList: [
                                            {
                                              name:
                                                selectDiseaseList[
                                                  e.detail.value
                                                ],
                                              select: true
                                            }
                                          ]
                                        });
                                      }}
                                    >
                                      请搜索
                                    </Picker>
                                    <Image
                                      src={`${ossHost}claims_arrow.png`}
                                      className='claims-step-top-img'
                                    />
                                  </View>
                                </View>
                                  ) : (
                                <View className='claims-step-dis'>
                                  <View className='claims-step-top-left'>
                                    <Text>确诊疾病</Text>
                                    {item.required ? (
                                      <View className='must'></View>
                                    ) : null}
                                  </View>
                                  <View
                                    className='claims-step-search'
                                    onClick={() => {
                                      this.setState({ isShow: true });
                                    }}
                                  >
                                    请搜索
                                    <Image
                                      src={`${ossHost}claims_arrow.png`}
                                      className='claims-step-top-img'
                                    />
                                  </View>
                                </View>
                                  )}

                              <View className='claims-step-tag-box'>
                                {historyList.length > 0 &&
                                  historyList.map(
                                    (item: any) =>
                                      item.select && (
                                        <View
                                          className='claims-step-tag claims-ellipsis'
                                          key={item.name}
                                        >
                                          {item.name}
                                        </View>
                                      )
                                  )}
                              </View>
                            </View>
                          ) : null}
                          {item.code === 'JKiyqs' ? (
                            <View className='claims-step-top-box'>
                              <View className='claims-step-top-left'>
                                <Text>就诊时间</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              <Picker
                                mode='date'
                                value=''
                                end={utils.timeFormat(
                                  new Date().getTime(),
                                  'y-m-d'
                                )}
                                onChange={e => {
                                  this.props.actions.changeTime({
                                    value: new Date(
                                      e.detail.value.replace(/-/g, '/')
                                    ).getTime(),
                                    name: 'treatmentTime'
                                  });
                                }}
                              >
                                <View className='claims-step-picker'>
                                  {!form.hospitalTreatmentInfo
                                    .treatmentTime && (
                                    <View className='claims-step-search'>
                                      请选择
                                      <Image
                                        src={`${ossHost}claims_arrow.png`}
                                        className='claims-step-top-img'
                                      />
                                    </View>
                                  )}
                                  <View className='claims-step-name claims-ellipsis claims-step-time'>
                                    {this.stampToTime(
                                      form.hospitalTreatmentInfo.treatmentTime
                                    )}
                                  </View>
                                </View>
                              </Picker>
                            </View>
                          ) : null}
                          {item.code === 'GJsUIW' ? (
                            <View className='claims-step-top-box'>
                              <View className='claims-step-top-left'>
                                <Text>就诊医院</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              {!form.hospitalTreatmentInfo
                                .treatmentHospital && (
                                <View
                                  className='claims-step-search'
                                  onClick={() => {
                                    this.setState({
                                      isSearch: true,
                                      showNumber: 1
                                    });
                                  }}
                                >
                                  请搜索
                                  <Image
                                    src={`${ossHost}claims_arrow.png`}
                                    className='claims-step-top-img'
                                  />
                                </View>
                              )}
                              {form.hospitalTreatmentInfo.treatmentHospital && (
                                <View
                                  className='claims-step-name claims-ellipsis'
                                  onClick={() => {
                                    this.setState({
                                      isSearch: true,
                                      showNumber: 1
                                    });
                                  }}
                                >
                                  {form.hospitalTreatmentInfo.treatmentHospital}
                                </View>
                              )}
                            </View>
                          ) : null}
                          {item.code === 'HKljiw' ? (
                            <View className='claims-step-top-box'>
                              <View className='claims-step-top-left'>
                                <Text>就诊科室</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              {!form.hospitalTreatmentInfo
                                .treatmentDepartment && (
                                <View
                                  className='claims-step-search'
                                  onClick={() => {
                                    this.setState({
                                      isSearch: true,
                                      showNumber: 2
                                    });
                                  }}
                                >
                                  请搜索
                                  <Image
                                    src={`${ossHost}claims_arrow.png`}
                                    className='claims-step-top-img'
                                  />
                                </View>
                              )}
                              {form.hospitalTreatmentInfo
                                .treatmentDepartment && (
                                <View
                                  className='claims-step-name claims-ellipsis'
                                  onClick={() => {
                                    this.setState({
                                      isSearch: true,
                                      showNumber: 2
                                    });
                                  }}
                                >
                                  {
                                    form.hospitalTreatmentInfo
                                      .treatmentDepartment
                                  }
                                </View>
                              )}
                            </View>
                          ) : null}
                          {item.code === 'YHGwqa' ? (
                            <View className='claims-step-top-box'>
                              <View className='claims-step-top-left'>
                                <Text>自费金额</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              <Input
                                className='claims-step-input'
                                type='digit'
                                maxlength={20}
                                placeholderClass='claims-step-place'
                                placeholder='请输入自费金额'
                                value={form.hospitalTreatmentInfo.userPaid}
                                onInput={e => {
                                  this.props.actions.changeTime({
                                    value: e.detail.value,
                                    name: 'userPaid'
                                  });
                                }}
                              />
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </View>
            {this.hasTrue('YcPniG') ? (
              <View className='claims-step-top'>
                <View className='claims-step-title'>
                  <View className='claims-step-redline'></View>
                  <View>健康信息</View>
                  {/* <Text className="claims-step-choose">（选填）</Text> */}
                </View>
                {config.YcPniG.codeLists &&
                  config.YcPniG.codeLists.map(item => {
                    return (
                      <View key={item.code}>
                        {item.code === 'hctNIU' ? (
                          <View className='claims-step-top-comfirm'>
                            <View className='claims-step-dis'>
                              <View className='claims-step-top-left'>
                                <Text>您是否有过敏史？</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              <View
                                className='claims-step-search allergy'
                                onClick={() => {
                                  this.setState({ showInputHistory: true });
                                }}
                              >
                                {unionAllergy === '否' ? unionAllergy : ''}
                                <Image
                                  src={`${ossHost}claims_arrow.png`}
                                  className='claims-step-top-img'
                                />
                              </View>
                            </View>

                            <View className='claims-step-tag-box'>
                              {unionAllergy !== '否' &&
                                unionAllergy.length > 0 &&
                                unionAllergy.split(',').map((allergy: any) => {
                                  return (
                                    <View
                                      className='claims-step-tag claims-ellipsis'
                                      key={allergy}
                                    >
                                      {allergy}
                                    </View>
                                  );
                                })}
                            </View>
                            {/* </View> */}
                          </View>
                        ) : null}
                        {item.code === 'BctNoU' ? (
                          <View className='claims-step-top-comfirm'>
                            <View className='claims-step-dis'>
                              <View className='claims-step-top-left'>
                                <Text>您曾吃过哪些药品？</Text>
                                {item.required ? (
                                  <View className='must'></View>
                                ) : null}
                              </View>
                              <View
                                className='claims-step-search'
                                onClick={() => {
                                  this.setState({
                                    isSearch: true,
                                    showNumber: 3
                                  });
                                }}
                              >
                                请搜索
                                <Image
                                  src={`${ossHost}claims_arrow.png`}
                                  className='claims-step-top-img'
                                />
                              </View>
                            </View>

                            <View className='claims-step-tag-box'>
                              {medicines &&
                                medicines.length > 0 &&
                                medicines.split(',').map((medicine: any) => (
                                  <View
                                    className='claims-step-tag claims-ellipsis'
                                    key={medicine}
                                  >
                                    {medicine}
                                  </View>
                                ))}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
              </View>
            ) : null}
            <View
              className={`claims-step-btn ${
                this.watchData() ? 'claims-step-active' : 'claims-step-disable'
              }`}
              onClick={() => {
                this.submit();
              }}
            >
              立即提交
            </View>
          </View>
        ) : (
          <StepTwo
            productReviewConfigId={
              (router?.params && router.params.productReviewConfigId) || ''
            }
            serviceRecordId={
              (router?.params && router.params.serviceRecordId) || ''
            }
            insuranceProductId={
              (router?.params && router.params.insuranceProductId) || ''
            }
            insurancePlanId={
              (router?.params && router.params.insurancePlanId) || ''
            }
            rightsId={(router?.params && router.params.rightsId) || ''}
            policyNo={(router?.params && router.params.policyNo) || ''}
          ></StepTwo>
        )}

        {isShow && (
          <Disease
            list={historyList}
            title='确诊疾病'
            close={() => {
              this.closeDrawer();
            }}
            confirm={list => {
              this.getList(list);
            }}
          ></Disease>
        )}
        {isSearch && (
          <ClaimsSearch
            title={drawer[showNumber]}
            showNumber={showNumber}
            serviceRecordId={
              (router?.params && router.params.serviceRecordId) || ''
            }
            close={() => {
              this.closeSearch();
            }}
            confirm={name => {
              this.getName(name);
            }}
          ></ClaimsSearch>
        )}
      </Page>
    );
  }
}

export default Step;
