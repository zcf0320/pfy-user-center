import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image, Input, Picker } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { submitInternetHospital } from '@actions/minApp';
import { IStoreProps } from '@reducers/interface';
import utils from '@utils/index';
import Drawer from '@components/Drawer';
import InputModal from '@components/HealthInputModal';
import HistoryModal from '@components/DrugHistory';
import Disease from '@components/OrderDisease';
import { upload, getIdCard } from '@actions/common';
import { connect } from 'react-redux';
import { getHealthFile } from '@actions/healthy';
import { SET_VISIT_INFO } from '@constants/minApp';
import PreviewImage from '@components/previewImage';
import InputHistory from '@components/InputHistory';
import './index.scss';

const { ossHost } = utils.appConfig;
const chooseList = [
  { rootName: '正常', value: true },
  { rootName: '异常', value: false }
];
interface IProps {
  save: Function;
}
interface IState {
  user: any;
  subInfo: any;
  drawer: any;
  showNumber: string | number;
  pastHistory: any;
  familyHistory: any;
  pregnancyStateList: any;
  historyList: any;
  // isSave: boolean;
  previewList: Array<string>;
  showInputHistory: boolean;
  pastText: string;
  familyText: string;
}
type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    save (data) {
      dispatch({
        type: SET_VISIT_INFO,
        payload: data
      });
    }
  })
)
class Info extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      user: {},
      showInputHistory: false,
      previewList: [],
      subInfo: {
        allergy: '',
        certificateImgs: [],
        familyDiseaseHistory: '',
        idCard: '',
        kidneyFunction: '',
        liverFunction: '',
        mobile: '',
        name: '',
        past: '',
        pregnancyState: '',
        used: '',
        weight: ''
      },
      showNumber: '',
      drawer: {
        1: '身高(cm)',
        2: '体重(kg)',
        3: '空腹血糖(mmol/L)',
        4: '血压(mmHg)',
        5: '疾病史',
        6: '过敏史',
        7: '家族病史',
        8: '备孕/怀孕/哺乳期'
      },
      pastHistory: [
        { name: '高血压', select: false },
        { name: '糖尿病', select: false },
        { name: '脑梗', select: false },
        { name: '白癜风', select: false },
        { name: '癫痫', select: false },
        { name: '哮喘', select: false }
      ],
      familyHistory: [
        { name: '高血压', select: false },
        { name: '糖尿病', select: false },
        { name: '脑梗', select: false },
        { name: '白癜风', select: false },
        { name: '癫痫', select: false },
        { name: '哮喘', select: false }
      ],

      pregnancyStateList: [
        { name: '备孕', select: false },
        { name: '怀孕', select: false },
        { name: '哺乳期', select: false }
      ],
      historyList: [],
      pastText: '',
      familyText: ''
      // isSave: false
    };
  }

  componentDidMount () {
    const { subInfo } = this.state;
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    // 判断是否已经存过
    const { idCard } = this.props.minApp.visitInfo;
    if (idCard) {
      this.setState({
        subInfo: this.props.minApp.visitInfo
      });
    } else {
      // 获取健康档案
      getIdCard().then(res => {
        subInfo.idCard = res;
        this.setState({ subInfo });
      });
      getHealthFile().then((res: any) => {
        const {
          weight,
          disease,
          familialDiseases,
          kidneyFunction,
          liverFunction,
          drugAllergy,
          allergyHistory
        } = res;

        subInfo.drugAllergy = drugAllergy || '否';
        subInfo.allergy = allergyHistory || '否';
        if (disease) {
          const pastList = disease.split(',');
          const pastArr: any = [];
          pastList.forEach(item => {
            pastArr.push({ name: item, select: true });
          });
          subInfo.past = pastArr;
        } else {
          if (disease === '否') {
            subInfo.past = [];
            this.setState({
              pastText: '否'
            });
          }
        }
        if (familialDiseases) {
          const familyList = familialDiseases.split(',');
          const familyArr: any = [];
          familyList.forEach(item => {
            familyArr.push({ name: item, select: true });
          });
          subInfo.familyDiseaseHistory = familyArr;
        } else {
          if (familialDiseases === '否') {
            subInfo.familyDiseaseHistory = [];
            this.setState({
              familyText: '否'
            });
          }
        }
        weight && (subInfo.weight = weight);
        kidneyFunction !== null && (subInfo.kidneyFunction = kidneyFunction);
        liverFunction !== null && (subInfo.liverFunction = liverFunction);
        // pregnancyState && (this.state.subInfo.pregnancyState = pregnancyState);
        subInfo.name = user.name;
        subInfo.mobile = user.mobile;
        this.setState({
          subInfo: subInfo
        });
      });
    }
    this.setState({
      user
    });
  }

  // componentWillUnmount () {
  //   const { isSave } = this.state;
  //   !isSave && this.props.save({});
  // }

  closeDrawer () {
    this.setState({
      showNumber: ''
    });
  }

  getInputValue (value) {
    const { subInfo } = this.state;
    subInfo.weight = value;
    this.setState({
      subInfo: subInfo,
      showNumber: ''
    });
  }

  getList (list) {
    const { subInfo, showNumber, pregnancyStateList } = this.state;
    let pregnancyState = 0;
    const selectList = list.filter((item, index) => {
      item.select === true && (pregnancyState = index + 1);
      return item.select;
    });
    if (showNumber === 5) {
      if (selectList.length > 0) {
        subInfo.past = selectList;
        this.setState({
          pastText: '是'
        });
      } else {
        subInfo.past = [];
        this.setState({
          pastText: '否'
        });
      }
    }
    showNumber === 6 && (subInfo.allergy = selectList);
    if (showNumber === 7) {
      if (selectList.length > 0) {
        subInfo.familyDiseaseHistory = selectList;
        this.setState({
          familyText: '是'
        });
      } else {
        subInfo.familyDiseaseHistory = [];
        this.setState({
          familyText: '否'
        });
      }
    }
    if (showNumber === 8) {
      subInfo.pregnancyState = pregnancyState;
      pregnancyStateList.forEach((item, index) => {
        item.select = false;
        pregnancyState === index + 1 && (item.select = true);
      });
    }
    this.setState({
      subInfo,
      pregnancyStateList: this.state.pregnancyStateList
    });
    this.closeDrawer();
  }

  onFunctionChange (type, e) {
    const { subInfo } = this.state;
    const value = chooseList[Number(e.detail.value)].value;
    type === 'liverFunction' && (subInfo.liverFunction = value);
    type === 'kidneyFunction' && (subInfo.kidneyFunction = value);
    this.setState({
      subInfo: this.state.subInfo
    });
  }

  getpregnancyText (pregnancyState) {
    const { pregnancyStateList } = this.state;
    let text = '';
    if (!pregnancyState) {
      pregnancyState !== '' && (text = '否');
    } else {
      text = pregnancyStateList[pregnancyState - 1].name;
    }
    return text;
  }

  // 上传图片
  uploadImg () {
    const vm = this;
    Taro.chooseImage({
      count: 1,
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        upload({
          filePath: tempFilePaths,
          module: 'report'
        }).then((res2: string) => {
          Taro.hideLoading();
          const result = JSON.parse(res2);
          vm.state.subInfo.certificateImgs.push(result.data);
          vm.setState({
            subInfo: vm.state.subInfo
          });
        });
      }
    });
  }

  delImage (index) {
    this.state.subInfo.certificateImgs.splice(index, 1);
    this.setState({
      subInfo: this.state.subInfo
    });
  }

  // 判断是否填写完成
  watchDate () {
    const { subInfo, user, pastText, familyText } = this.state;
    const {
      weight,
      mobile,
      kidneyFunction,
      liverFunction,
      pregnancyState
    } = subInfo;
    let result = true;
    !mobile && (result = false);
    !weight && (result = false);
    kidneyFunction === '' && (result = false);
    liverFunction === '' && (result = false);
    // // 判断男女 怀孕状态
    if (user.sex === 0) {
      pregnancyState === '' && (result = false);
    }
    // console.log(allergy);
    // console.log(drugAllergy);
    // '' 为不填 [] 否
    // (allergy === "" && drugAllergy === '') && (result = false);
    pastText === '' && (result = false);
    familyText === '' && (result = false);
    // used === "" && (result = false);
    return result;
  }

  confirm () {
    const { router } = getCurrentInstance();
    if (!this.watchDate()) {
      return;
    }
    const { mobile } = this.state.subInfo;
    if (!utils.checkPhone(mobile)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    const infor = this.state.subInfo;
    // if (this.state.prescription) {
    const information = {
      idCard: infor.idCard,
      name: infor.name,
      mobile: infor.mobile,
      weight: infor.weight,
      used: infor.used,
      certificateImgs: infor.certificateImgs,
      allergy: infor.allergyHistory,
      drugAllergy: infor.drugAllergy
    } as any;

    let pastStr = '';
    let familyStr = '';
    infor.past &&
      infor.past.length &&
      infor.past.forEach((item, index) => {
        pastStr += `${index !== 0 ? ',' : ''}${item.name}`;
      });
    information.kidneyFunction =
      infor.kidneyFunction !== null ? infor.kidneyFunction === '正常' : null;
    information.liverFunction =
      infor.liverFunction !== null ? infor.liverFunction === '正常' : null;
    infor.familyDiseaseHistory &&
      infor.familyDiseaseHistory.length &&
      infor.familyDiseaseHistory.forEach((item, index) => {
        familyStr += `${index !== 0 ? ',' : ''}${item.name}`;
      });

    information.past = pastStr || '否';
    information.familyDiseaseHistory = familyStr || '否';
    information.pregnancyState =
      infor.pregnancyState === '' ? null : infor.pregnancyState;
    const { serviceRecordId, list } = (router?.params && router.params) || {};
    this.props.save(this.state.subInfo);
    const params = {
      addressId: this.props.service.selectAdddress.id,
      medicineProductIdList: JSON.parse(decodeURI(list || '')),
      serviceRecordId,
      information: information
    };
    submitInternetHospital(params)
      .then((res: any) => {
        Taro.redirectTo({
          url: `/pages/webview/index?url=${res.url}`
        });
      })
      .catch(res => {});
    // } else {
    //   this.setState(
    //     {
    //       isSave: true
    //     },
    //     () => {
    //       Taro.navigateBack({
    //         delta: 1
    //       });
    //     }
    //   );
    // }
  }

  render () {
    const {
      user,
      subInfo,
      showNumber,
      drawer,
      historyList,
      pastHistory,
      pregnancyStateList,
      familyHistory,
      previewList,
      showInputHistory,
      pastText,
      familyText
    } = this.state;
    const {
      weight,
      mobile,
      pregnancyState,
      allergy,
      past,
      familyDiseaseHistory,
      certificateImgs,
      allergyHistory,
      drugAllergy
    } = subInfo;
    let unionAllergy = '否';
    let unionList = [];
    if (allergyHistory && allergyHistory !== '否') {
      unionList = unionList.concat(allergyHistory.split(','));
    }
    if (drugAllergy && drugAllergy !== '否') {
      unionList = unionList.concat(drugAllergy.split(','));
    }
    unionList.length && (unionAllergy = unionList.join(','));
    return (
      <Page showBack title='就诊信息'>
        {previewList.length
          ? (
          <PreviewImage
            imageList={previewList}
            close={() => {
              this.setState({
                previewList: []
              });
            }}
          ></PreviewImage>
            )
          : null}
        <View className='page-info flex'>
          <View className='title flex'>
            以下信息仅用于互联网医院为您提供问诊开方服务
          </View>
          <View className='info-modal'>
            <View className='modal-title flex'>
              <View className='left flex'>
                <Text>用药人信息</Text>
                <Image
                  src={`${ossHost}images/must.png`}
                  className='must'
                ></Image>
              </View>
              <View className='right'>仅限本人使用</View>
            </View>
            <View className='common flex'>
              <View className='left'>用药人姓名</View>
              <View className='right disable'>{user.name}</View>
            </View>
            <View className='common flex'>
              <View className='left'>身份证号码</View>
              <View className='right disable'>{subInfo.idCard}</View>
            </View>
            <View className='common flex'>
              <View className='left'>联系手机号</View>
              <Input
                className='right input'
                placeholder='用于医生回复时接收短信'
                placeholderClass='placeholder'
                maxlength={11}
                value={mobile}
                onInput={e => {
                  const info = this.state.subInfo;
                  info.mobile = e.detail.value;
                  this.setState({
                    subInfo: info
                  });
                }}
              ></Input>
            </View>
            <View
              className='common flex'
              onClick={() => {
                this.setState({
                  showNumber: 2
                });
              }}
            >
              <View className='left'>体重(kg)</View>
              <View className='right flex'>
                {weight
                  ? (
                  <Text>{weight}</Text>
                    )
                  : (
                  <Text className='default'>请输入体重</Text>
                    )}
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
            <View className='common flex'>
              <View className='left'>肝功能</View>
              <View className='right flex'>
                <Picker
                  mode='selector'
                  className='picker flex'
                  value={subInfo.liverFunction ? 0 : 1}
                  range={chooseList}
                  rangeKey='rootName'
                  onChange={this.onFunctionChange.bind(this, 'liverFunction')}
                  range-key='rootName'
                >
                  {subInfo.liverFunction !== ''
                    ? (
                    <View className='address'>
                      {subInfo.liverFunction ? '正常' : '异常'}
                    </View>
                      )
                    : (
                    <View className='placeholder address'>请选择</View>
                      )}
                </Picker>
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
            <View className='common flex'>
              <View className='left'>肾功能</View>
              <View className='right flex'>
                <Picker
                  mode='selector'
                  className='picker flex'
                  value={subInfo.kidneyFunction ? 0 : 1}
                  range={chooseList}
                  rangeKey='rootName'
                  onChange={this.onFunctionChange.bind(this, 'kidneyFunction')}
                  range-key='rootName'
                >
                  {subInfo.kidneyFunction !== ''
                    ? (
                    <View className='address'>
                      {subInfo.kidneyFunction ? '正常' : '异常'}
                    </View>
                      )
                    : (
                    <View className='placeholder address'>请选择</View>
                      )}
                </Picker>
                <Image
                  className='next'
                  src={`${ossHost}images/next.png`}
                ></Image>
              </View>
            </View>
            {user.sex === 0
              ? (
              <View
                className='common flex'
                onClick={() => {
                  pregnancyState &&
                    (pregnancyStateList[pregnancyState - 1].select = true);
                  this.setState({
                    historyList: pregnancyStateList,
                    showNumber: 8
                  });
                }}
              >
                <View className='left'>备孕/怀孕/哺乳期</View>
                <View className='right flex'>
                  {pregnancyState !== ''
                    ? (
                    <Text>{this.getpregnancyText(pregnancyState)}</Text>
                      )
                    : (
                    <Text className='default'>请选择</Text>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
                )
              : null}
            <View
              className='list'
              onClick={() => {
                // 根据past 选择的
                this.setState({
                  showInputHistory: true
                });
              }}
            >
              <View className='common flex'>
                <View className='left flex'>
                  <Text>过敏史</Text>
                </View>
                <View className='right flex'>
                  {unionAllergy !== null
                    ? (
                    <Text>{unionAllergy === '否' ? unionAllergy : '是'}</Text>
                      )
                    : (
                    <Text className='default'>请选择</Text>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
              {unionAllergy !== '否'
                ? (
                <View
                  className={`tag-list flex ${
                    allergy.length === 1 ? 'one' : ''
                  }`}
                >
                  {unionAllergy.split(',').map(item => {
                    return (
                      <View className='tag-item flex' key={item}>
                        <View className='item-content'>{item}</View>
                      </View>
                    );
                  })}
                </View>
                  )
                : null}
            </View>
            <View
              className='list'
              onClick={() => {
                // 根据past 选择的
                if (past && past.length) {
                  past.forEach(item => {
                    let isHas = false;
                    pastHistory.forEach(pItem => {
                      // 判断是否有

                      if (item.name === pItem.name) {
                        isHas = true;
                        pItem.select = true;
                      }
                    });
                    !isHas &&
                      pastHistory.push({
                        name: item.name,
                        select: true
                      });
                  });
                } else {
                  pastHistory.forEach(item => {
                    item.select = false;
                  });
                }
                this.setState({
                  historyList: pastHistory,
                  showNumber: 5
                });
              }}
            >
              <View className='common flex'>
                <View className='left flex'>
                  <Text>疾病史</Text>
                </View>
                <View className='right flex'>
                  {pastText
                    ? (
                    <Text>{pastText}</Text>
                      )
                    : (
                    <Text className='default'>请选择</Text>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
              {past && pastText !== '否' && past.length
                ? (
                <View
                  className={`tag-list flex ${past.length === 1 ? 'one' : ''}`}
                >
                  {past.map(item => {
                    return (
                      <View className='tag-item flex' key={item.name}>
                        <View className='item-content'>{item.name}</View>
                      </View>
                    );
                  })}
                </View>
                  )
                : null}
            </View>
            <View
              className='list'
              onClick={() => {
                // 根据past 选择的
                if (familyDiseaseHistory && familyDiseaseHistory.length) {
                  familyDiseaseHistory.forEach(item => {
                    let isHas = false;
                    familyHistory.forEach(pItem => {
                      // 判断是否有
                      if (item.name === pItem.name) {
                        isHas = true;
                        pItem.select = true;
                      }
                    });
                    !isHas &&
                      familyHistory.push({
                        name: item.name,
                        select: true
                      });
                  });
                } else {
                  familyHistory.forEach(item => {
                    item.select = false;
                  });
                }
                this.setState({
                  historyList: familyHistory,
                  showNumber: 7
                });
              }}
            >
              <View className='common flex'>
                <View className='left flex'>
                  <Text>家族病史</Text>
                </View>
                <View className='right flex'>
                  {familyText
                    ? (
                    <Text>{familyText}</Text>
                      )
                    : (
                    <Text className='default'>请选择</Text>
                      )}
                  <Image
                    className='next'
                    src={`${ossHost}images/next.png`}
                  ></Image>
                </View>
              </View>
              {familyDiseaseHistory &&
              familyText !== '否' &&
              familyDiseaseHistory.length
                ? (
                <View
                  className={`tag-list flex ${
                    familyDiseaseHistory.length === 1 ? 'one' : ''
                  }`}
                >
                  {familyDiseaseHistory.map(item => {
                    return (
                      <View className='tag-item flex' key={item.name}>
                        <View className='item-content'>{item.name}</View>
                      </View>
                    );
                  })}
                </View>
                  )
                : null}
            </View>
          </View>

          <View className='info-modal'>
            <View className='modal-title'>
              <View className='left flex'>
                <Text>就诊凭证</Text>
                <Text className='sub-title'>
                  （无凭证可能会影响医生对您的病情判断）
                </Text>
              </View>
            </View>
            <View className='tips'>
              <Text>已找到历史处方、病历、出院住院记录</Text>
            </View>
            <View className='img-list flex'>
              {certificateImgs.length
                ? certificateImgs.map((item, index) => {
                  return (
                      <View className='img-content no-border' key={item}>
                        <Image
                          src={`${ossHost}images/del.png`}
                          className='del'
                          onClick={() => {
                            this.delImage(index);
                          }}
                        ></Image>
                        <Image
                          src={item}
                          className='img-item'
                          mode='scaleToFill'
                          onClick={() => {
                            this.setState({
                              previewList: certificateImgs
                            });
                          }}
                        ></Image>
                      </View>
                  );
                })
                : null}
              {certificateImgs.length < 3 && (
                <View
                  className='img-content'
                  onClick={() => {
                    this.uploadImg();
                  }}
                ></View>
              )}
            </View>
          </View>
          <View
            className={`confirm flex ${this.watchDate() ? '' : 'disable'}`}
            onClick={() => {
              this.confirm();
            }}
          >
            保存并同意问诊
          </View>
        </View>
        {showNumber !== '' &&
          (showNumber !== 5 && showNumber !== 7
            ? (
            <Drawer
              title={drawer[showNumber]}
              close={() => {
                this.closeDrawer();
              }}
            >
              {showNumber < 4 && (
                <InputModal
                  value={weight}
                  placeholder={`请输入${drawer[showNumber]}`}
                  showNumber={showNumber}
                  confirm={value => {
                    this.getInputValue(value);
                  }}
                ></InputModal>
              )}
              {(showNumber === 6 || showNumber === 8) && (
                <HistoryModal
                  list={historyList}
                  showNumber={showNumber}
                  confirm={list => {
                    this.getList(list);
                  }}
                ></HistoryModal>
              )}
            </Drawer>
              )
            : (
            <Disease
              list={historyList}
              title={drawer[showNumber]}
              subTitle='是否有其他病史'
              close={() => {
                this.closeDrawer();
              }}
              confirm={list => {
                this.getList(list);
              }}
            ></Disease>
              ))}
        {showInputHistory
          ? (
          <InputHistory
            title='过敏史'
            drug
            subTitle='是否有其他过敏史'
            showNumber={10}
            selectText={allergyHistory === '否' ? '否' : allergyHistory}
            selectDrugText={drugAllergy === '否' ? '否' : drugAllergy}
            close={() => {
              this.setState({
                showInputHistory: false
              });
            }}
            confirm={(text, drugText) => {
              const info = this.state.subInfo;
              info.allergyHistory = text;
              info.drugAllergy = drugText;
              this.setState({
                subInfo: info
              });
            }}
          ></InputHistory>
            )
          : null}
      </Page>
    );
  }
}
export default Info;
