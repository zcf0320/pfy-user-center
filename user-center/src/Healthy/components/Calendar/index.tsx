import { Component } from 'react';
import { AtCalendar } from 'taro-ui';
import './index.scss';

interface IProps {
  change: Function;
}

export default class Calendar extends Component<IProps> {
  change (val) {
    this.props.change(val);
  }

  render () {
    return (
      <AtCalendar
        maxDate={new Date()}
        isSwiper={false}
        monthFormat='YYYY.MM'
        onDayClick={val => {
          const time = val.value.split('-').join('/');
          this.change(new Date(time).getTime());
        }}
      />
    );
  }
}
