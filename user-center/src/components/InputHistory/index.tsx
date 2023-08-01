import { useState, useEffect } from 'react';
import { View, Input, Text } from '@tarojs/components';
import ClaimsSearch from '@components/ClaimsSearch';
import Drawer from '../Drawer';
import './index.scss';

interface IProps {
  title: string;
  subTitle: string;
  selectText: string;
  confirm: Function;
  close: Function;
  showNumber: number;
  selectDrugText: string;
  drug: boolean;
  serviceRecordId?: string;
}
const initList = ['擦伤', '骨折'];
const allergyHistoryList = [
  '抗生素过敏',
  '花粉过敏',
  '牛奶过敏',
  '动物毛发过敏',
  '海鲜过敏'
];
function InputHistory (props: IProps) {
  const [value, setValue] = useState('');
  const [selectText, setSelectText] = useState(props.selectText);
  const [have, setHave] = useState(false);
  const [list, setList] = useState([] as any);
  const [drugList, setDrugList] = useState([] as any);
  const [selectDrugText, setSelectDrugText] = useState('');
  const [type, setType] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    if (
      (props.selectText && props.selectText !== '否') ||
      (props.selectDrugText && props.selectDrugText !== '否')
    ) {
      const selectList = props.selectText ? props.selectText.split(',') : [];
      const selectDrugList = props.selectDrugText
        ? props.selectDrugText.split(',')
        : [];
      setHave(true);
      if (props.showNumber === 10) {
        setList(Array.from(new Set([...allergyHistoryList, ...selectList])));
        setDrugList(selectDrugList);
        setSelectDrugText(props.selectDrugText);
      } else {
        setList(Array.from(new Set([...initList, ...selectList])));
      }
    } else {
      setList(props.showNumber === 10 ? allergyHistoryList : initList);
      setSelectText('否');
      setSelectDrugText('否');
      setHave(false);
    }
  }, [props.selectDrugText, props.selectText, props.showNumber]);
  const changeTab = has => {
    setHave(has);
    setSelectText(has ? '' : '否');
    setSelectDrugText(has ? '' : '否');
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
    if (selectDrugText) {
      const selectList = selectDrugText.split(',');
      selectList.push(name);
      newSelect = selectList.join(',');
    } else {
      newSelect = name;
    }
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
      <View className={`modal-history-new ${props.drug ? 'drug' : ''}`}>
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
              {props.showNumber === 10
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
                    + 更多
                  </View>
                    )
                  : null}
              </View>
              {type === 1
                ? (
                <View className='modal-input flex '>
                  <View className='label'>添加其他{props.title}</View>
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
                    ></Input>
                    <View className='divider'></View>
                    <View
                      className='confirm-value'
                      onClick={() => {
                        if (value) {
                          addItem(value);
                          setList(list);
                          setValue('');
                        }
                      }}
                    >
                      确认
                    </View>
                  </View>
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
            if (!have) {
              setSelectText('否');
              props.confirm('否', '否');
            } else {
              props.confirm(selectText, selectDrugText);
            }
            setList([]);
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
          drug={props.drug}
          showNumber={3}
          close={() => {
            setShowSearch(false);
          }}
          serviceRecordId={props.serviceRecordId}
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
export default InputHistory;
