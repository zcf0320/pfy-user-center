import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import UploadImg from '@components/uploadImg';
import './index.scss';

interface IProps {
  materialList: any;
  deleteImg: Function;
  addItem: Function;
  setModal: Function;
}

function Material (props: IProps) {
  const { deleteImg, addItem, materialList } = props;
  // 图片点击事件
  const previewImage = (urls, current) => {
    Taro.previewImage({
      current: current,
      urls: urls
    });
  };
  return (
    <View className='claims-material'>
      <View className='claims-material-title'>
        <View className='claims-material-redline'></View>
        <View>补充材料</View>
      </View>
      {materialList &&
        materialList.length &&
        materialList.map((item: any, index: number) => {
          return (
            <View key={item.materialName}>
              <View className='claims-material-top'>
                <View className='claims-material-name'>
                  <View className='claims-material-materialName'>
                    {item.nickname}
                  </View>
                  {item.required
                    ? (
                    <View className='claims-material-red'>（必填）</View>
                      )
                    : (
                    <View className='claims-material-999'>（选填）</View>
                      )}
                </View>
                <View
                  className='claims-material-example'
                  onClick={() => {
                    if (item.sampleImage.length !== 0) {
                      previewImage(item.example, item.example[0]);
                    }
                  }}
                >
                  {`${item.sampleImage.length ? '查看示例' : '暂无示例'}`}
                </View>
              </View>
              <View className='claims-material-intro'>
                {item.materialExplain}
              </View>
              <UploadImg
                files={item.files}
                deleteImg={deleteImg}
                addItem={addItem}
                index={index}
                setModal={props.setModal}
              />
            </View>
          );
        })}
    </View>
  );
}
export default Material;
