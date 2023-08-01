import i18n from '@i18n/index';
import { View, Image } from '@tarojs/components';
import './index.scss';

interface IProps{
  content?: number;
  activedId?: number;
  imgUrl?: string;
  isStartPlay?: boolean;
  handleBegin?: ()=>void;
}
function RowItem (props:IProps) {
  const { content, activedId, imgUrl, isStartPlay, handleBegin } = props;
  return (
    <View className='lottery-item'>
      {isStartPlay
        ? (
        <View onClick={handleBegin}>
          <Image src={imgUrl} className='go' />
        </View>
          )
        : (
        <View className={`${activedId === content ? null : 'shadow'}`}>
        {
          content === 0
            ? <View
                className={`${
            activedId === content ? i18n.getLocaleName() === 'zh' ? 'actived-0' : 'actived-0-en' : i18n.getLocaleName() === 'zh' ? 'picAnd0' : 'picAnd0-en'
          }`}
            ></View>
            : <View
                className={`${
          activedId === content ? 'actived-' + content : 'picAnd' + content
        }`}
            ></View>
        }

        </View>
          )}
    </View>
  );
}
export default RowItem;
