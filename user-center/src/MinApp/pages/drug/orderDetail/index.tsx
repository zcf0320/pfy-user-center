import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import i18n from '@i18n/index';
import { orderDetail, submitInternetHospital, cancelOrder } from '@actions/minApp';
import PreviewImage from '@components/previewImage';
import utils from '@utils/index';
import './index.scss';

interface IState {
  previewList: Array<string>;
  current: number;
  orderDetail: any;
  id:any;
  show:boolean;
  scrollIntoView:string;
}
const { ossHost } = utils.appConfig;
let dataPolling;
class OrderDetail extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      previewList: [],
      current: 0,
      orderDetail: {},
      id: '',
      show: false,
      scrollIntoView: ''
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: i18n.chain.drug.orderDetail
    });
  }

  componentWillUnmount () {
    clearInterval(dataPolling);
    dataPolling = null;
  }

  componentDidShow () {
    const { router } = getCurrentInstance();
    this.setState({
      id: router?.params && router.params.id
    }, () => {
      this.getOrderDetail();
    });
  }

  getOrderDetail () {
    orderDetail({
      serialNumber: this.state.id
    }).then((res:any) => {
      if (res.isPolling) {
        dataPolling = setInterval(() => {
          this.getOrderDetail();
        }, 2000);
      }
      this.setState({
        orderDetail: res
      });
    }).catch(() => {

    });
  }

  confirm () {
    const params = {
      serviceRecordId: this.state.orderDetail.serviceRecordId
    };
    submitInternetHospital(params)
      .then((res: any) => {
        this.setState({
          show: false
        }, () => {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${res.url}`
          });
        });
      })
      .catch(() => {});
  }

  handleCancelOrder () {
    cancelOrder(this.state.orderDetail.serviceRecordId).then(() => {
      Taro.redirectTo({
        url: `/MinApp/pages/drug/detailList/index?serviceRecordId=${this.state.orderDetail.serviceRecordId}`
      });
    });
  }

  render () {
    const { show, scrollIntoView } = this.state;
    const orderDetail = this.state.orderDetail.orderInfos;
    const { orderStatus } = this.state.orderDetail;

    const { previewList, current } = this.state;
    const { isH5 } = utils.appConfig;
    return (
      <Page showBack title={i18n.chain.drug.orderDetail}>
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
        <View
          className={`${
            isH5
              ? 'component-order-detail-top'
              : 'component-order-detail-top top-0'
          }`}
        >

                <ScrollView
                  className='scrollview'
                  scrollX
                  enableFlex
                  scrollIntoView={scrollIntoView}
                >
                {orderDetail &&
                  orderDetail.length > 0 &&
                  orderDetail.map((orderItem, index) => {
                    return (
                <View
                  id={`id${orderItem.orderId}`}
                  className={`${
                    current === index
                      ? 'detail-top-item active'
                      : 'detail-top-item'
                  }`}
                  key={`tab${index}`}
                  onClick={() => {
                    this.setState({
                      scrollIntoView: `id${orderItem.orderId}`,
                      current: index
                    });
                  }}
                >
                 {i18n.chain.drug.order}{index + 1}
                </View>
                    );
                  })}
                </ScrollView>

        </View>
        {orderDetail &&
          orderDetail.length > 0 &&
          orderDetail.map((orderItem, index) => {
            return (
              <View key={`商品${index}`}>
                {index === current
                  ? (
                  <View className='component-order-detail flex'>
                    <View className='order-top flex'>
                      <Image
                        src={`${ossHost}order_list.png`}
                        className='order_list'
                      />
                      <View className='status flex'>
                        <Text>
                        {i18n.chain.drug.order}
                          {utils.orderStatus(orderItem.orderState)}
                        </Text>
                        <Text className='reason'>
                          {i18n.chain.drug.orderSubmitted}
                          {utils.timeFormat(
                            orderItem.createTime,
                            'y-m-d h:m:s'
                          )}
                        </Text>
                      </View>
                    </View>
                    {orderItem.remark
                      ? (
                      <View className='cancel flex'>
                        <View className='top flex'>
                          <Text className='label'>{i18n.chain.drug.cancellationReason}</Text>
                          <Text>{orderItem.remark}</Text>
                        </View>
                        <View className='bottom'>
                          {utils.timeFormat(orderItem.cancelTime, 'y-m-d h:m')}
                        </View>
                      </View>
                        )
                      : null}

                    <View className='tips flex'>
                     {i18n.chain.drug.tips}
                    </View>
                    {
                      orderItem.onlineOrOffLine
                        ? <View className='store-order-detail'>
                      <View className='title flex'>
                        <Image
                          src={`${ossHost}order_info.png`}
                          className='icon-image'
                        ></Image>
                        <Text>{i18n.chain.drug.orderInformation}</Text>
                      </View>
                      <View className='common flex'>
                        <Text>{i18n.chain.drug.orderNo}</Text>
                        <Text>{orderItem.orderNo}</Text>
                      </View>
                      <View className='common flex'>
                        <Text>核销时间</Text>
                        <Text>
                          {orderItem.createTime
                            ? utils.timeFormat(
                              orderItem.createTime,
                              'y.m.d h:m:s'
                            )
                            : i18n.chain.drug.notYet}
                        </Text>
                      </View>
                      <View className='common flex'>
                        <Text>门店信息</Text>
                        <Text>
                          {orderItem.offLineName
                            }&nbsp;
                            {orderItem.offLineMobile
                            }
                        </Text>
                      </View>
                    </View>
                        : <View>
                        <View className='logistics'>
                        <View className='top flex'>
                          <Image
                            src={`${ossHost}order_send.png`}
                            className='icon-img'
                          ></Image>
                          <View className='item'>
                            <Text className='label'>{i18n.chain.drug.logisticsCompany}</Text>
                            <Text>{orderItem.logisticsName || i18n.chain.drug.notYet}</Text>
                          </View>
                        </View>
                        <View className='item p-l-48 m-t-16'>
                          <Text className='label'>{i18n.chain.drug.logisticsNo}</Text>
                          <Text>{orderItem.logisticsNo || i18n.chain.drug.notYet}</Text>
                        </View>
                      </View>
                        <View className='addressee'>
                        <View className='top flex'>
                          <Image
                            src={`${ossHost}order_recive.png`}
                            className='icon-img'
                          ></Image>
                          <Text>{i18n.chain.drug.recipientName}{orderItem.receiverName}</Text>
                        </View>
                        <View className='address-detail p-l-48 m-t-16'>
                        {i18n.chain.drug.specificAddress}{orderItem.address}
                        </View>
                      </View>
                        </View>

                    }

                    <View className='drug-info'>
                      <View className='title flex'>
                        <Image
                          src={`${ossHost}drug_order_info.png`}
                          className='icon-image'
                        ></Image>
                        <Text>{i18n.chain.drug.commodityInformation}</Text>
                      </View>
                      {orderItem.medicineProductVOList &&
                        orderItem.medicineProductVOList.length &&
                        orderItem.medicineProductVOList.map(
                          (item, index2: number) => {
                            return (
                              <View className='padd-32' key={`商品${index2}`}>
                                <View className='info flex'>
                                  <Image
                                    className='img'
                                    src={item.headPic && item.headPic[0]}
                                  ></Image>
                                  <View className='right'>
                                    <View className='name'>
                                      {item.brandName} {item.name}
                                      <View className='pro-num'>
                                        x{item.num}
                                      </View>
                                    </View>
                                    <View className='no'>
                                      {item.authorizedCode}
                                    </View>
                                    <View className='type'>
                                      {i18n.chain.drug.dosageForm}{item.dosageForm}
                                    </View>
                                    <View className='type'>
                                      {i18n.chain.drug.specifications}{item.standard}
                                    </View>
                                  </View>
                                </View>
                                {index ===
                                orderItem.medicineProductVOList.length - 1
                                  ? (
                                  <View className='common flex'>
                                    <View className='left'>{i18n.chain.drug.distributionMode}</View>
                                    <View className='right'>
                                      <Text>{i18n.chain.drug.ordinaryExpress}</Text>
                                      <Text className='money'>
                                        ¥{orderItem.postage}
                                      </Text>
                                    </View>
                                  </View>
                                    )
                                  : null}
                              </View>
                            );
                          }
                        )}
                    </View>
                    {orderItem.prescription
                      ? (
                      <View className='prescription-info'>
                        <View className='title flex'>
                          <Image
                            src={`${ossHost}order_otc.png`}
                            className='icon-image'
                          ></Image>
                          <Text>{i18n.chain.drug.prescriptionInformation}</Text>
                        </View>
                        <View className='common flex'>
                          <View className='left'>{i18n.chain.drug.drugUser}</View>
                          <View className='right'>
                            {orderItem.prescription.drugUser}
                          </View>
                        </View>
                        <View className='common flex'>
                          <View className='left'>{i18n.chain.drug.prescriptionStatus}</View>
                          <View className='right'>
                            {orderItem.prescription.prescriptionStatus}
                          </View>
                        </View>
                        {orderItem.prescription.prescriptionImgUrl
                          ? (
                          <View className='paper flex'>
                            <Text>{i18n.chain.drug.viewPrescription}</Text>
                            <Image
                              className='paper-img'
                              src={orderItem.prescription.prescriptionImgUrl}
                              onClick={() => {
                                this.setState({
                                  previewList: [
                                    orderItem.prescription.prescriptionImgUrl
                                  ]
                                });
                              }}
                            ></Image>
                          </View>
                            )
                          : null}

                        <View
                          className='paper flex'
                          onClick={() => {
                            if (
                              orderItem.prescription.imgs &&
                              orderItem.prescription.imgs.length
                            ) {
                              this.setState({
                                previewList: orderItem.prescription.imgs
                              });
                            }
                          }}
                        >
                          <Text>{i18n.chain.drug.viewAttachments}</Text>
                          <Text
                            className={`${
                              orderItem.prescription.imgs &&
                              orderItem.prescription.imgs.length
                                ? 'active'
                                : 'open'
                            }`}
                          >
                            {orderItem.prescription.imgs &&
                            orderItem.prescription.imgs.length
                              ? i18n.chain.drug.seeFile
                              : i18n.chain.drug.notYet}
                          </Text>
                        </View>
                      </View>
                        )
                      : null}
                        {
                          orderItem.onlineOrOffLine !== 1 && <View className='order-detail'>
                          <View className='title flex'>
                            <Image
                              src={`${ossHost}order_info.png`}
                              className='icon-image'
                            ></Image>
                            <Text>{i18n.chain.drug.orderInformation}</Text>
                          </View>
                          <View className='common flex'>
                            <Text>{i18n.chain.drug.orderNo}</Text>
                            <Text>{orderItem.orderNo}</Text>
                          </View>
                          <View className='common flex'>
                            <Text>{i18n.chain.drug.creationTime}</Text>
                            <Text>
                              {orderItem.createTime
                                ? utils.timeFormat(
                                  orderItem.createTime,
                                  'y.m.d h:m:s'
                                )
                                : i18n.chain.drug.notYet}
                            </Text>
                          </View>
                          <View className='common flex'>
                            <Text>{i18n.chain.drug.deliveryTime}</Text>
                            <Text>
                              {orderItem.deliveryTime
                                ? utils.timeFormat(
                                  orderItem.deliveryTime,
                                  'y.m.d h:m:s'
                                )
                                : i18n.chain.drug.notYet}
                            </Text>
                          </View>
                          <View className='common flex'>
                            <Text>{i18n.chain.drug.completionTime}</Text>
                            <Text>
                              {orderItem.completeTime
                                ? utils.timeFormat(
                                  orderItem.completeTime,
                                  'y.m.d h:m:s'
                                )
                                : i18n.chain.drug.notYet}
                            </Text>
                          </View>
                        </View>
                      }

                    {(orderStatus === 5 && orderItem.orderState === 5)
                      ? (
                      <View
                        className='confirm flex'
                        onClick={() => {
                          Taro.redirectTo({
                            url: `/MinApp/pages/drug/detailList/index?serviceRecordId=${orderItem.serviceRecordId}`
                          });
                        }}
                      >
                        {i18n.chain.button.resubmit}
                      </View>
                        )
                      : null}
                  </View>
                    )
                  : null}
                  {
                    orderStatus === 6
                      ? <View className='footer-btn'>
                    <View
                      className='cancel'
                      onClick={() => {
                        this.handleCancelOrder();
                      }}
                    >
                    取消订单
                  </View>
                    <View
                      className='continue'
                      onClick={() => {
                        this.setState({
                          show: true
                        });
                      }}
                    >继续问诊

                  </View>
                    </View>
                      : null
                  }
                  {show
                    ? (
                    <View className='confirm-modal'>
                      <View className='confirm-modal-content'>
                        <View className='title'>提示</View>
                        <View className='sub-title'>为了您的用药安全，线上医师将为您提供问诊开方服务。请确认本次兑换药品，提交问诊后该订单药品不可修改。</View>
                        <View className='desc'>*医师问诊需过程约3-5分钟，请勿关闭页面，耐心等待</View>
                        <View className='bottom-btn'>
                        <View className='cancel' onClick={() => { this.setState({ show: false }); }}>取消</View>
                        <View className='confirm' onClick={() => { this.confirm(); }}>确认</View>
                        </View>
                      </View>
                    </View>
                      )
                    : null}
              </View>
            );
          })}
      </Page>
    );
  }
}
export default OrderDetail;
