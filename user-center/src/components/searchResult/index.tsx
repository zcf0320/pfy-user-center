import { View, RichText } from '@tarojs/components';
import './index.scss';

interface ResultItem {
  id: string | number;
  name: string;
}
interface IProps {
  resultList: Array<ResultItem>;
  text?: string;
  callback: (item?: ResultItem) => void;
  isAjax?: boolean;
  from?: string;
}

const SearchResult = (props: IProps) => {
  const { resultList } = props;

  return (
    <View className='search-result'>
      {resultList && resultList.length
        ? (
        <View className={`result ${props.from === 'drug' ? 'all' : ''}`}>
          {resultList.map((item: ResultItem) => (
            <View
              className='item'
              key={item.id + Math.random().toString()}
              onClick={() => {
                props.callback && props.callback(item);
              }}
            >
              <View className='icon'></View>
              <View className='text'>
                <RichText nodes={item.name} />
              </View>
            </View>
          ))}
        </View>
          )
        : (
        <View className='none-result flex'>
          <View className={`none-img ${props.isAjax ? 'no-data' : ''}`}></View>
          <View className='none-text'>
            {props.text || !props.isAjax ? '点击搜索' : '暂无相关搜索'}
          </View>
        </View>
          )}
    </View>
  );
};

export default SearchResult;
