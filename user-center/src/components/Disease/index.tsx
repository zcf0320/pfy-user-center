import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import SearchResult from '@components/searchResult';
import { searchDisease, searchSurgery } from '@actions/common';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  subTitle: string;
  list: any;
  close: () => any;
  confirm: any;
  showNumber?: number;
}

const Disease = (props: IProps) => {
  const { title, subTitle } = props;
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [have, setHave] = useState(false);
  const [list, setList] = useState(props.list);
  const [resultList, setResultList] = useState([]);
  const [isAjax, setIsAjax] = useState(false);
  useEffect(() => {
    const select = props.list.filter(item => {
      return item.select;
    });
    select.length && setHave(true);
  }, [props.list]);
  const watchData = () => {
    if (!have) {
      return true;
    } else {
      let result = false;
      value && (result = true);
      const select = list.filter(item => {
        return item.select;
      });
      select.length && (result = true);
      return result;
    }
  };
  const callBack = res => {
    res.forEach(item => {
      const reg = new RegExp(value, 'g'); // 定义正则
      item.oldName = item.name;
      item.name = item.name.replace(reg, `<div class="keyword">${value}</div>`); // 进行替换，并定义高亮的样式
    });
    setText(`无"${value}"的匹配疾病, 换个关键词试试吧"`);
    setResultList(res);
  };
  const search = (name?: string) => {
    if (name || value) {
      if (props.showNumber === 18) {
        searchSurgery({
          searchKey: name || value
        }).then(res => {
          // 匹配关键字高亮
          !isAjax && setIsAjax(true);
          callBack(res);
        });
      }
      searchDisease({
        searchKey: name || value
      }).then(res => {
        // 匹配关键字高亮
        !isAjax && setIsAjax(true);
        callBack(res);
      });
    }
  };

  return (
    <View className='drawer-overlay'>
      {
        step === 0
          ? (
        <View className='drawer'>
          <View className='drawer-header'>
            <View className='title'>{title}</View>
            <View className='icon_close' onClick={props.close}></View>
          </View>
          <View className='drawer-content'>
            <View className='modal-history-index '>
              <View className='history-top flex'>
                <Text>{subTitle}</Text>
                <View className='select-list flex'>
                  <View
                    className={`select-item flex ${have ? 'active' : ''}`}
                    onClick={() => {
                      setHave(true);
                    }}
                  >
                    是
                  </View>
                  <View
                    className={`select-item flex ${!have ? 'active' : ''}`}
                    onClick={() => {
                      setHave(false);
                    }}
                  >
                    否
                  </View>
                </View>
              </View>
              <View className='history-bottom'>
                {have && (
                  <View className='bottom-content'>
                    <View className='tag-list flex'>
                      {list.length &&
                        list.map((item: any) => {
                          return (
                            <View
                              className={`tag-item flex ${
                                item.select ? 'select' : ''
                              }`}
                              key={item.name}
                              onClick={() => {
                                item.select = !item.select;
                                setList(JSON.parse(JSON.stringify(list)));
                              }}
                            >
                              <View className='item-content'>{item.name}</View>
                            </View>
                          );
                        })}
                      <View
                        className='tag-item flex'
                        onClick={() => {
                          setStep(1);
                          setText('');
                        }}
                      >
                        <View className='item-content'>+更多</View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              <View
                className={`confirm ${watchData() ? 'active' : ''}`}
                onClick={() => {
                  if (!watchData()) {
                    return;
                  }
                  if (have) {
                    props.confirm(list);
                  } else {
                    props.confirm([]);
                  }
                }}
              >
                确认
              </View>
            </View>
          </View>
        </View>
            )
          : (
        <View className='search'>
          <View className='search-header flex'>
            <Image
              src={`${ossHost}images/back.png`}
              className='back'
              onClick={() => {
                setStep(0);
              }}
            ></Image>
            <View className='search-content flex'>
              <View className='left flex'>
                <Image src={`${ossHost}images/search-icon.png`} className='search-icon'></Image>
                <Textarea
                  fixed
                  adjustPosition={false}
                  onInput={e => {
                    setValue(e.detail.value);
                    search(e.detail.value);
                  }}
                  className='search-input'
                  value={value}
                ></Textarea>
              </View>

              <View
                className='search-text'
                onClick={() => {
                  search();
                }}
              >
                搜索
              </View>
            </View>
          </View>
          <View className='content'>
            <SearchResult
              resultList={resultList}
              text={text}
              isAjax={isAjax}
              callback={(item: any) => {
                //  判断list 里面是否有
                const repeat = list.filter(lItem => {
                  return lItem.name === item.oldName;
                });
                if (repeat.length) {
                  setStep(0);
                  Taro.showToast({
                    title: '已添加该病史',
                    icon: 'none'
                  });
                  return;
                }
                list.push({ name: item.oldName, select: true });
                setList(list);
                setValue('');
                setResultList([]);
                setStep(0);
              }}
            ></SearchResult>
          </View>
        </View>
            )}
    </View>
  );
};

export default Disease;
