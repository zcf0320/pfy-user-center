import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';
import RecommendItem from '../RecommendItem';

interface IProps {
  cIndex: number;
  detail: any;
}

const ClassItem = (props: IProps) => {
  const [showAll, setShowAll] = useState(false);
  const { type, productVOList } = props.detail || {};
  useEffect(() => {
    !type && setShowAll(true);
  }, [type]);
  return (
    <View className={`component-class-item ${type ? '' : 'p-t-32'}`}>
      {type
        ? (
        <View className='item-title flex'>
          <Text>{type}</Text>
          {productVOList.length > 1
            ? (
            <View
              className={`right ${showAll ? '' : 'all'} `}
              onClick={() => {
                setShowAll(!showAll);
              }}
            ></View>
              )
            : null}
        </View>
          )
        : null}

      {productVOList &&
        productVOList.length &&
        productVOList.map((item, index) => {
          return (index > 0 && showAll) || !index
            ? (
            <RecommendItem
              item={item}
              key={item.id}
              cIndex={props.cIndex}
              rIndex={index}
            ></RecommendItem>
              )
            : null;
        })}
    </View>
  );
};
export default ClassItem;
