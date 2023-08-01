import { useState, useEffect } from 'react';
import utils from '@utils/index';
import { View } from '@tarojs/components';
import dayjs from 'dayjs';
import './index.scss';

interface IProps {
  change: (number) => void;
}
const eumn = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  0: '日'
};
const DatePicker = (props: IProps) => {
  const [list, setList] = useState([]);
  const [startTime, setStartTime] = useState(dayjs);
  const [endTime, setEndTime] = useState(dayjs);
  const [selectTime, setSelectTime] = useState(0);
  useEffect(() => {
    const today = new Date().getDay();
    const startTime = dayjs(dayjs().subtract(today, 'day')).startOf('day');
    const endTime = dayjs(startTime).add(7, 'day');
    setSelectTime(dayjs(dayjs().startOf('day')).valueOf());
    setStartTime(startTime);
    setEndTime(endTime);
  }, []);
  const pre = () => {
    const start = dayjs(startTime).subtract(7, 'day');
    const end = dayjs(endTime).subtract(8, 'day');
    setStartTime(start);
    setEndTime(end);
  };
  const next = () => {
    const start = dayjs(startTime).add(7, 'day');
    const end = dayjs(endTime).add(8, 'day');
    setStartTime(start);
    setEndTime(end);
  };
  useEffect(() => {
    const list = [] as any;
    for (let i = 0; i < 7; i++) {
      list.push(dayjs(startTime).add(i, 'day'));
    }
    console.log(list);
    setList(list);
  }, [startTime]);

  return (
    <View className='component-date-picker'>
      <View className='picker-top flex'>
        <View className='pre' onClick={pre}></View>
        <View className='time'>
          {dayjs(startTime).format('YYYY.MM.DD')}-
          {dayjs(endTime).format('YYYY.MM.DD')}
        </View>
        <View className='pre next' onClick={next}></View>
      </View>
      <View className='list flex'>
        {list.length &&
          list.map((item) => {
            return (
              <View key={item} className='list-item flex'>
                <View className='week'>{eumn[dayjs(item).get('day')]}</View>
                <View
                  className={`day flex ${
                    selectTime === dayjs(item).valueOf() ? 'select' : ''
                  } ${utils.isToday(dayjs(item).valueOf()) ? 'today' : ''}`}
                  onClick={() => {
                    setSelectTime(dayjs(item).valueOf());
                    props.change(dayjs(item).valueOf());
                  }}
                >
                  {dayjs(item).get('date')}
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};
export default DatePicker;
