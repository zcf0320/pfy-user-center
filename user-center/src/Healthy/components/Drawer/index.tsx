import { useState, ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface IProps {
  children: ReactNode;
  title: string;
  explain?: string;
  close: () => any;
}

const PerssureDrawer = (props: IProps) => {
  const { title, explain } = props;
  const [showTips, setShowTips] = useState(false);
  return (
    <View className='drawer-overlay'>
      <View className='drawer'>
        <View className='drawer-header'>
          <View className='title flex'>
            <Text>{title}</Text>
            {explain
              ? (
              <View className='explain'>
                <View
                  className='explain-bg'
                  onClick={() => {
                    setShowTips(!showTips);
                  }}
                ></View>
                {showTips
                  ? (
                  <View className='explain-text'>{explain}</View>
                    )
                  : null}
              </View>
                )
              : null}
          </View>

          <View className='icon_close' onClick={props.close}></View>
        </View>
        <View className='drawer-content'>{props.children}</View>
      </View>
    </View>
  );
};

export default PerssureDrawer;
