import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View, Input } from '@tarojs/components';
import './index.scss';

interface IProps {
  searchResult: (keyword: string) => void;
  changeHistory: (list: Array<string>) => void;
  keyword: string;
  keywordChange: (keyword: string) => void;
}

const SearchInput = (props: IProps) => {
  const { keyword = '' } = props;

  const [clear, setClear] = useState(false);

  // 搜索并存储搜索历史记录
  const search = () => {
    if (!keyword) {
      return;
    }
    const searchHistory = Taro.getStorageSync('searchHistory') || [];
    // 去除重复历史记录
    const historySet = new Set([...searchHistory, keyword]);
    Taro.setStorageSync('searchHistory', [...historySet]);
    // 搜索结果
    props.searchResult(keyword);
    // 记录搜索历史
    props.changeHistory([...historySet]);
  };

  return (
    <View className='search-input'>
      <View className='search-icon-click'></View>
      <View className='search-content'>
        <View className='content'>
          <Input
            className='input'
            type='text'
            value={keyword}
            placeholder='请输入搜索词'
            placeholderClass='placeholder'
            onInput={(e: any) => {
              props.keywordChange(e.detail.value);
            }}
            onFocus={() => {
              setClear(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setClear(false);
              }, 500);
            }}
          />
          {clear && (
            <View
              className='clear'
              onClick={() => {
                props.keywordChange('');
              }}
            ></View>
          )}
        </View>
      </View>
      <View className='search-button' onClick={search}>
        搜索
      </View>
    </View>
  );
};

export default SearchInput;
