import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import dayjs from 'dayjs';
import './index.scss';

interface DateItem {
  time: string;
  complete: boolean;
  index: number;
  startDate: number;
  endDate: number;
}

interface IProps {
  dateList: Array<DateItem>;
  isClick: boolean;
  selectDate?: (index: number, time: string) => void;
}

const DatePick = (props: IProps) => {
  const { dateList = [] } = props;

  // 切换日期
  const [activeIndex, setActiveIndex] = useState(0);
  // // 当前可填写日期
  // const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (dateList.length) {
      const startTime = Number(dateList[0].startDate);
      const endTime = Number(dateList[0].endDate);
      const currentTime = dayjs().valueOf();
      if (currentTime < startTime) {
        // 当前时间小于开始时间
        // setCurrentIndex(1);
        setActiveIndex(1);
        props.selectDate && props.selectDate(1, dateList[1].time);
      } else if (currentTime > endTime) {
        // 当前时间大于开始时间
        // setCurrentIndex(dateList.length);
        setActiveIndex(dateList.length);
        props.selectDate &&
          props.selectDate(dateList.length, dateList[dateList.length - 1].time);
      } else {
        // 当前时间介于开始时间与结束时间之间
        dateList.forEach(item => {
          if (item.time === dayjs().format('MM.DD')) {
            setActiveIndex(item.index);
            // setCurrentIndex(item.index);
            props.selectDate && props.selectDate(item.index, item.time);
          }
        });
      }
    }
  }, [dateList, props]);
  return (
    <View className='date-pick'>
      {dateList.length &&
        dateList.map(item => (
          <View
            className='date-item'
            key={item.index}
            onClick={() => {
              // if (item.index > currentIndex || !isClick) {
              //     return;
              // }
              props.selectDate && props.selectDate(item.index, item.time);
              setActiveIndex(item.index);
            }}
          >
            {item.complete
              ? (
              <View className='date-complete'>
                {activeIndex === item.index
                  ? (
                  <View className='complete'>{item.index}</View>
                    )
                  : (
                  <View className='img'></View>
                    )}
              </View>
                )
              : (
              <View
                className={`${activeIndex === item.index &&
                  'date-active'} date`}
              >
                {item.index}
              </View>
                )}
            <View
              className={`${activeIndex === item.index && 'time-active'} time`}
            >
              {item.time === dayjs().format('MM-DD') ? '今天' : item.time}
            </View>
          </View>
        ))}
    </View>
  );
};

export default DatePick;
