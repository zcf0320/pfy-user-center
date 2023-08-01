import { useState, useEffect } from 'react';
import { View, Input, Text, Image } from '@tarojs/components';
import ClaimsSearch from '@components/ClaimsSearch';
import utils from '@utils/index';
import Drawer from '../Drawer';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  subTitle: string;
  selectText: string;
  confirm: Function;
  close: Function;
  showNumer: number;
  selectDrugText: string;
}
const initList = ['擦伤', '骨折'];
const allergyHistoryList = [
  '抗生素过敏',
  '花粉过敏',
  '牛奶过敏',
  '动物毛发过敏',
  '海鲜过敏'
];
function History (props: IProps) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState('');
  const [selectText, setSelectText] = useState(props.selectText);
  const [have, setHave] = useState(false);
  const [list, setList] = useState([] as any);
  const [drugList, setDrugList] = useState([] as any);
  const [selectDrugText, setSelectDrugText] = useState('');
  const [type, setType] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    if (props.selectText || selectDrugText) {
      const selectList = props.selectText.split(',');
      const selectDrugList = props.selectDrugText.split(',');
      setHave(true);
      if (props.showNumer === 10) {
        setList(Array.from(new Set([...allergyHistoryList, ...selectList])));
        setDrugList(selectDrugList);
        setSelectDrugText(props.selectDrugText);
      } else {
        setList(Array.from(new Set([...initList, ...selectList])));
      }
    } else {
      setList(props.showNumer === 10 ? allergyHistoryList : initList);
      setHave(false);
    }
  }, [props.selectDrugText, props.selectText, props.showNumer, selectDrugText]);
  const changeTab = has => {
    setHave(has);
    setSelectText(has ? '' : '否');
  };
  const watchData = () => {
    let result = true;
    if (have) {
      result = false;
      if (value) {
        result = true;
      } else {
        result = !!(selectText || setSelectDrugText);
      }
    }
    return result;
  };
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
    console.log(newSelect);
    setSelectText(newSelect);
  };
  const clickDrugItem = index => {
    // 判断是否有值
    const name = drugList[index];
    let newSelect = '';
    if (selectDrugText) {
      const selectList = selectDrugText.split(',');
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
    console.log(newSelect);
    setSelectDrugText(newSelect);
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
    list.push(name);
    setList(list);
    setSelectText(newSelect);
  };
  const addDrugItem = name => {
    let newSelect = '';
    console.log(selectDrugText);
    if (selectDrugText) {
      const selectList = selectDrugText.split(',');
      selectList.push(name);
      newSelect = selectList.join(',');
    } else {
      newSelect = name;
    }
    console.log(newSelect);
    drugList.push(name);
    setDrugList(drugList);
    setSelectDrugText(newSelect);
  };
  return (
    <Drawer
      title={props.title}
      close={() => {
        props.close();
      }}
    >
      <View className='modal-history-new '>
        <View className='history-top flex'>
          <Text>{props.subTitle}</Text>
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
              {props.showNumer === 10
                ? (
                <View className='type-list flex'>
                  <View
                    className={`type-item flex ${type === 2 ? 'select' : ''}`}
                    onClick={() => {
                      setType(2);
                    }}
                  >
                    药物过敏
                  </View>
                  <View
                    className={`type-item flex ${type === 1 ? 'select' : ''}`}
                    onClick={() => {
                      setType(1);
                    }}
                  >
                    其他过敏
                  </View>
                </View>
                  )
                : null}

              <View className='tag-list flex'>
                {type === 1 &&
                  list.length &&
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
                {!!(type === 2 && drugList.length) &&
                  drugList.map((item: any, index) => {
                    return (
                      <View
                        className={`tag-item flex ${
                          selectDrugText.indexOf(item) > -1 ? 'select' : ''
                        }`}
                        key={item}
                        onClick={() => {
                          clickDrugItem(index);
                        }}
                      >
                        <View className='item-content'>{item}</View>
                      </View>
                    );
                  })}
                {type === 2
                  ? (
                  <View
                    className='tag-item flex'
                    onClick={() => {
                      setShowSearch(true);
                    }}
                  >
                    +
                  </View>
                    )
                  : null}
              </View>
              {type === 1
                ? (
                <View className='modal-input flex '>
                  <View className='left'>
                    <Input
                      type='text'
                      value={value}
                      className='input'
                      placeholder={`请输入其他${props.title}`}
                      placeholderClass='placeholder'
                      onInput={e => {
                        setValue(e.detail.value);
                      }}
                      onFocus={() => {
                        setFocus(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setFocus(false);
                        }, 500);
                      }}
                    ></Input>
                  </View>
                  {focus
                    ? (
                    <Image
                      src={`${ossHost}images/close.png`}
                      className='close'
                      onClick={e => {
                        e.stopPropagation();
                        setValue('');
                      }}
                    ></Image>
                      )
                    : null}
                </View>
                  )
                : null}
            </View>
          )}
        </View>
        <View
          className={`confirm ${watchData() ? 'active' : ''}`}
          onClick={() => {
            if (!watchData()) {
              return;
            }
            if (value) {
              addItem(value);
              setList(list);
              setValue('');
              return;
            }
            props.confirm(selectText, selectDrugText);
            props.close();
          }}
        >
          确认
        </View>
      </View>
      {showSearch
        ? (
        <ClaimsSearch
          title=''
          showNumber={3}
          close={() => {
            setShowSearch(false);
          }}
          confirm={name => {
            const drugName = name.split('-')[0];
            addDrugItem(drugName);
            setShowSearch(false);
          }}
        ></ClaimsSearch>
          )
        : null}
    </Drawer>
  );
}
export default History;
