import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface IProps {
    min: number;
    max: number;
}
function Counter (props: IProps) {
  const [num, setNum] = useState(1);
  return (
        <View className='component-counter flex'>
            <View className={`btn flex ${num === props.min ? 'disable' : ''}`} onClick={
                () => {
                  if (num === props.min) {
                    return;
                  }
                  setNum(num - 1);
                }
            }
            ><Text>-</Text></View>
            <Text className='text'>{num}</Text>
            <View className={`btn flex ${num === props.max ? 'disable' : ''}`} onClick={
                () => {
                  if (num === props.max) {
                    return;
                  }
                  setNum(num + 1);
                }
            }
            ><Text>+</Text></View>
        </View>
  );
}
export default Counter;
