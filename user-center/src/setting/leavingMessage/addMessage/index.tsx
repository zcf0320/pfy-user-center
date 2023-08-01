import Taro from '@tarojs/taro';
import { View, Image, Textarea, Input } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import { upload } from '@actions/common';
import utils from '@utils/index';
import { addLeavingMessage } from '@actions/user';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  message: string;
  phone: string;
  files: Array<string>;
}
class AddMessage extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      message: '',
      phone: '',
      files: []
    };
  }

  componentDidShow () {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    if (user !== {}) {
      this.setState({
        phone: user.mobile || ''
      });
    }
  }

  handleChange (value) {
    this.setState({
      message: value.detail.value
    });
  }

  previewImg (item) {
    Taro.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [item] // 需要预览的图片http链接列表
    });
  }

  // 上传图片
  uploadImg = () => {
    const _this = this;
    const { files } = this.state;
    if (files.length >= 3) {
      Taro.showToast({
        title: i18n.chain.LeavingMessage.max3,
        icon: 'none',
        duration: 2000
      });
      return;
    }
    Taro.chooseImage({
      count: 1,
      success (res) {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.showLoading({
          title: i18n.chain.LeavingMessage.load,
          mask: true
        });
        upload({
          filePath: tempFilePaths,
          module: 'report'
        }).then((res2: string) => {
          Taro.hideLoading();
          const result = JSON.parse(res2);
          files.push(result.data);
          _this.setState({
            files
          });
        });
      }
    });
  };

  delImg (index) {
    const { files } = this.state;
    files.splice(index, 1);
    this.setState({
      files
    });
  }

  inputChange (e) {
    this.setState({
      phone: e.detail.value
    });
  }

  submit () {
    const { message, phone, files } = this.state;
    if (message && phone) {
      if (utils.checkPhone(phone)) {
        const params = {
          content: message,
          mobile: phone,
          pictures: files
        };
        addLeavingMessage(params).then(() => {
          Taro.showToast({
            icon: 'none',
            title: i18n.chain.LeavingMessage.addSuccess,
            duration: 2000
          });
          Taro.redirectTo({
            url: '/setting/leavingMessage/index'
          });
        });
      } else {
        Taro.showToast({
          title: i18n.chain.LeavingMessage.phoneErr,
          icon: 'none',
          duration: 2000
        });
      }
    }
  }

  render () {
    const { files, phone, message } = this.state;
    return (
      <Page showBack title={i18n.chain.LeavingMessage.add}>
        <View className='add-message-page'>
          <View className='add-message-page-title'>{i18n.chain.LeavingMessage.problem}</View>
          <View className='add-message-textarea'>
          <Textarea
            value={message}
            onInput={this.handleChange.bind(this)}
            maxlength={300}
            placeholder={i18n.chain.LeavingMessage.inputTip}
          />
          </View>

          <View className='add-message-page-img'>
            {files.map((item, index) => {
              return (
                <View
                  className='leaving-message-img-main'
                  key={'留言图片' + index}
                >
                  <Image
                    onClick={this.previewImg.bind(this, item)}
                    className='leaving-message-img'
                    src={item}
                  ></Image>
                  <View
                    className='del-icon'
                    onClick={this.delImg.bind(this, index)}
                  ></View>
                </View>
              );
            })}
            <View
              className='add-message-addimg'
              onClick={this.uploadImg.bind(this)}
            ></View>
          </View>
          <View className='add-message-page-title'>{i18n.chain.LeavingMessage.inputPhone}</View>
          <View className='add-message-input'>
          <Input
            maxlength={11}
            value={phone}
            onInput={this.inputChange.bind(this)}
            type='text'

            placeholder={i18n.chain.LeavingMessage.customer}
          />
          </View>

          <View
            className={`add-message-btn ${message && phone ? '' : 'disable'}`}
            onClick={this.submit.bind(this)}
          >
            {i18n.chain.button.submit}
          </View>
        </View>
      </Page>
    );
  }
}
export default AddMessage;
