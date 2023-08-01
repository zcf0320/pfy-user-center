import Taro from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { ResultItem } from '../../types';
import './index.scss';

interface IProps {
    resultList: Array<ResultItem>;
    callback: (item: ResultItem) => void;
    changeHistory: (list: Array<string>) => void;
}

const SearchResult = (props: IProps) => {
  const { resultList = [] } = props;

  const changeHistory = (item: ResultItem) => {
    const searchHistory = Taro.getStorageSync('searchHistory') || [];
    // 去除重复历史记录
    const historySet = new Set([...searchHistory, item.text]);
    Taro.setStorageSync('searchHistory', [...historySet]);
    // 记录搜索历史
    props.changeHistory([...historySet]);
    props.callback && props.callback(item);
  };

  return (
        <View className='search-result'>
            {resultList.length
              ? (
                <View className='result'>
                    {resultList.map((item: ResultItem) => (
                        <View className='item' key={item.id} onClick={() => {
                          changeHistory(item);
                        }}
                        >
                            <View className='icon'></View>
                            <View className='text'><RichText nodes={item.name} /></View>
                        </View>
                    ))}
                </View>
                )
              : (
                <View className='none-result'>
                    <View className='none-img'></View>
                    <View className='none-text'>暂无相关搜索</View>
                </View>
                )}

        </View>
  );
};

export default SearchResult;
