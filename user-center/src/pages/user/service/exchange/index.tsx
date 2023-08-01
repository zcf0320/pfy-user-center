import Taro from '@tarojs/taro';
import { View, Input, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import i18n from '@i18n/index';
import { serviceExchange } from '@actions/user';
import { connect } from 'react-redux';
import utils from '@utils/index';
import Page from '@components/page';
import SelectModal from '@components/selectModal';
import { addService } from '@actions/service';
import { SET_MODAL } from '@constants/common';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  setModal: Function;
}
interface IState {
  type: number;
  code: string;
  isFocus: boolean;
  clear: boolean;
  showExchangeModal: boolean;
  list: any;
  selectNum: number;
  isLoading: boolean;
}
@connect(
  state => state.user,
  dispatch => ({
    setModal (data) {
      dispatch({
        type: SET_MODAL,
        payload: data
      });
    }
  })
)
class ServiceExchange extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      type: 1,
      code: '',

      isFocus: false,
      clear: false,
      showExchangeModal: false,
      list: [],
      selectNum: 0,
      isLoading: false
    };
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: i18n.chain.homepage.serviceExchangeInfo
    });
  }

  // 切换
  changeTab (type) {
    this.setState({
      type,
      code: ''
    });
  }

  handleInput (value) {
    if (!this.state.clear) {
      this.setState({
        code: value.detail.value
      });
    }
  }

  handleFocus () {
    this.setState({
      isFocus: true,
      clear: false
    });
  }

  handleBlur () {
    setTimeout(() => {
      this.setState({
        isFocus: false
      });
    }, 500);
  }

  clear () {
    this.setState({
      code: '',
      clear: true
    });
  }

  // 显示弹框
  showModal (text) {
    const vm = this;
    this.props.setModal({
      show: true,
      content: text,
      cancelText: '继续兑换',
      confirmText: '查看服务',
      clickCancel: () => {
        vm.setState({
          code: ''
        });
      },
      clickConfirm: () => {
        Taro.navigateTo({
          url: '/pages/user/service/list/index'
        });
      }
    });
    // Taro.showModal({
    //     title: '',
    //     content: text,
    //     cancelColor: '#9D9FA2',
    //     confirmColor: '#FE9A51',
    //     confirmText: '查看服务',
    //     cancelText: '继续兑换',
    //     success: function (res) {
    //         if (res.confirm) {
    //             Taro.navigateTo({
    //                 url: '/pages/user/service/list/index'
    //             })
    //         }  else if (res.cancel) {
    //             vm.setState({
    //                 code: ''
    //             })
    //         }
    //       }

    // })
  }

  //  兑换
  async exChange () {
    const { type, code, isLoading } = this.state;
    if (!code || isLoading) {
      return;
    }
    const params = {
      code,
      type
    };
    this.setState({
      isLoading: true
    });
    try {
      const res: any = await serviceExchange(params);
      const { list, selectNum } = res;
      if (list && list.length > 1) {
        this.setState({
          showExchangeModal: true,
          list,
          selectNum
        });
        return;
      }
      if (list && list.length === 1) {
        const serviceInfoIdList: any = [];
        const serviceInfoGroupIdList: any = [];
        let toastText = '';
        list.forEach((item: any) => {
          if (item.serviceType) {
            serviceInfoGroupIdList.push(item.serviceInfoId);
          } else {
            serviceInfoIdList.push(item.serviceInfoId);
          }
          toastText += `${toastText.length ? '、' : ''}${item.serviceInfoName}`;
        });
        const param = {
          code,
          type,
          packageId: list[0].servicePackageId,
          serviceInfoIdList,
          serviceInfoGroupIdList
        };
        addService(param).then(() => {
          this.setState({
            showExchangeModal: false
          });
          this.showModal(`您已兑换${toastText}`);
        });
      }
      this.setState(
        {
          isLoading: false
        },
        () => {
          this.props.setModal({
            show: true,
            content: `您的${type === 1 ? '激活码' : '保单'}兑换成功`,
            cancelText: '取消',
            confirmText: '立即查看',
            clickConfirm: () => {
              Taro.navigateTo({
                url: `${
                  type === 1
                    ? '/pages/user/service/list/index'
                    : '/Insurance/pages/manage/index'
                }`
              });
            }
          });
        }
      );
      // vm.showModal('您已兑换成功')
    } catch (error) {
      if (error.code === 40004) {
        this.props.setModal({
          show: true,
          content: '您还未进行实名认证，无法查询到您的保单信息',
          confirmText: '去认证',
          showCancel: false,
          clickConfirm: () => {
            Taro.navigateTo({
              url: '/setting/inputInfo/index'
            });
          }
        });
      }
      this.setState({
        isLoading: false
      });
    }

    // this.props.serviceExchange(params).then((res) => {
    //     const { list, selectNum } = res
    //     console.log(res)
    //     if(list && list.length) {
    //         this.setState({
    //             showExchangeModal: true,
    //             list,
    //             selectNum
    //         })
    //         return
    //     }
    //     vm.showModal('您已兑换成功')

    // })
  }

  // 关闭弹窗
  closeModal (list) {
    const { code, type } = this.state;
    const serviceInfoIdList: any = [];
    const serviceInfoGroupIdList: any = [];
    let toastText = '';
    list.forEach((item: any) => {
      if (item.select) {
        if (item.serviceType) {
          serviceInfoGroupIdList.push(item.serviceInfoId);
        } else {
          serviceInfoIdList.push(item.serviceInfoId);
        }
        toastText += `${toastText.length ? '、' : ''}${item.serviceInfoName}`;
      }
    });
    const params = {
      code,
      type,
      packageId: list[0].servicePackageId,
      serviceInfoIdList,
      serviceInfoGroupIdList
    };
    addService(params).then(() => {
      this.setState({
        showExchangeModal: false
      });
      this.showModal(`您已选择${toastText}`);
    });
  }

  // 去兑换记录
  goRecords () {
    Taro.navigateTo({
      url: '/pages/user/service/record/index'
    });
  }

  render () {
    const { showExchangeModal, list, selectNum, type } = this.state;
    return (
      <Page showBack title={i18n.chain.homepage.serviceExchangeInfo}>
        {showExchangeModal && (
          <SelectModal
            confirm={this.closeModal.bind(this)}
            list={list}
            selectNum={selectNum}
          />
        )}
        <View className='page-service-exchange flex'>

            <View className='title-content flex'>
              <View
                className={`title-item ${
                  this.state.type === 1 ? 'active' : ''
                }`}
                onClick={this.changeTab.bind(this, 1)}
              >
                {i18n.chain.myServicePage.activationCode}
              </View>
              <View
                className={`title-item ${
                  this.state.type === 2 ? 'active' : ''
                }`}
                onClick={this.changeTab.bind(this, 2)}
              >
                {i18n.chain.myServicePage.policyNo}
              </View>

          </View>
          <View className='content flex'>
            <View className='input-content flex'>
              <Input
                className='input'
                placeholder={
                  this.state.type === 1
                    ? i18n.chain.myServicePage.activationCodePlaceholder
                    : i18n.chain.myServicePage.policyNoPlaceholder
                }
                placeholderClass='placeholder'
                value={this.state.code}
                onInput={this.handleInput.bind(this)}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
              ></Input>
              {this.state.isFocus
                ? (
                <Image
                  src={`${ossHost}images/close.png`}
                  className='close'
                  onClick={this.clear.bind(this)}
                ></Image>
                  )
                : null}
            </View>
            <View
              className={`use flex ${this.state.code ? '' : 'disable'}`}
              onClick={this.exChange.bind(this)}
            >
              {i18n.chain.serviceComponent.confirmUse}
            </View>
            <View className='records flex' onClick={this.goRecords.bind(this)}>
              <Text>{i18n.chain.myServicePage.exchangeRecord}</Text>
              <Image src={`${ossHost}images/next_yellow.png`} className='next'></Image>
            </View>
          </View>
          {type === 1
            ? (
            <View
              className={`bottom line-img ${
                i18n.getLocaleName() === 'zh' ? '' : 'en'
              }`}
            ></View>
              )
            : (
            <View
              className={`bottom policy ${
                i18n.getLocaleName() === 'zh' ? '' : 'en'
              }`}
            ></View>
              )}
        </View>
      </Page>
    );
  }
}
export default ServiceExchange;
