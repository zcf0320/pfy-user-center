import { Component } from 'react';
import { View, Input } from '@tarojs/components';
import i18n from '@i18n/index';
import './index.scss';

interface IProps {
  saveForm: Function;
  placeholder: string;
  setValue?: Function;
  keyValue: string;
}
interface IState {
  inputVal: string;
}
export default class InputItem extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      inputVal: ''
    };
  }

  setValue = val => {
    this.setState({
      inputVal: val
    });
  };

  render () {
    const { placeholder } = this.props;
    const { inputVal } = this.state;
    return (
      <View className='InputItem-page'>
        <Input
          className='input'
          type='number'
          placeholderClass='placeholder'
          maxlength={3}
          placeholder={placeholder}
          onInput={(e: any) => {
            this.setValue(e.detail.value);
          }}
        />
        <View className='flex-center'>
          <View
            className={`btn-box flex-center ${!inputVal ? 'disable' : ''}`}
            onClick={() => {
              this.props.saveForm(this.props.keyValue, inputVal);
            }}
          >
            {i18n.chain.button.save}
          </View>
        </View>
      </View>
    );
  }
}
