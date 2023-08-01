import { useState, useEffect } from 'react';
import { View, Input, Text, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
    confirm: Function;
    list: any;
    showNumber: number | string;
}
function History (props: IProps) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState('');
  const [have, setHave] = useState(false);
  const [list, setList] = useState(props.list);
  useEffect(() => {
    const select = props.list.filter((item) => {
      return item.select;
    });
    select.length && (setHave(true));
  }, [props.list]);
  const watchData = () => {
    if (!have) {
      return true;
    } else {
      let result = false;
      value && (result = true);
      const select = list.filter((item) => {
        return item.select;
      });
      select.length && (result = true);
      return result;
    }
  };
  const selectTag = (index) => {
    // 怀孕状态 单选
    if (props.showNumber === 8) {
      list.forEach((item) => {
        item.select = false;
      });
      list[index].select = true;
    }
    if (props.showNumber === 6) {
      list[index].select = !list[index].select;
    }
    setList(JSON.parse(JSON.stringify(list)));
  };
  return (
        <View>
            <View className='modal-history-new '>
                <View className='history-top flex'>
                    <Text>是否{props.showNumber === 6 ? '有过敏史' : '备孕/怀孕/哺乳期'}</Text>
                    <View className='select-list flex'>
                        <View className={`select-item flex ${have ? 'active' : ''}`} onClick={() => { setHave(true); }}>是</View>
                        <View className={`select-item flex ${!have ? 'active' : ''}`} onClick={() => { setHave(false); }}>否</View>
                    </View>
                </View>
                <View className='history-bottom'>
                    {
                        have && <View className='bottom-content'>
                            <View className='tag-list flex'>
                                {
                                    list.length && list.map((item: any, index) => {
                                      return (<View className={`tag-item flex ${item.select ? 'select' : ''} ${props.showNumber === 6 ? '' : 'pra'}`}
                                        key={item.name}
                                        onClick={() => {
                                          selectTag(index);
                                        }}
                                      ><View className='item-content'>{item.name}</View></View>);
                                    })
                                }
                            </View>
                            {props.showNumber !== 8
                              ? <View className='modal-input flex '>
                                <View className='left'>
                                    <Input type='text'
                                      value={value}
                                      className='input'
                                      placeholder={`请输入其他${props.showNumber === 5 ? '既往史' : '过敏史'}`}
                                      placeholderClass='placeholder'
                                      onInput={(e) => { setValue(e.detail.value); }}
                                      onFocus={() => { setFocus(true); }}
                                      onBlur={() => { setTimeout(() => { setFocus(false); }, 500); }}
                                    ></Input>
                                </View>
                                {focus
                                  ? <Image src={`${ossHost}images/close.png`} className='close' onClick={(e) => {
                                    e.stopPropagation();
                                    setValue('');
                                  }}
                                  ></Image>
                                  : null}
                            </View>
                              : null}
                        </View>
                    }
                </View>
                <View className={`confirm ${watchData() ? 'active' : ''}`} onClick={
                    () => {
                      if (!watchData()) {
                        return;
                      }
                      if (have) {
                        if (value) {
                          list.push({
                            name: value,
                            select: true
                          });
                          setList(list);
                          setValue('');
                          return;
                        }
                        props.confirm(list);
                      } else {
                        props.confirm([]);
                      }
                    }
                }
                >确认</View>
            </View>
        </View>
  );
}
export default History;
