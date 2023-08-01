import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Page from '@components/page';
import { getInsuranceResult } from '@actions/insurance';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IState {
    info: any;
    type: number | string;
}
const shipList = [{
  value: 1,
  rootName: '本人'
},
{
  value: 2,
  rootName: '配偶'
},
{
  value: 3,
  rootName: '父母'
}, {
  value: 4,
  rootName: '子女'
}];
class Detail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      info: {},
      type: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    getInsuranceResult({
      id: router?.params && router.params.id,
      type: Number(router?.params && router.params.type)
    }).then(res => {
      this.setState({
        info: res,
        type: Number(router?.params && router.params.type)
      });
    });
  }

  render () {
    const { router } = getCurrentInstance();
    const { type } = this.state;
    const { plan, state, createTime, startDate, reviewdReason, successReviewRemark, addPrice, num, people, insuredUnit, insuranceTime, premiumPrice, beneficiaryList } = this.state.info;
    const { policyHolderCodeNumber, relationship, numberOfInsured, insuredFileList, insuredJob } = people || {};
    return (
            <Page title='核保结果' showBack>
                <View className='page-detail'>
                    <View className='top flex'>
                        <Image src={`${ossHost}images/type_2.png`} className='success'></Image>
                        {
                            state === 0 ? <Text className='tips'>{(type === 2 && num === 0) ? '待被保险人名单上传成功后，将为您进行保费报价！' : '等待核保，请耐心等待结果'}</Text> : null
                        }
                        {
                            state === 1 ? <Text className='tips'>正常可投保</Text> : null
                        }
                        {
                            state === 3 ? <Text className='tips'>加费可投保</Text> : null
                        }
                        {
                            state === 2 ? <Text className='tips'>不可投保</Text> : null
                        }
                        {
                            state === 4 ? <Text className='tips'>除外可投保</Text> : null
                        }

                        {(successReviewRemark || reviewdReason)
                          ? <View className='reason'
                              style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis'
                              }}
                          >原因：{successReviewRemark || reviewdReason}</View>
                          : null}
                        <View className='money-content flex'>
                            <Text className='money'>保费报价：{premiumPrice ? `${premiumPrice + Number(addPrice)}元` : '-'}</Text>
                            {addPrice ? <Text className='add-money'>{addPrice}</Text> : null}
                        </View>

                        {(type === 2 && num === 0) && <Text className='url'>上传名单网址：http：xxxxxxx.com <Text className='copy' onClick={
                            () => {
                              let env = '';
                              utils.appConfig.env === 'dev' && (env = '.dev');
                              utils.appConfig.env === 'test' && (env = '.test');
                              const url = `https://risk-mange${env}.g-hcare.com/#/uploadGroupList/${router?.params && router.params.id}?mobile=${insuredUnit.contactMobile}`;
                              Taro.setClipboardData({
                                data: url,
                                success: function (res) {
                                }
                              });
                            }
                        }
                        >复制</Text></Text>}
                    </View>
                    <View className='center'>
                        <View className='title'>
                            保障内容
                        </View>
                        {
                            plan && plan.rightsList && plan.rightsList.length && plan.rightsList.map((item) => {
                              return (
                                    <View key={item.name} className='common flex'>
                                        <View className='left'>{item.mainInsurance ? '主险' : '附险'}</View>
                                        <View className='right'>{item.name}</View>
                                    </View>
                              );
                            })
                        }
                        {/* <View className="common flex no-border">
                            <View className="left">意外身故/伤残保障</View>
                            <View className="right">¥100,000</View>
                        </View>
                        <View className="common flex no-border">
                            <View className="left">意外身故/伤残保障</View>
                            <View className="right">¥100,000</View>
                        </View>
                        <View className="common flex">
                            <View className="left">意外医疗（门诊/急症/住院）</View>
                            <View className="right">¥20,000</View>
                        </View>
                        <View className="common flex">
                            <View className="left">意外住院津贴</View>
                            <View className="right">¥50元/天</View>
                        </View> */}
                        {/* <View className="common flex">
                            <View className="left">保费/人</View>
                            <View className="right">¥190元/年</View>
                        </View>
                        <View className="sub-title">保额</View>
                        <View className="common flex no-border">
                            <View className="left">法定传染病身故保险<Text className='tips'>（包括甲乙丙类，等待期10天）</Text></View>
                        </View>
                        <View className="common-bottom">50，000</View>
                        <View className="common flex">
                            <View className="left">保费/人</View>
                            <View className="right">55元/年</View>
                        </View> */}
                        <View className='common flex'>
                            <View className='left'>服务周期</View>
                            <View className='right'>{insuranceTime}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>申请时间</View>
                            <View className='right'>{utils.timeFormat(createTime, 'y/m/d h:m:s')}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>起保日期</View>
                            <View className='right'>{utils.timeFormat(startDate, 'y/m/d')}</View>
                        </View>

                        {type === 2
                          ? <View className='common flex'>
                            <View className='left'>投保人数</View>
                            <View className='right'>{num || '-'}</View>
                        </View>
                          : null}
                    </View>
                    {
                        type === 1
                          ? <View className='center'>
                        <View className='title'>
                            投保人
                        </View>
                        <View className='common flex no-border'>
                            <View className='left'>姓名</View>
                            <View className='right'>{people.policyHolderName}</View>
                        </View>

                        <View className='common flex'>
                            <View className='left'>证件号码</View>
                            <View className='right'>{policyHolderCodeNumber}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>手机号</View>
                            <View className='right'>{people.policyHolderMobile}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>电子邮箱</View>
                            <View className='right'>{people.policyHolderEmail || '-'}</View>
                        </View>
                    </View>
                          : null
                    }
                     {
                        type === 1
                          ? <View className='center'>
                        <View className='title'>
                            被保人
                        </View>
                        <View className='common flex no-border'>
                            <View className='left'>姓名</View>
                            <View className='right'>{people.insuredName}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>性别</View>
                            <View className='right'>{people.insuredSex === 1 ? '男' : '女'}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>年龄</View>
                            <View className='right'>{people.insuredAge}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>与投保人关系</View>
                            <View className='right'>{shipList[Number(relationship) - 1].rootName}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>证件类型</View>
                            <View className='right'>{people.insuredCertificateType === 1 ? '身份证' : '护照'}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>证件号码</View>
                            <View className='right'>{people.insuredCodeNumber}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>手机号</View>
                            <View className='right'>{people.insuredHolderMobile}</View>
                        </View>
                        {
                            (insuredFileList && insuredFileList.length)
                              ? insuredFileList.map((item) => {
                                return <View className='common-img' key={item.type}>
                                <View className='common-img-title'>{item.name}</View>
                                <View className='common-img-list flex'>
                                    {
                                        (item.imgUrls && item.imgUrls.length)
                                          ? item.imgUrls.map((aItem) => {
                                            return <Image key={aItem} className='img' src={aItem}></Image>;
                                          })
                                          : null
                                    }
                                </View>
                            </View>;
                              })
                              : null
                        }

                        <View className='common flex'>
                            <View className='left'>有无社保</View>
                            <View className='right'>{people.hasSocialSecurity ? '有' : '无'}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>投保地区</View>
                            <View className='right'>{people.province}{people.city}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>通讯地址</View>
                            <View className='right'>{people.insuredMailingAddress}</View>
                        </View>

                        <View className='common flex'>
                            <View className='left'>电子邮箱</View>
                            <View className='right'>{people.insuredHolderEmail || '-'}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>职业</View>
                            <View className='right'>{insuredJob || '-'}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>投保份数</View>
                            <View className='right'>{numberOfInsured || '-'}</View>
                        </View>
                    </View>
                          : null
                    }
                    {
                        (type === 1 && beneficiaryList && beneficiaryList.length)
                          ? beneficiaryList.map((item, index) => {
                            return <View className='center' key={index}>
                            <View className='title'>
                                受益人{index + 1}
                            </View>
                            <View className='common flex no-border'>
                                <View className='left'>姓名</View>
                                <View className='right'>{item.beneficiaryName}</View>
                            </View>
                            <View className='common flex'>
                                <View className='left'>与被保人关系</View>
                                <View className='right'>{shipList[Number(item.relationship - 1)].rootName}</View>
                            </View>
                            <View className='common flex'>
                                <View className='left'>证件类型</View>
                                <View className='right'>{item.beneficiaryCertificateType === 1 ? '身份证' : '护照'}</View>
                            </View>
                            <View className='common flex'>
                                <View className='left'>证件号码</View>
                                <View className='right'>{item.beneficiaryCodeNumber}</View>
                            </View>

                            <View className='common flex'>
                                <View className='left'>手机号</View>
                                <View className='right'>{item.beneficiaryMobile}</View>
                            </View>
                            <View className='common flex'>
                                <View className='left'>受益比例(%)</View>
                                <View className='right'>{item.benefitRatio}</View>
                            </View>
                        </View>;
                          })
                          : null
                    }
                    {
                        type === 2
                          ? <View className='center'>
                        <View className='title'>
                            投保人
                        </View>
                        <View className='common flex no-border'>
                            <View className='left'>企业名称</View>
                            <View className='right'>{insuredUnit.companyName}</View>
                        </View>

                        <View className='common flex'>
                            <View className='left'>联系人</View>
                            <View className='right'>{insuredUnit.contactName}</View>
                        </View>
                        <View className='common flex'>
                            <View className='left'>联系人电子邮箱</View>
                            <View className='right'>{insuredUnit.contactEmail || '-'}</View>
                        </View>
                    </View>
                          : null
                    }

                </View>
            </Page>
    );
  }
}
export default Detail;
