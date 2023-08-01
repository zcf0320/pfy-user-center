import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, RichText } from '@tarojs/components';
import utils from '@utils/index';
import EmptyBox from '@components/emptyBox';
import { getInsuranceInfo } from '@actions/insurance';
import { GET_INSURANCE_INFO } from '@constants/insurance';
import { IStoreProps } from '@reducers/interface';
import ServiceModal from './serviceModal';
import PlanTab from './planTab';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
    getInfo: Function;
}
interface IState {
  id:string;
    postStatus: number;
    selectPlanIndex: number;
    productInfo: any;
    nodes: string;
    selectDetailIndex: number;
    // agree: boolean;
    showServiceModal: boolean;
}
type PropsType = IStoreProps & IProps
@connect(state => state, dispatch => ({
  getInfo (params) {
    return new Promise((resolve) => {
      getInsuranceInfo(params).then(res => {
        const { guaranteePlan, serviceDetail, productFeature } = res;
        guaranteePlan && res.guaranteePlan.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        serviceDetail && res.serviceDetail.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        productFeature && res.productFeature.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        // let plan = []
        // for(var i = 0 ; i< 2; i++){
        //     plan.push(res.plans[0])
        // }
        // res.plans = plan
        dispatch({
          type: GET_INSURANCE_INFO,
          payload: res
        });
        resolve(res);
      });
    });
  }
}))
class Introduce extends Component<PropsType, IState> {
  constructor (props) {
    super(props);
    this.state = {
      id: '',
      postStatus: 3,
      // 选择的计划index
      selectPlanIndex: 0,
      // 选择的介绍index
      selectDetailIndex: 0,
      // 保险详情
      productInfo: {},
      // 富文本介绍
      nodes: '',
      // agree: false,
      showServiceModal: false
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    if (router?.params && router.params.id) {
      this.props.getInfo({
        insuranceProductId: router.params.id
      }).then(res => {
        const { postStatus } = res;
        this.setState({
          id: router.params.id!,
          productInfo: res,
          postStatus,
          nodes: res.productFeature
        });
      }).catch(() => {

      });
    }
  }

  changeTab (index) {
    const { selectDetailIndex, productInfo } = this.state;
    const { guaranteePlan, serviceDetail, productFeature } = productInfo;
    // 相同的不需要
    if (selectDetailIndex === index) {
      return;
    }
    let nodes = productFeature;
    index === 1 && (nodes = guaranteePlan);
    index === 2 && (nodes = serviceDetail);
    this.setState({
      selectDetailIndex: index,
      nodes: nodes || ''
    });
  }

  getPlanIndex (value) {
    const { selectPlanIndex } = this.state;
    if (selectPlanIndex === value) {
      return;
    }
    this.setState({
      selectPlanIndex: value
    });
  }

  // 根据状态获取文案
  getStatusText (value) {
    let text = '';
    value === 0 && (text = '立即投保');
    value === 1 && (text = '已下架');
    value === 2 && (text = '暂未销售');
    return text;
  }

  render () {
    const { productInfo, selectPlanIndex, selectDetailIndex, nodes, postStatus, showServiceModal, id } = this.state;
    const { productHeaderImage, insuranceProductName, plans, type, rule, suitJob, suitAge, insuranceTime } = productInfo;
    const { healthNotice } = rule || {};
    return (
            <View className='page-detail flex'>
                {
                    (postStatus === 0 || postStatus === 1)
                      ? (
                        <View className='content'>
                            <Image className='top' mode='widthFix' src={productHeaderImage}></Image>
                            <View className='name flex'>{insuranceProductName}</View>
                            <View className='plan'>
                                <View className='common title flex'>
                                    <Text>保障计划</Text>
                                    <Text className='plan-detail' onClick={
                                        () => {
                                          Taro.navigateTo({
                                            url: `/Insurance/pages/planDetail/index?id=${id}&planId=${plans[selectPlanIndex].planId}`
                                          });
                                        }
                                    }
                                    >查看详情</Text>
                                </View>
                                <View className='plan-select flex'>

                                    {
                                        plans && plans.length > 1 ? <PlanTab plans={plans} getPlanIndex={this.getPlanIndex.bind(this)}></PlanTab> : null
                                    }
                                </View>
                                {
                                    plans && plans.length && plans[selectPlanIndex].rightsList.length && plans[selectPlanIndex].rightsList.map((item) => {
                                      return <View className='common flex' key={item.name}>
                                            <View className='label'>{item.mainInsurance ? '主险' : '附险'}</View>
                                            <View className='text'>{item.name}</View>
                                        </View>;
                                    })
                                }
                                {
                                    suitJob
                                      ? <View className='common flex'>
                                        <View className='label'>承保职业</View>
                                        <View className='text'>
                                            <Text>{suitJob}</Text>
                                            <Text className='query-job' onClick={() => {
                                              Taro.navigateTo({
                                                url: '/pages/webview/index?url=https://user-center-insurance-1301127519.cos.ap-shanghai.myqcloud.com/%E8%81%8C%E4%B8%9A%E7%B1%BB%E5%88%AB%E8%A1%A8.pdf&q-sign-algorithm=sha1&q-ak=AKIDMyJNBigOXPcZHm8yf5D7lAOLHxMbIIl2&q-sign-time=1600244030;1915604030&q-key-time=1600244030;1915604030&q-header-list=&q-url-param-list=&q-signature=69b2504d1b22162c018865002b35f9e7615abedf'
                                              });
                                            }}
                                            >查询职业类别</Text>
                                        </View>
                                    </View>
                                      : null
                                }
                                {
                                    suitAge
                                      ? <View className='common flex '>
                                        <View className='label'>投保年龄</View>
                                        <View className='text'>
                                            {suitAge}
                                        </View>
                                    </View>
                                      : null
                                }
                                {
                                    insuranceTime
                                      ? <View className='common flex'>
                                        <View className='label'>保障期限</View>
                                        <View className='text'>
                                            {insuranceTime}
                                        </View>
                                    </View>
                                      : null
                                }
                                {
                                    (plans && plans.length && plans[selectPlanIndex].serviceInfoNames.length)
                                      ? <View className='common flex' onClick={() => {
                                        this.setState({ showServiceModal: true });
                                      }}
                                      >
                                        <View className='label'>增值服务</View>
                                        <View className='right flex'>
                                            <View className='service-info'>{
                                                plans[selectPlanIndex].serviceInfoNames.map((item, index) => {
                                                  return `${index === 0 ? '' : '、'}${item}`;
                                                })
                                            }</View>
                                            <Image src={`${ossHost}images/next.png`} className='next'></Image>
                                        </View>
                                    </View>
                                      : null
                                }
                                {
                                    showServiceModal && <ServiceModal serviceInfoNames={plans[selectPlanIndex].serviceInfoNames} closeModal={() => {
                                      this.setState({ showServiceModal: false });
                                    }}
                                    />
                                }

                            </View>
                            <View className='product-tab flex'>
                                <View className='product-item flex' onClick={() => {
                                  this.changeTab(0);
                                }}
                                >
                                    <View className={`text flex ${selectDetailIndex === 0 ? 'active' : ''}`} >产品详情</View>
                                </View>
                                <View className='product-item flex' onClick={() => {
                                  this.changeTab(1);
                                }}
                                >
                                    <View className={`text flex ${selectDetailIndex === 1 ? 'active' : ''}`}>保障方案</View>
                                </View>
                                <View className='product-item flex' onClick={() => {
                                  this.changeTab(2);
                                }}
                                >
                                    <View className={`text flex ${selectDetailIndex === 2 ? 'active' : ''}`}>服务详情</View>
                                </View>
                            </View>
                            <View className='detail flex'>
                                {nodes ? <RichText nodes={nodes} /> : <EmptyBox title='暂无'></EmptyBox>}
                            </View>
                        </View>
                        )
                      : null
                }
                {
                    (postStatus === 0 || postStatus === 1)
                      ? <View className='footer-content'>

                        <View className='footer flex'>

                        <View className='footer-left flex'>
                            <Text className='money'>¥{plans && plans.length && plans[selectPlanIndex].minPrice}</Text>

                        </View>
                        <View className={`footer-right flex ${postStatus !== 0 ? 'disable' : ''} `} onClick={
                            () => {
                              if (postStatus !== 0) {
                                return;
                              }
                              let url = '';
                              type === 1 && (url = `/Insurance/pages/create/index?selectPlanIndex=${selectPlanIndex}&id=${id}`);
                              type === 2 && (url = `/Insurance/pages/group/create/index?selectPlanIndex=${selectPlanIndex}&id=${id}`);
                              if (healthNotice && type === 2) {
                                url = `/Insurance/pages/notify/index?selectPlanIndex=${selectPlanIndex}&id=${id}`;
                              }
                              Taro.navigateTo({
                                url
                              });
                            }
                        }
                        >{this.getStatusText(postStatus)}</View>
                    </View>
                    </View>
                      : null
                }

            </View>
    );
  }
}
export default Introduce;
