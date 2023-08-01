import { View, Input, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  onConfirm: Function;
}
function Search (props: IProps) {
  return (
    <View className='component-search'>
      <View className='component-search-content flex'>
        <Image src={`${ossHost}images/search.png`} className='search'></Image>
        <Input
          className='input'
          placeholder='请输入搜索词'
          onConfirm={e => {
            props.onConfirm(e);
          }}
        ></Input>
      </View>
    </View>
  );
}
export default Search;
