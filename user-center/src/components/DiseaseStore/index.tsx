import Taro from '@tarojs/taro';
import { useState, useEffect, useCallback } from 'react';
import { View, Image, Input } from '@tarojs/components';
import SearchResult from '@components/searchResult';
import { searchDisease, searchSurgery } from '@actions/common';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  subTitle?: string;
  list: any;
  close: () => any;
  confirm: any;
  showNumer?: number;
}

const DiseaseStore = (props: IProps) => {
  const { title } = props;
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  // const [setHave] = useState(true);
  const [list = [], setList] = useState(props.list);
  const [resultList, setResultList] = useState([]);
  // useEffect(() => {
  //   const select = props.list.filter((item, index) => {
  //     return item.select;
  //   });
  //   select.length && setHave(true);
  // }, [props.list, setHave]);
  // const watchData = () => {
  //   if (!have) {
  //     return true;
  //   } else {
  //     let result = false;
  //     value && (result = true);
  //     const select = list.filter((item, index) => {
  //       return item.select;
  //     });
  //     select.length && (result = true);
  //     return result;
  //   }
  // };
  const search = useCallback(() => {
    const callBack = res => {
      res.forEach(item => {
        const reg = new RegExp(value, 'g'); // 定义正则
        item.oldName = item.name;
        item.name = item.name.replace(reg, `<div class="keyword">${value}</div>`); // 进行替换，并定义高亮的样式
      });
      setText(`无"${value}"的匹配疾病, 换个关键词试试吧"`);
      setResultList(res);
    };
    if (value) {
      if (props.showNumer === 18) {
        searchSurgery({
          searchKey: value
        }).then(res => {
          // 匹配关键字高亮
          callBack(res);
        });
      }
      searchDisease({
        searchKey: value
      }).then(res => {
        // 匹配关键字高亮
        callBack(res);
      });
    }
  }, [props.showNumer, value]);
  useEffect(() => {
    search();
  }, [search, value]);

  return (
    <View className='drawer-overlay-claims'>
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
              <View className='history-bottom'>
                <View className='bottom-content'>
                  <View className='tag-list flex'>
                    {list.length > 0 &&
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
                      <View className='item-content'>+</View>
                    </View>
                  </View>
                </View>
              </View>
              <View
                className='confirm active'
                onClick={() => {
                  props.confirm(list);
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
              className='claims-disaster'
              onClick={() => {
                setStep(0);
              }}
            ></Image>
            <View className='search-content flex'>
              <View className='left flex'>
                <Image
                  src={`${ossHost}images/search-icon.png`}
                  className={`search-icon ${value ? 'search-icon-no' : ''}`}
                ></Image>
                <Input
                  adjustPosition={false}
                  onInput={e => {
                    setValue(e.detail.value);
                  }}
                  className='search-input-store'
                  value={value}
                />
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
              callback={(item: any) => {
                //  判断list 里面是否有
                const repeat = list.filter((lItem) => {
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

export default DiseaseStore;
