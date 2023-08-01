import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View, Input, Image } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  confirm: Function;
  value: string;
  placeholder: string;
  showNumber: number | string;
}
function InputModal (props: IProps) {
  const [value, setValue] = useState(props.value);
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <View className='modal-input flex '>
        <View className='left'>
          <Input
            type={props.showNumber !== 3 ? 'number' : 'digit'}
            value={value}
            className='input'
            placeholderClass='placeholder'
            placeholder={props.placeholder}
            onInput={e => {
              setValue(e.detail.value);
            }}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setFocus(false);
              }, 500);
            }}
          ></Input>
        </View>
        {focus
          ? (
          <Image
            src={`${ossHost}images/close.png`}
            className='close'
            onClick={() => {
              setValue('');
            }}
          ></Image>
            )
          : null}
      </View>
      <View
        className={`confirm ${value ? 'active' : ''}`}
        onClick={() => {
          if (!value) {
            return;
          }
          let error = '';
          const { showNumber } = props;
          // 身高校验
          if (showNumber === 1) {
            if (
              Number(value) < 1 ||
              Number(value) > 300 ||
              !utils.testInt(value)
            ) {
              error = '请输入正确的身高';
            }
          }
          if (showNumber === 2) {
            if (
              Number(value) < 10 ||
              Number(value) > 100 ||
              !utils.testNumber(value)
            ) {
              error = '请输入正确的体重';
            }
          }
          if (showNumber === 3) {
            if (Number(value) > 1000 || !utils.testNumber(value)) {
              error = '请输入正确的空腹血糖';
            }
          }
          if (error) {
            Taro.showToast({
              title: error,
              icon: 'none',
              duration: 2000
            });
            return;
          }
          props.confirm(value);
        }}
      >
        确认
      </View>
    </View>
  );
}
export default InputModal;
