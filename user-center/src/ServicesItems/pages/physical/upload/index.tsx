import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import {
  SAVE_INFO,
  SET_UNION_LIST,
  SET_VALUE_LIST
} from '@constants/serviceItem';
import { upload } from '@actions/common';
import { commit, commitData } from '@actions/serviceItem';
import './index.scss';

interface IProps {
  unionList: Array<any>;
  saveInfo: any;
  valueList: Array<any>;
  onSetInfo: Function;
  onSetUnionList: Function;
  onSetValueList: Function;
}
@connect(
  state => state.serviceItem,
  dispatch => ({
    onSetInfo (data) {
      dispatch({
        type: SAVE_INFO,
        payload: data
      });
    },
    onSetUnionList (data) {
      dispatch({
        type: SET_UNION_LIST,
        payload: data
      });
    },
    onSetValueList (data) {
      dispatch({
        type: SET_VALUE_LIST,
        payload: data
      });
    }
  })
)
class PhysicalIndexUpload extends Component<IProps> {
  delImage = (type, index, iIndex = 0) => {
    const { unionList, saveInfo } = this.props;
    if (type === 1) {
      unionList.splice(index, 1);
      console.log(unionList);
      this.props.onSetUnionList([...unionList]);
    } else {
      saveInfo.localImageList[index].imgUrls.splice(iIndex, 1);

      // saveInfo.localImageList[index].imgUrls = [...saveInfo.localImageList[index].imgUrls]
      this.props.onSetInfo(Object.assign({}, saveInfo));
    }
  };

  uploadImage = (type, index = 0) => {
    const vm = this;
    const { unionList, saveInfo } = this.props;
    Taro.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        upload({
          filePath: tempFilePaths,
          module: 'physical'
        }).then((resp: string) => {
          Taro.hideLoading();
          const result = JSON.parse(resp);
          const data = result.data;
          if (type === 1) {
            unionList.push(data);
            vm.props.onSetUnionList([...unionList]);
          } else {
            saveInfo.localImageList[index].imgUrls.push(data);
            // saveInfo.localImageList[index].imgUrls = [...saveInfo.localImageList[index].imgUrls]
            vm.props.onSetInfo(Object.assign({}, saveInfo));
          }
        });
      }
    });
  };

  watchData () {
    const { unionList, saveInfo } = this.props;
    let result = false;
    const { localImageList } = saveInfo;
    if (unionList.length) {
      result = true;
    } else {
      if (localImageList) {
        const list = localImageList.filter(item => {
          return item.imgUrls.length;
        });
        list.length === localImageList.length && (result = true);
      }
    }
    return result;
  }

  next = () => {
    const { unionList, saveInfo } = this.props;
    const { router } = getCurrentInstance();
    if (this.watchData()) {
      const params = saveInfo;
      console.log(unionList);
      if (unionList.length) {
        params.imgInfoList = params.localImageList.concat({
          projectId: null,
          imgUrls: unionList
        });
      }

      params.serviceRecordId = router?.params && router.params.serviceRecordId;
      commit(params).then((res:any) => {
        const valueList = [] as any;
        res.forEach(item => {
          item.detailVOList.forEach(dItem => {
            dItem.projectId = item.projectId;
            dItem.itemValue && (dItem.hide = true);
            valueList.push(dItem);
          });
        });
        this.props.onSetValueList(valueList);
        const noneValueList = valueList.filter(item => {
          return !item.itemValue;
        });
        if (!noneValueList.length) {
          this.save();
        }
        Taro.redirectTo({
          url: `/ServicesItems/pages/physical/supplement/index?serviceRecordId=${router?.params && router.params.serviceRecordId}`
        });
      });
    }
  };

  save = () => {
    const { router } = getCurrentInstance();
    const { valueList, unionList, saveInfo } = this.props;
    const params = saveInfo;
    const serviceRecordId = router?.params && router.params.serviceRecordId;
    unionList.length &&
      params.localImageList.concat({
        projectId: null,
        imgUrls: unionList
      });
    params.dataInfoList = valueList;
    params.serviceRecordId = serviceRecordId;
    commitData(params).then(res => {
      console.log(res);
      Taro.redirectTo({
        url: `/ServicesItems/pages/physical/detail/index?serviceRecordId=${serviceRecordId}`
      });
    });
  };

  render () {
    const { unionList, saveInfo } = this.props || {};
    const { localImageList } = saveInfo;
    return (
      <Page showBack title='解读体检报告'>
        <View className='page-physical-upload flex'>
          <View className='top'></View>
          <View className='center'>
            <View className='center-title flex'>
              <View className='left'></View>
              <View className='name'>拍照上传您的检验报告单</View>
            </View>
            <View className='list'>
              <View className='union'>组合上传</View>
              <View className='img-list flex'>
                {unionList.length
                  ? unionList.map((item, index) => {
                    return (
                        <View key={item} className='image-item'>
                          <Image src={item} className='img-content'></Image>
                          <View
                            className='del'
                            onClick={() => {
                              this.delImage(1, index);
                            }}
                          ></View>
                        </View>
                    );
                  })
                  : null}

                <View
                  className='image-item flex'
                  onClick={() => {
                    this.uploadImage(1);
                  }}
                >
                  <View className='camera'></View>
                </View>
              </View>
            </View>
            <View className='list'>
              <View className='union'>单个项目上传</View>
              {localImageList &&
                localImageList.length &&
                localImageList.map((item, lIndex) => {
                  return (
                    <View key={item.name} className='program'>
                      <View className='program-name'>{item.name}</View>
                      <View className='img-list flex'>
                        {item.imgUrls.length
                          ? item.imgUrls.map((iItem, index) => {
                            return (
                                <View key={iItem} className='image-item'>
                                  <Image
                                    src={iItem}
                                    className='img-content'
                                  ></Image>
                                  <View
                                    className='del'
                                    onClick={() => {
                                      this.delImage(2, lIndex, index);
                                    }}
                                  ></View>
                                </View>
                            );
                          })
                          : null}
                        {!item.imgUrls.length
                          ? (
                          <View
                            className='image-item flex'
                            onClick={() => {
                              this.uploadImage(2, lIndex);
                            }}
                          >
                            <View className='camera'></View>
                          </View>
                            )
                          : null}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
          <View
            className={`bottom flex ${
              this.watchData() ? '' : 'disable'
            }`}
            onClick={this.next}
          >
            下一步
          </View>
        </View>
      </Page>
    );
  }
}
export default PhysicalIndexUpload;
