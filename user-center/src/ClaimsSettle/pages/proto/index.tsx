import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { getProtocol } from '@actions/claimsSettle';
import { connect } from 'react-redux';
import './index.scss';

interface IProps {
  signUrl: string;
  saveSignUrl: Array<string>;
}
interface IState {
  protocol: any;
  serviceRecordId: string;
  serviceInfoId: string;
  insuranceProductId: string;
  rightsId: string;
  policyNo: string;
  insurancePlanId: string;
}
@connect(state => state.claimsSettle)
class Proto extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      protocol: {},
      serviceRecordId: '',
      serviceInfoId: '',
      insuranceProductId: '',
      rightsId: '',
      policyNo: '',
      insurancePlanId: ''
    };
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.setState({
      serviceRecordId: (router?.params && router.params.serviceRecordId) || '',
      serviceInfoId: (router?.params && router.params.serviceInfoId) || '',
      insuranceProductId:
        (router?.params && router.params.insuranceProductId) || '',
      rightsId: (router?.params && router.params.rightsId) || '',
      policyNo: (router?.params && router.params.policyNo) || '',
      insurancePlanId: (router?.params && router.params.insurancePlanId) || ''
    });
    getProtocol({
      serviceInfoId: (router?.params && router.params.serviceInfoId) || '',
      insuranceProductId:
        (router?.params && router.params.insuranceProductId) || '',
      rightId: (router?.params && router.params.rightsId) || ''
    }).then(res => {
      this.setState({
        protocol: res
      });
    });
  }

  previewImg (url) {
    Taro.previewImage({
      urls: [url]
    });
  }

  renderList () {
    const { protocol } = this.state;
    if (protocol.fileVos && protocol.fileVos.length > 0) {
      return protocol.fileVos.map((item, index) => {
        return (
          <View key={item.url} className='img-wrap'>
            <Image
              className='img-item'
              mode='widthFix'
              src={item.url}
              onClick={() => {
                this.previewImg(item.url);
              }}
            ></Image>
            <Text className='page-code'>
              {index + 1}/{protocol.fileVos.length}
            </Text>
          </View>
        );
      });
    }
  }

  render () {
    const {
      protocol,
      serviceRecordId,
      serviceInfoId,
      insuranceProductId,
      rightsId,
      policyNo,
      insurancePlanId
    } = this.state;
    return (
      <Page title='保险协议' showBack>
        <View className='page-proto'>
          {this.props.saveSignUrl.length > 0
            ? (
            <View>
              {this.props.saveSignUrl.map((item, index) => {
                return (
                  <View key={item} className='img-wrap'>
                    <Image
                      className='img-item'
                      mode='widthFix'
                      src={item}
                      onClick={() => {
                        this.previewImg(item);
                      }}
                    ></Image>
                    <Text className='page-code'>
                      {index + 1}/{this.props.saveSignUrl.length}
                    </Text>
                  </View>
                );
              })}
              <View
                className='agree flex'
                onClick={() => {
                  Taro.redirectTo({
                    url: `/ClaimsSettle/pages/step/index?serviceRecordId=${serviceRecordId}&productReviewConfigId=${protocol.productReviewConfigId}&insuranceProductId=${insuranceProductId}&rightsId=${rightsId}&serviceInfoId=${serviceInfoId}&insurancePlanId=${insurancePlanId}&policyNo=${policyNo}`
                  });
                }}
              >
                我已知晓并同意
              </View>
            </View>
              )
            : (
            <View>
              {this.renderList()}
              <View
                className='agree flex'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/ClaimsSettle/pages/word/index?serviceRecordId=${serviceRecordId}&productReviewConfigId=${protocol.productReviewConfigId}`
                  });
                }}
              >
                立即签名
              </View>
            </View>
              )}
        </View>
      </Page>
    );
  }
}
export default Proto;
