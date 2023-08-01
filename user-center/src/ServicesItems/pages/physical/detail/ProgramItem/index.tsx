import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

const ProgramItem = (props: any) => {
  const [show, setShow] = useState(false);
  const { projectName, projectItemDetailList } = props.item;
  return (
    <View className='program-item'>
    <View className='item-top flex'>
      <Text>{projectName}</Text>
      {
        show
          ? (
        <View
          className='show hide'
          onClick={() => {
            setShow(false);
          }}
        ></View>
            )
          : null}
    </View>
    {
      show
        ? (
      <View className='list'>
        {projectItemDetailList &&
          projectItemDetailList.length &&
          projectItemDetailList.map((item: any) => {
            return (
              <View className='item' key={item.itemName}>
                <View className='item-name'>{item.itemName}</View>
                <View className='common'>正常值：{item.normalValue}</View>
                {item.itemValue
                  ? (
                  <View className='common flex'>
                    <View className='act'>实际值：{item.itemValue}</View>
                    {
                      !item.normal
                        ? (<View className='error'></View>)
                        : null
                      }
                  </View>
                    )
                  : null}
                <View className='explain'>
                  异常值解读：{item.outlierInterpretation || '-'}
                </View>
              </View>
            );
          })}
      </View>
          )
        : null}
    {!show
      ? (
      <View
        className='open flex'
        onClick={() => {
          setShow(true);
        }}
      >
        <Text>查看详情</Text>
        <View className='show'></View>
      </View>
        )
      : null}
  </View>
  );
};
export default ProgramItem;
