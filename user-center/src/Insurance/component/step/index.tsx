import { View } from '@tarojs/components';
import './index.scss';

interface IProps{
    step: number; // 投保步骤
}

const Steps = (props: IProps) => {
  const { step } = props;
  return (
        <View className={`steps steps-${step}`}>
            <View className={`item ${step >= 1 && 'item-active'}`}>填写投保信息</View>
            <View className={`item ${step >= 2 && 'item-active'}`}>健康告知</View>
            <View className={`item ${step >= 3 && 'item-active'}`}>核保结果</View>
        </View>
  );
};

export default Steps;
