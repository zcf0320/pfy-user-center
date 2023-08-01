import { useState } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

interface IProps{
    plans: Array<any>;
    getPlanIndex: Function;
}
function PlanTab (props: IProps) {
  const [num, setNum] = useState(0);
  const { plans } = props;
  return (

        <View className={`component-tab flex ${plans.length === 2 ? 'two' : ''}`}>
            {
                plans && plans.length && plans.map((item, index) => {
                  return <View className={`tab-item flex ${index === num ? 'active' : ''}`}
                    onClick={() => {
                      setNum(index);
                      props.getPlanIndex(index);
                    }}
                    key={item.planId}
                  >{item.planName}</View>;
                })
            }

        </View>
  );
}
export default PlanTab;
