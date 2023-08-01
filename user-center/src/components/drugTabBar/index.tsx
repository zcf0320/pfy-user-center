import { View, Image, Text } from '@tarojs/components';
import './index.scss';

interface IProps {
  tab: any;
  activeIndex: number;
  select: Function;
}
function DrugTabBar (props: IProps) {
  return (
    <View className='component-tabber flex'>
      {props.tab && props.tab.length
        ? props.tab.map((item, index) => {
          return (
              <View
                className={`tab-item flex ${
                  index === props.activeIndex ? 'active' : ''
                }`}
                key={item.text}
                onClick={() => {
                  props.select(index);
                }}
              >
                <Image
                  src={
                    index === props.activeIndex ? item.activeIcon : item.icon
                  }
                  className='icon'
                ></Image>
                <Text>{item.text}</Text>
              </View>
          );
        })
        : null}
    </View>
  );
}
export default DrugTabBar;
