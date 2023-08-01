import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import { upload } from '@actions/common';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  files: any;
  deleteImg: Function;
  addItem: Function;
  setModal: Function;
  index: number;
}

class UploadImg extends Component<IProps> {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // 上传图片
  uploadImg = () => {
    const _this = this;
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
        }).then((resp: string) => {
          Taro.hideLoading();
          const result = JSON.parse(resp);
          _this.props.addItem({ data: result.data, index: _this.props.index });
        });
      }
    });
  };

  // 图片点击事件
  previewImage = (imgList, current) => {
    Taro.previewImage({
      current: current,
      urls: imgList
    });
  };

  render () {
    const { files, deleteImg, setModal } = this.props;
    return (
      <View className='claims-upload'>
        {files &&
          files.length !== 0 &&
          files.map((item: any, index: number) => (
            <View
              className='claims-upload-box'
              key={item}
              onClick={() => {
                this.previewImage(files, item);
              }}
            >
              <Image
                src={item}
                className='claims-upload-img'
                mode='aspectFit'
              />
              <Image
                src={`${ossHost}claims_delete.png`}
                className='claims-upload-delete'
                onClick={e => {
                  e.stopPropagation();

                  setModal({
                    show: true,
                    content: '确认删除',
                    cancelText: '确认',
                    confirmText: '取消',
                    clickCancel: () => {
                      deleteImg(this.props.index, index);
                    }
                  });
                }}
              />
            </View>
          ))}
        <View className='claims-upload-box' onClick={this.uploadImg}>
          <Image src={`${ossHost}claims_add.png`} className='claims-upload-add' />
        </View>
      </View>
    );
  }
}

export default UploadImg;
