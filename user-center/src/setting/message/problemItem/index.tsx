import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function ProblemItem (props: any) {
  const [show, setShow] = useState(false);

  return (
    <View className={`problem-item flex ${props.index ? 'no-margin' : ''}`}>
      <View className={`problem-index q-${props.index + 1}`}></View>
      <View className={`problem-name ${props.index === 3 ? 'no-border' : ''}`}>
        <View
          className='problem-name-top flex'
          onClick={() => {
            setShow(!show);
          }}
        >
          <Text>{props.item.title}</Text>
          <View className={`next ${show ? 'show' : ''}`}></View>
        </View>
        {show ? <View className='text'>{props.item.subTitle}</View> : null}
      </View>
    </View>
  );
}
