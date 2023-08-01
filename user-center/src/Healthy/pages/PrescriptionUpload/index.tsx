import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { getHealthMaterial } from '@actions/healthy';
import Page from '@components/page';
import EmptyBox from '@components/emptyBox';
import utils from '@utils/index';
import './index.scss';

export default function PrescriptionUpload () {
  const { router } = getCurrentInstance();
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (router?.params && router.params.code) {
      if (router.params.code === 'prescriptions') {
        setTitle('处方单');
        Taro.setNavigationBarTitle({ title: '处方单' });
      }
      if (router.params.code === 'assay') {
        setTitle('化验单');
        Taro.setNavigationBarTitle({ title: '化验单' });
      }
      if (router.params.code === 'material') {
        setTitle('影像材料');
        Taro.setNavigationBarTitle({ title: '影像材料' });
      }

      getHealthMaterial({ healthMaterialCode: router.params.code }).then((res: any) => {
        setData(res);
      });
    }
  }, [router.params]);

  const uploadImage = () => {
    const { appConfig } = utils || {};
    const header = {
      contentType: 'multipart/form-data; boundary=ABCD'
    };
    const token = Taro.getStorageSync(utils.appConfig.xAccessToken) || '';
    token && (header.token = token);
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        const tempFilePaths = res.tempFilePaths;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        Taro.uploadFile({
          url: `${appConfig.BASE_URL}healthFile/material/uploadHealthMaterial`,
          filePath: tempFilePaths[0],
          name: 'files',
          header,
          formData: {
            healthMaterialCode: router?.params && router.params.code
          },
          success (res) {
            Taro.hideLoading();
            const result = JSON.parse(res.data);
            if (result.status) {
              Taro.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 5000
              });
              getHealthMaterial({ healthMaterialCode: router?.params && router.params.code }).then((res: any) => {
                setData(res);
              });
            } else {
              Taro.showToast({
                title: result.message,
                icon: 'none',
                duration: 5000
              });
            }
          }
        });
      }
    });
  };
  return (
    <Page showBack title={title}>
      <View className='prescription-upload-page'>
          <View className='img-list'>
            {data && data.length
              ? (
                  data.map((item:any) => {
                    return (
                  <View
                    className='img-card'
                    key={item}
                  >
                <Image className='img-card-item' mode='aspectFit' src={item} onClick={() =>
                  Taro.previewImage(
                    {
                      current: item,
                      urls: data
                    })
                        }
                ></Image>
                  </View>
                    );
                  })
                )
              : <View style={{ margin: '0 auto' }}><EmptyBox title='暂无材料'></EmptyBox></View>}
          </View>
        <View className='upload-img'>
        <View className='upload-img-btn' onClick={() => { uploadImage(); }}>上传{title}</View>
        </View>
      </View>
    </Page>
  );
}
