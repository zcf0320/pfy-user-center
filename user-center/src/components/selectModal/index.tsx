
import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

interface IProps {
  confirm: Function;
  list: any;
  selectNum: number;
}
function SelectModal (props: IProps) {
  const [list, setList] = useState(props.list);
  useEffect(() => {
    setList(props.list);
  }, [props.list]);
  const watchSelectArr = () => {
    const { selectNum } = props;
    if (list) {
      const selectList = list.filter(item => {
        return item.select === true;
      });
      return selectList.length === selectNum;
    }
  };
  return (
    <View className='component-select'>
      <View className='select-modal'>
        <View className='modal-top flex'>
          <View className='modal-title'>兑换成功</View>
          <View className='text'>
            请选择服务项({`${list ? list.length : ''}选${props.selectNum}`})：
          </View>
          <View className='select-list'>
            {list && list.length
              ? list.map(item => {
                return (
                    <View
                      className={`select-item flex ${
                        item.select ? 'select' : ''
                      }`}
                      key={item.serviceInfoId}
                      onClick={() => {
                        item.select = !item.select;
                        setList([...list]);
                      }}
                    >
                      {item.serviceInfoName}
                    </View>
                );
              })
              : null}
          </View>
        </View>
        <View
          className={`modal-bottom flex ${watchSelectArr() ? '' : 'disable'}`}
          onClick={() => {
            if (!watchSelectArr()) {
              return;
            }
            props.confirm(list);
          }}
        >
          确认
        </View>
      </View>
    </View>
  );
}
export default SelectModal;
