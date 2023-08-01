import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import utils from '@utils/index';
import SearchResult from '@components/searchResult';
import { searchDisease, searchSurgery } from '@actions/common';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  subTitle: string;
  selectText: string;
  close: () => any;
  confirm: any;
  showNumber: number;
}
const pastHistory = ['高血压', '糖尿病', '脑梗', '白癜风', '癫痫', '哮喘'];
const surgeryHistory = [
  '阑尾切除术',
  '甲状腺手术',
  '拔牙术',
  '肿瘤切除术',
  '主动脉缩窄术',
  '其他手术'
];
const Disease = (props: IProps) => {
  const { title, subTitle } = props;
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [have, setHave] = useState(false);
  const [list, setList] = useState([] as any);
  const [selectText, setSelectText] = useState('');
  const [resultList, setResultList] = useState([]);
  const [isAjax, setIsAjax] = useState(false);
  useEffect(() => {
    if (props.selectText && props.selectText !== '否') {
      if (props.selectText.length) {
        setSelectText(props.selectText);
        const selectList = props.selectText.split(',');
        let allList = [] as any;
        if (props.showNumber === 12) {
          allList = Array.from(new Set([...selectList, ...surgeryHistory]));
        } else {
          allList = Array.from(new Set([...selectList, ...pastHistory]));
        }
        setList(allList);
        setHave(true);
      } else {
        setList(props.showNumber === 12 ? surgeryHistory : pastHistory);
      }
    } else {
      setList(props.showNumber === 12 ? surgeryHistory : pastHistory);
      setSelectText('否');
    }
  }, [props.selectText, props.showNumber]);
  const clickItem = index => {
    // 判断是否有值
    const name = list[index];
    let newSelect = '';
    if (selectText) {
      const selectList = selectText.split(',');
      const inIndex = selectList.indexOf(name);
      if (inIndex > -1) {
        selectList.splice(inIndex, 1);
      } else {
        selectList.push(name);
      }
      newSelect = selectList.join(',');
    } else {
      newSelect = name;
    }
    setSelectText(newSelect);
  };
  const addItem = name => {
    let newSelect = '';
    if (selectText) {
      const selectList = selectText.split(',');
      selectList.push(name);
      newSelect = selectList.join(',');
    } else {
      newSelect = name;
    }
    setSelectText(newSelect);
  };
  const save = () => {
    const { showNumber } = props;
    const obj: any = {};
    showNumber === 9 && (obj.disease = selectText);
    showNumber === 11 && (obj.familialDiseases = selectText);
    showNumber === 12 && (obj.operation = selectText);
    showNumber === 14 && (obj.existingDiseases = selectText);
    props.confirm(obj);
    setList([]);
    setSelectText('');
    props.close();
  };
  const changeTab = has => {
    setHave(has);
    setSelectText(has ? '' : '否');
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
      if (props.showNumber === 12) {
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
    <View className='disease-drawer-overlay'>
      {
        step === 0
          ? (
        <View className='disease-drawer'>
          <View className='disease-drawer-header'>
            <View className='title'>{title}</View>
            <View className='icon_close' onClick={props.close}></View>
          </View>
          <View className='disease-drawer-content'>
            <View className='disease-modal-history-index '>
              <View className='disease-history-top flex'>
                <Text>{subTitle}</Text>
                <View className='select-list flex'>
                  <View
                    className={`select-item flex ${have ? 'active' : ''}`}
                    onClick={() => {
                      changeTab(true);
                    }}
                  >
                    是
                  </View>
                  <View
                    className={`select-item flex ${!have ? 'active' : ''}`}
                    onClick={() => {
                      changeTab(false);
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
                        list.map((item: any, index) => {
                          return (
                            <View
                              className={`tag-item flex ${
                                selectText.indexOf(item) > -1 ? 'select' : ''
                              }`}
                              key={item}
                              onClick={() => {
                                clickItem(index);
                              }}
                            >
                              <View className='item-content'>{item}</View>
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
                className={`confirm ${selectText ? 'active' : ''}`}
                onClick={save}
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
                <Input
                  placeholder={
                    props.showNumber === 12
                      ? '请输入手术名称'
                      : '请输入确诊的疾病名称'
                  }
                  placeholderClass='placeholder'
                  onInput={e => {
                    setValue(e.detail.value);
                    search(e.detail.value);
                  }}
                  className='search-input'
                  value={value}
                ></Input>
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
                list.push(item.oldName);
                setList(list);
                addItem(item.oldName);
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
