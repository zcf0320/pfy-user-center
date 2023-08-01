import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';

import * as inquireApi from '@actions/inquire';
import { SymptomItem } from '../../types';
import './index.scss';

interface DiagnoseItem {
  part: string;
  list: Array<SymptomItem>;
}

interface IProps {
  selectDisease: (item: SymptomItem) => void;
}

const FilterDiagnose = (props: IProps) => {
  const [diagnoseList, setDiagnoseList] = useState([] as any);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeList, setActiveList] = useState([] as any);
  const [id, setId] = useState(Number);

  // 筛选部位显示具体症状
  const filterActiveList = (index: number) => {
    const firstList: Array<DiagnoseItem> = diagnoseList.filter(
      (_item: DiagnoseItem, filterIndex: number) => {
        return filterIndex === index;
      }
    );
    return firstList && firstList[0].list;
  };

  // 部位切换
  const changePart = (index: number) => {
    setActiveIndex(index);
    setActiveList(filterActiveList(index));
  };

  // 点击具体症状
  const symptomClick = (item: any) => {
    setId(item.id);
    props.selectDisease && props.selectDisease(item);
  };

  // 获取症状列表
  const getDiagnoseList = () => {
    inquireApi.getDiagnoseList().then((res: any) => {
      setDiagnoseList(res);
      if (res.length && res[0].list) {
        setActiveList(res[0].list);
      }
    });
  };

  useEffect(() => {
    getDiagnoseList();
  }, []);

  return (
    <View className='diagnose-list'>
      <View className='flex'>
        <View className='filter-left'>
          {/* <View className="part">常见症状</View> */}
          {diagnoseList.map((item, index) => (
            <View
              key={item.part}
              className={`part ${activeIndex === index && 'part-active'}`}
              onClick={() => {
                changePart(index);
              }}
            >
              {item.part}
            </View>
          ))}
        </View>
        <View className='filter-right'>
          <View className='symptom-list'>
            {activeList.map((item: SymptomItem) => (
              <View
                key={item.id}
                className={`symptom-item ${item.id === id &&
                  'symptom-item-active'}`}
                onClick={() => {
                  symptomClick(item);
                }}
              >
                <Text>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FilterDiagnose;
