import { useState } from 'react';
import { View, Image } from '@tarojs/components';
import closeImg from '../../images/close-icon.png';
import './index.scss';

interface IProps {
  historyList: Array<string>;
  setModal: Function;
  changeHistory: (list: Array<string>) => void;
  historyClick: (keyword: string) => void;
}

const SearchHistory = (props: IProps) => {
  const [deleteState, setDeleteState] = useState(false);
  const { historyList = [] } = props;

  // 全部删除
  const deleteAllHistory = () => {
    props.setModal({
      title: '提示',
      show: true,
      content: '确定删除全部历史记录？',
      cancelText: '确认',
      confirmText: '取消',
      clickCancel: () => {
        props.changeHistory([]);
      }
    });
  };

  // 单个删除历史记录
  const deleteHistory = (item: string) => {
    const historyListSet = new Set(historyList);
    // 删除对应记录
    historyListSet.delete(item);
    props.changeHistory([...historyListSet]);
  };

  return (
    <View className='search-history'>
      {historyList.length
        ? (
        <View className='title'>
          <View className='text'>历史记录</View>
          <View className='action'>
            {!deleteState
              ? (
              <View
                className='delete-img'
                onClick={() => {
                  setDeleteState(true);
                }}
              ></View>
                )
              : (
              <View className='delete-all'>
                <View
                  className='delete'
                  onClick={() => {
                    deleteAllHistory();
                  }}
                >
                  全部删除
                </View>
                <View
                  className='complete'
                  onClick={() => {
                    setDeleteState(false);
                  }}
                >
                  完成
                </View>
              </View>
                )}
          </View>
        </View>
          )
        : null}

      <View className='history-list'>
        {!deleteState
          ? (
          <View className='show-list'>
            {!!historyList.length &&
              historyList.map((item: string) => (
                <View
                  className='item'
                  key={item}
                  onClick={() => {
                    props.historyClick(item);
                  }}
                >
                  {item}
                </View>
              ))}
          </View>
            )
          : (
          <View className='delete-list'>
            {!!historyList.length &&
              historyList.map((item: string) => (
                <View className='item' key={item}>
                  <View className='history-text'>{item}</View>
                  <Image
                    src={closeImg}
                    className='icon'
                    onClick={() => {
                      deleteHistory(item);
                    }}
                  ></Image>
                </View>
              ))}
          </View>
            )}
      </View>
    </View>
  );
};

export default SearchHistory;
