import { View } from '@tarojs/components';
import { ReactNode } from 'react';
import './index.scss';

interface IProps {
  children: ReactNode;
  title: string;
  close: () => any;
}

const Drawer = (props: IProps) => {
  const { title } = props;
  return (
    <View className='drawer-overlay'>
      <View className='drawer'>
        <View className='drawer-header'>
          <View className='title'>{title}</View>
          <View className='icon_close' onClick={props.close}></View>
        </View>
        <View className='drawer-content'>{props.children}</View>
      </View>
    </View>
  );
};

export default Drawer;
