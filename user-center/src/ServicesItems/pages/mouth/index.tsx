import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import utils from '@utils/index';
import { getServiceRecord } from '@actions/serviceItem';
import { GET_SERVICE_RECORD } from '@constants/serviceItem';
import { IStoreProps } from '@reducers/interface';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  getServiceRecord: Function;
}

type PropsType = IStoreProps & IProps;
@connect(
  state => state,
  dispatch => ({
    getServiceRecord (params) {
      getServiceRecord(params).then(res => {
        dispatch({
          type: GET_SERVICE_RECORD,
          payload: res
        });
      });
    }
  })
)
class Mouth extends Component<PropsType> {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    const { router } = getCurrentInstance();
    this.props.getServiceRecord({
      serviceRecordId: router?.params && router.params.serviceRecordId
    });
  }

  render () {
    const { isH5 } = utils.appConfig;
    return (
      <Page showBack title='口腔问诊'>
        <View className='page-mouth flex'>
          <View className='mouth-content'>
            <View className='mouth-title-border'>
              <Text className='mouth-title-text'>微信扫码进行问诊</Text>
            </View>
            <Image
              className='mouth-docter'
              src={`${ossHost}mouth-docter.png`}
            ></Image>
            <Image
              className='mouth-code'
              src={`${ossHost}miaodi.png`}
            ></Image>
          </View>
          <View className='tip'>-请及时保存二维码，返回即为权益已使用-</View>
          {
            isH5
              ? (
            <View className='tips-h5'>长按保存图片</View>
                )
              : (
            <View
              className='save-image flex'
              onClick={() => {
                Taro.downloadFile({
                  url: `${ossHost}miaodi.png`,
                  success: res => {
                    Taro.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath, // 返回的临时文件路径，下载后的文件会存储到一个临时文件
                      success: () => {
                        Taro.showToast({
                          title: '成功保存到相册',
                          icon: 'none'
                        });
                      }
                    });
                  }
                });
              }}
            >
              点击保存
            </View>
                )}
        </View>
      </Page>
    );
  }
}
export default Mouth;
