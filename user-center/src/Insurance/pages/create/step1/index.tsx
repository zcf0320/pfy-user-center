import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, Input, Picker, ScrollView } from '@tarojs/components';
import utils from '@utils/index';
import { connect } from 'react-redux';
import { getConfig, getAllProvice, getQuestion } from '@actions/insurance';
import { GET_CONFIG_SHIP, GET_CONFIG_JOB, GET_CONFIG_ALLOWANCE, SET_PROVICE_PICK_ARR, GET_PROVICE_LIST, GET_QUESTIONNAIRE_LIST, SET_SUB_INFO } from '@constants/insurance';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
    getConfigShip: Function;
    getConfigJob: Function;
    getAllowance: Function;
    getProviceList: Function;
    getQuestionList: Function;
    setSubInfo: Function;
    setQuestionList: Function;
}
interface IState {
    policyHolderName: string;
    policyHolderIdCard: string;
    policyHolderMobile: string;
    policyHolderEmail: string;
    relationship: number;
    insuredName: string;
    insuredSex: string | number;
    insuredIdCard: string;
    insuredAge: string;
    insuredJob: string | number;
    hasSocialSecurity: string | number;
    allowanceConfigId: string | number;
    insuredMobile: string;
    insuredEmail: string;
    customerName: string;
    customerMobile: string;
    customerEmail: string;
    agentName: string;
    agentMobile: string;
    subsidiary: string;
    cityId: number;
    city: string;
    provinceId: number;
    multiIndex: number [];
    emptyHeight:number;
    // agree: boolean;
}
const sexConfig = [
  { text: '男', value: 1 },
  { text: '女', value: 0 }
];
const SocialSecurity = [
  { text: '无', value: 0 },
  { text: '有', value: 1 }
];
@connect(state => state, dispatch => ({
  getConfigShip (params) {
    return new Promise((resolve, reject) => {
      getConfig(params).then(res => {
        resolve(res);
        dispatch({
          type: GET_CONFIG_SHIP,
          payload: res
        });
      });
    });
  },
  getConfigJob (params) {
    getConfig(params).then(res => {
      dispatch({
        type: GET_CONFIG_JOB,
        payload: res
      });
    });
  },
  getAllowance (params) {
    getConfig(params).then(res => {
      dispatch({
        type: GET_CONFIG_ALLOWANCE,
        payload: res
      });
    });
  },
  setCities (val) {
    dispatch({
      type: SET_PROVICE_PICK_ARR,
      payload: val
    });
  },
  getProviceList () {
    getAllProvice().then(res => {
      dispatch({
        type: GET_PROVICE_LIST,
        payload: res
      });
      dispatch({
        type: SET_PROVICE_PICK_ARR,
        payload: 0
      });
    });
  },
  // 获取问券
  getQuestionList () {
    getQuestion({ code: 'yyZjvb' }).then(res => {
      dispatch({
        type: GET_QUESTIONNAIRE_LIST,
        payload: res.questionnaire[0].questions
      });
    });
  },
  // 选择女的去掉最后一道题
  setQuestionList (data) {
    dispatch({
      type: GET_QUESTIONNAIRE_LIST,
      payload: data
    });
  },
  // 保存提交信息
  setSubInfo (data) {
    dispatch({
      type: SET_SUB_INFO,
      payload: data
    });
  }
}))
class Create extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      multiIndex: [0, 0],
      policyHolderName: '',
      policyHolderIdCard: '',
      policyHolderMobile: '',
      policyHolderEmail: '',
      relationship: 0,
      insuredName: '',
      insuredSex: '',
      insuredIdCard: '',
      insuredAge: '',
      insuredJob: '',
      hasSocialSecurity: '',
      allowanceConfigId: '',
      insuredMobile: '',
      insuredEmail: '',
      customerName: '',
      customerMobile: '',
      customerEmail: '',
      agentMobile: '',
      agentName: '',
      subsidiary: '',
      city: '',
      cityId: 0,
      provinceId: 0,
      // agree: false,
      // scrollY: true,
      emptyHeight: 0
    };
  }

  componentDidMount () {
    // 默认选本人
    this.props.getConfigShip({ type: 'insureRelationship' }).then(res => {
      res.forEach((item, index) => {
        item.code === 'insureRelationshipSelf' && this.setState({
          relationship: index
        });
      });
    });
    this.props.getConfigJob({ type: 'job' });
    this.props.getAllowance({ type: 'allowance' });
    this.props.getProviceList();
    const vm = this;
    Taro.getSystemInfo({
      success: function (res) {
        const { windowHeight, windowWidth } = res;
        const height = utils.appConfig.isH5 ? 92 : 48;
        vm.setState({
          emptyHeight: windowHeight - (windowWidth / 375) * height
        });
      }
    });
  }

  componentDidShow () {
    this.props.getQuestionList();
  }

    handleInput = (key, value) => {
      this.setState({ [key]: value.detail.value });
    }

    onShipChange (e) {
      this.setState({
        relationship: Number(e.detail.value)
      });
    }

    onSexChange (e) {
      this.setState({
        insuredSex: sexConfig[Number(e.detail.value)].value
      });
    }

    onJobChange (e) {
      this.setState({
        insuredJob: Number(e.detail.value)
      });
    }

    onSocialSecurityChange (e) {
      this.setState({
        hasSocialSecurity: SocialSecurity[Number(e.detail.value)].value
      });
    }

    onAllowanceChange (e) {
      this.setState({
        allowanceConfigId: Number(e.detail.value)
      });
    }

    // 省份改变
    onProviceChange (e) {
      const { value } = e.detail;
      const { provinceId } = this.props.insurance.provicePickArr[0][value[0]];
      const { cityId, label } = this.props.insurance.provicePickArr[1][value[1]];
      // 选择相同的 不变
      if (cityId === this.state.cityId) {
        return;
      }
      this.setState({
        cityId,
        city: label,
        provinceId,
        multiIndex: value
      });
    }

    columnChange (e) {
      const { column, value } = e.detail;
      !column && this.props.setCities(value);
    }

    // 判断是否为本人
    isSelf () {
      let result = false;
      const { relationship } = this.state;
      const { configShip } = this.props.insurance;
      configShip.length && (result = !!(configShip[relationship].code === 'insureRelationshipSelf'));
      return result;
    }

    getShipNameByValue () {
      const { relationship } = this.state;
      let name = '';
      this.props.insurance.configShip.length && (name = this.props.insurance.configShip[relationship].rootName);
      return name;
    }

    // 判断是否可以进行下一步
    watchNext () {
      let result = false;
      const { policyHolderName, policyHolderMobile, policyHolderIdCard, insuredSex, insuredAge, insuredJob, hasSocialSecurity, cityId, allowanceConfigId, insuredName, insuredIdCard } = this.state;
      // 投保人信息
      if (policyHolderName && policyHolderMobile && policyHolderIdCard) {
        result = true;
      }
      // 被保人信息
      if (insuredSex !== '' && insuredAge && insuredJob !== '' && hasSocialSecurity !== '' && cityId && allowanceConfigId !== '') {
        result = (result && true);
      } else {
        result = false;
      }
      // 如果非本人投保
      if (!this.isSelf()) {
        if (insuredName && insuredIdCard) {
          result = (result && true);
        } else {
          result = false;
        }
      }
      return result;
    }

    save () {
      // 判断是否
      if (!this.watchNext()) {
        return;
      }
      const { configShip, configJob, configAllowance } = this.props.insurance;
      const {
        policyHolderName,
        policyHolderMobile,
        policyHolderIdCard,
        policyHolderEmail,
        relationship,
        insuredName,
        insuredSex,
        insuredIdCard,
        insuredAge,
        insuredJob,
        hasSocialSecurity,
        provinceId,
        cityId,
        allowanceConfigId,
        insuredMobile,
        insuredEmail,
        customerName,
        customerMobile,
        customerEmail,
        agentName,
        agentMobile,
        subsidiary
      } = this.state;
      const subInfo: any = {
        policyHolderName,
        policyHolderMobile,
        policyHolderIdCard,
        relationship: configShip[relationship].rootId,
        insuredSex,
        insuredAge,
        insuredJob: configJob[insuredJob].rootId,
        hasSocialSecurity: !!hasSocialSecurity,
        provinceId,
        cityId,
        allowanceConfigId: configAllowance[allowanceConfigId].rootId
      };
      policyHolderEmail && (subInfo.policyHolderEmail = policyHolderEmail);
      insuredName && (subInfo.insuredName = insuredName);
      insuredIdCard && (subInfo.insuredIdCard = insuredIdCard);
      insuredMobile && (subInfo.insuredMobile = insuredMobile);
      insuredEmail && (subInfo.insuredEmail = insuredEmail);
      customerName && (subInfo.customerName = customerName);
      customerMobile && (subInfo.customerMobile = customerMobile);
      customerEmail && (subInfo.customerEmail = customerEmail);
      agentName && (subInfo.agentName = agentName);
      agentMobile && (subInfo.agentMobile = agentMobile);
      subsidiary && (subInfo.subsidiary = subsidiary);

      if (this.isSelf()) {
        subInfo.insuredName = policyHolderName;
        subInfo.insuredIdCard = policyHolderIdCard;
        subInfo.insuredMobile = policyHolderMobile;
        policyHolderEmail && (subInfo.insuredEmail = policyHolderEmail);
      }
      let error = '';
      if (Number(insuredAge) < 18) {
        error = '年龄必须大于18';
      }
      if (agentMobile) {
        !utils.checkPhone(agentMobile) && (error = '请输入正确的代理人手机号');
      }
      if (customerMobile) {
        !utils.checkPhone(customerMobile) && (error = '请输入正确的开票信息手机号');
      }
      if (customerEmail) {
        !utils.checkMail(customerEmail) && (error = '请输入正确的开票信息邮箱');
      }
      if (insuredEmail) {
        !utils.checkMail(insuredEmail) && (error = '请输入正确的被投保人邮箱');
      }
      if (insuredMobile) {
        !utils.checkPhone(insuredMobile) && (error = '请输入正确的被投保人手机号');
      }
      if (insuredIdCard) {
        !utils.checkIdCard(insuredIdCard) && (error = '请输入正确的被投保人证件号码');
      }
      if (policyHolderEmail) {
        !utils.checkMail(policyHolderEmail) && (error = '请输入正确的投保人邮箱');
      }
      if (policyHolderMobile) {
        !utils.checkPhone(policyHolderMobile) && (error = '请输入正确的投保人手机号');
      }
      if (policyHolderIdCard) {
        !utils.checkIdCard(policyHolderIdCard) && (error = '请输入正确的投保人证件号码');
      }
      if (error) {
        Taro.showToast({
          title: error,
          icon: 'none',
          duration: 3000
        });
        return;
      }
      this.props.setSubInfo(subInfo);
      // 判断是否为女性
      if (insuredSex === 1) {
        this.props.insurance.questionnaireList.pop();
      }
      // this.props.setStep(2)
      Taro.navigateTo({
        url: '/Insurance/pages/inform/index'
      });
    }

    render () {
      const { policyHolderName, policyHolderIdCard, policyHolderMobile, policyHolderEmail, insuredName, insuredIdCard, insuredAge, insuredMobile, insuredEmail, customerName, customerEmail, customerMobile, agentName, agentMobile, subsidiary } = this.state;
      return (
                <ScrollView
                  style={{ height: `${this.state.emptyHeight}px` }}
                  scrollY
                >
                    <View className='page-step1 flex'>
                    <View className='common'>
                        <View className='title'>产品信息</View>
                        <View className='common-item flex'>
                            <View className='label'>方案</View>
                            <Input value='华农健康保险' disabled className='input disable'></Input>
                        </View>

                        <View className='common-item flex'>
                            <View className='label'>生效日期</View>
                            <Input value='投保成功后一个工作日' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>保障期限</View>
                            <Input value='一年' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>保额</View>
                            <Input value='300万' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>免赔额</View>
                            <Input value='0' disabled className='input disable'></Input>
                        </View>
                    </View>
                    <View className='common'>
                        <View className='title'>投保人信息</View>
                        <View className='common-item flex'>
                            <View className='label'>姓名</View>
                            <Input value={policyHolderName}
                              type='text'
                              placeholder='请输入投保人姓名'
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'policyHolderName')}
                              className='input'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>证件类型</View>
                            <Input value='身份证' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>证件号码</View>
                            <Input value={policyHolderIdCard}
                              type='text'
                              placeholder='请输入投保人证件号码'
                              adjustPosition={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'policyHolderIdCard')}
                              className='input'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>手机号</View>
                            <Input value={policyHolderMobile}
                              type='number'
                              maxlength={11}
                              adjustPosition={false}
                              placeholder='请输入投保人手机号'
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'policyHolderMobile')}
                              className='input'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>邮箱</View>
                            <Input value={policyHolderEmail}
                              type='text'
                              placeholder='选填'
                              adjustPosition={false}
                              onInput={this.handleInput.bind(this, 'policyHolderEmail')}
                              placeholderClass='placeholder'
                              className='input'
                            ></Input>
                        </View>
                    </View>
                    <View className='common'>
                        <View className='title'>被保人信息</View>
                        <View className='common-item flex'>
                            <View className='label'>与被保人关系</View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={this.props.insurance.configShip} value={this.state.relationship} rangeKey='rootName' onChange={this.onShipChange.bind(this)} range-key='rootName'>
                                    <Text className='address'>{this.getShipNameByValue()}</Text>
                                </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        {!this.isSelf() && <View className='common-item flex'>
                            <View className='label'>姓名</View>
                            <Input value={insuredName}
                              type='text'
                              placeholder='请输入姓名'
                              adjustPosition={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'insuredName')}
                              className='input'
                            ></Input>
                        </View>}
                        <View className='common-item flex'>
                            <View className='label'>性别</View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={sexConfig} rangeKey='text' onChange={this.onSexChange.bind(this)} range-key='text'>
                                    {
                                        this.state.insuredSex !== '' ? (<Text className='address'>{this.state.insuredSex === 0 ? '女' : '男'}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                    }
                                </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        {
                            !this.isSelf() && <View className='common-item flex'>
                                <View className='label'>证件类型</View>
                                <Input value='身份证' disabled className='input disable'></Input>
                            </View>
                        }
                        {
                            !this.isSelf() && <View className='common-item flex'>
                                <View className='label'>证件号码</View>
                                <Input value={insuredIdCard}
                                  type='text'
                                  placeholder='请输入被保人证件号码'
                                  adjustPosition={false}
                                  placeholderClass='placeholder'
                                  onInput={this.handleInput.bind(this, 'insuredIdCard')}
                                  className='input'
                                ></Input>
                            </View>
                        }
                        <View className='common-item flex'>
                            <View className='label'>年龄</View>
                                <Input value={insuredAge}
                                  type='number'
                                  placeholder='请输入被保人年龄'
                                  adjustPosition={false}
                                  placeholderClass='placeholder'
                                  onInput={this.handleInput.bind(this, 'insuredAge')}
                                  className='input'
                                ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>被保人职业</View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={this.props.insurance.configJob} rangeKey='rootName' onChange={this.onJobChange.bind(this)} range-key='rootName'>
                                        {
                                            this.state.insuredJob !== '' ? (<Text className='address'>{this.props.insurance.configJob[this.state.insuredJob].rootName}</Text>) : (<Text className='placeholder'>请选择</Text>)
                                        }
                                    </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>被保人有无社保</View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={SocialSecurity} rangeKey='text' onChange={this.onSocialSecurityChange.bind(this)} range-key='text'>
                                    {
                                        this.state.hasSocialSecurity !== '' ? (<Text className='address'>{this.state.hasSocialSecurity === 0 ? '无' : '有'}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                    }
                                </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>投保地区（省市）</View>
                            <View className='right flex'>
                                <Picker mode='multiSelector' className='picker' range={this.props.insurance.provicePickArr} rangeKey='label' onChange={this.onProviceChange.bind(this)} onColumnChange={this.columnChange.bind(this)} range-key='label' value={this.state.multiIndex}>
                                    {
                                        this.state.cityId ? (<Text className='address'>{this.state.city}</Text>) : (<Text className='placeholder address'>请选择</Text>)
                                    }
                                </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>住院津贴保险金</View>
                            <View className='right flex'>
                                <Picker mode='selector' className='picker' range={this.props.insurance.configAllowance} rangeKey='rootName' onChange={this.onAllowanceChange.bind(this)} range-key='rootName'>
                                    {
                                        this.state.allowanceConfigId !== '' ? (<Text className='address'>{this.props.insurance.configAllowance[this.state.allowanceConfigId].rootName}</Text>) : (<Text className='placeholder'>请选择</Text>)
                                    }
                                    </Picker>
                                <Image src={`${ossHost}images/next.png`} className='next'></Image>
                            </View>
                        </View>
                        {!this.isSelf() && (<View className='common-item flex'>
                            <View className='label'>手机号</View>
                            <Input value={insuredMobile}
                              type='number'
                              placeholder='选填'
                              maxlength={11}
                              adjustPosition={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'insuredMobile')}
                              className='input'
                            ></Input>
                        </View>)}
                        {!this.isSelf() && (
                             <View className='common-item flex'>
                             <View className='label'>电子邮箱</View>
                             <Input value={insuredEmail}
                               type='text'
                               placeholder='选填'
                               adjustPosition={false}
                               placeholderClass='placeholder'
                               onInput={this.handleInput.bind(this, 'insuredEmail')}
                               className='input'
                             ></Input>
                         </View>
                        )}

                    </View>
                    <View className='common'>
                        <View className='title flex'>
                            <Text>开票信息</Text>
                            <Text className='tips'>说明：电子发票与纸质发票具有同等效力，可作为报销凭据</Text>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>客户类型</View>
                            <Input value='境内个人' type='text' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>发票类型</View>
                            <Input value='增值税电子普通发票' type='text' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>纳税人类型</View>
                            <Input value='个人' type='text' disabled className='input disable'></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>客户名称</View>
                            <Input value={customerName}
                              type='text'
                              placeholder='选填'
                              adjustPosition={false}
                              placeholderClass='placeholder'
                              onInput={this.handleInput.bind(this, 'customerName')}
                              className='input'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>手机号</View>
                            <Input value={customerMobile} type='number' placeholder='选填'
                              placeholderClass='placeholder'
                              adjustPosition={false}
                              onInput={this.handleInput.bind(this, 'customerMobile')}
                              className='input'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>邮箱</View>
                            <Input value={customerEmail}
                              type='text'
                              adjustPosition={false}
                              placeholder='选填'
                              onInput={this.handleInput.bind(this, 'customerEmail')}
                              placeholderClass='placeholder' className='input'
                            ></Input>
                        </View>
                    </View>
                    <View className='common'>
                        <View className='title flex'>
                            <Text>代理人信息</Text>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>代理人姓名</View>
                            <Input value={agentName} type='text'
                              adjustPosition={false}
                              onInput={this.handleInput.bind(this, 'agentName')}
                              className='input' placeholder='选填'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>代理人手机号</View>
                            <Input value={agentMobile} type='number'
                              adjustPosition={false}
                              onInput={this.handleInput.bind(this, 'agentMobile')}
                              className='input' placeholder='选填'
                            ></Input>
                        </View>
                        <View className='common-item flex'>
                            <View className='label'>所属分公司</View>
                            <Input value={subsidiary} type='text' className='input'
                              adjustPosition={false}
                              onInput={this.handleInput.bind(this, 'subsidiary')}
                              placeholder='选填'
                            ></Input>
                        </View>
                    </View>
                    <View className={`next-btn ${this.watchNext() ? 'active' : ''}`} onClick={
                        this.save.bind(this)
                    }
                    >下一步</View>
                    <View className='record' onClick={() => {
                      Taro.navigateTo({
                        url: '/Insurance/pages/record/index'
                      });
                    }}
                    >
                        <Text>投保记录</Text>
                        <Image src={`${ossHost}images/next_yellow.png`} className='next-y'></Image>
                    </View>
                    </View>
                </ScrollView>
      );
    }
}
export default Create;
