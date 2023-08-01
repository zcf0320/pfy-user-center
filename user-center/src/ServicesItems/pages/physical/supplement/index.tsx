import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { connect } from 'react-redux';
import { SET_VALUE_LIST } from '@constants/serviceItem';
import { SET_MODAL } from '@constants/common';
import { commitData } from '@actions/serviceItem';
import './index.scss';

@connect(state => state.serviceItem, dispatch => ({
  setValueList (data) {
    dispatch({
      type: SET_VALUE_LIST,
      payload: data
    });
  },
  setModal (data) {
    dispatch({
      type: SET_MODAL,
      payload: data
    });
  }

}))
class PhysicalSupplement extends Component<any> {
    save = () => {
      this.props.setModal({
        show: true,
        content: '确认提交体检报告解读吗？',
        cancelText: '我再想想',
        confirmText: '确认提交',
        clickConfirm: () => {
          this.sureSave();
        }
      });
    };

    sureSave = () => {
      const { router } = getCurrentInstance();
      const { valueList, saveInfo } = this.props;
      const params = saveInfo;
      const serviceRecordId = router?.params && router.params.serviceRecordId;
      // if(unionList.length){
      //     params.localImageList = params.localImageList.concat({
      //         projectId: null,
      //         imgUrls: unionList
      //     })
      // }
      params.dataInfoList = valueList;
      params.serviceRecordId = serviceRecordId;
      commitData(params).then(res => {
        console.log(res);
        Taro.redirectTo({
          url: `/ServicesItems/pages/physical/detail/index?serviceRecordId=${res}`
        });
      });
    };

    editInfo = (e, index) => {
      const { valueList } = this.props;
      valueList[index].itemValue = e.detail.value;
      // valueList[index].newValue = true
      this.props.setValueList([...valueList]);
    };

    watchData = () => {
      const { valueList } = this.props;
      const empty = valueList.filter((item) => {
        return !item.itemValue;
      });
      return !!empty.length;
    };

    render () {
      const { valueList } = this.props;
      return <Page showBack title='解读体检报告'>
            <View className='page-physical-supplement flex'>
                <View className='top flex'>以下这些检验项目未识别出，您可以手动录入使报告更精准</View>
                <View className='center'>
                    {
                        valueList.length
                          ? valueList.map((item, index) => {
                            return !item.hide
                              ? <View className='center-item' key={item.itemId}>
                            <View className='item-name flex'>
                                {/* <View className="dot"></View> */}
                                <Text>{item.itemName}
                                { item.unit ? <Text>（{item.unit}）</Text> : null }
                            </Text>
                            </View>
                            <Input type='digit' className='input' maxlength={10} placeholder='请输入您的值' placeholderClass='placeholder' value={item.itemValue} onInput={(e) => {
                              this.editInfo(e, index);
                            }}
                            ></Input>
                        </View>
                              : null;
                          })
                          : null
                    }

                </View>
                <View className='bottom flex'>

                    {/* <View className="btn-item flex skip" onClick={() => {this.save(1)}}>跳过此步</View> */}
                    {/* <View className={`btn-item flex open ${this.watchData() ? 'disable' : ''}`} onClick={() => {this.save(2)}}>点击查看</View> */}
                    <View className='btn-item flex open' onClick={() => { this.save(); }}>点击查看</View>
                </View>
            </View>
        </Page>;
    }
}
export default PhysicalSupplement;
